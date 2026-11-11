import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini client if API key is provided
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('[PrithveX Server] Gemini 3.8 Flash initialized successfully.');
  } catch (err) {
    console.warn('[PrithveX Server] Could not initialize Gemini SDK:', err);
  }
} else {
  console.log('[PrithveX Server] No GEMINI_API_KEY detected. Running in dual mode with demo classifier.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!ai,
    defaultModel: 'gemini-3.8-flash',
    platform: 'PrithveX Waste Intelligence Platform',
    timestamp: new Date().toISOString(),
  });
});

// AI Waste Classification endpoint
app.post('/api/classify', async (req, res) => {
  try {
    let { imageBase64, mimeType = 'image/jpeg', itemNameHint = '', fileName = '', forceDemo = false } = req.body;

    if (!imageBase64 && !itemNameHint && !fileName) {
      return res.status(400).json({ error: 'Please provide an image, item name hint, or file name.' });
    }

    // Extract exact MIME type and clean Base64 if a Data URL is passed
    if (imageBase64) {
      const dataUrlMatch = imageBase64.match(/^data:([a-zA-Z0-9/+-]+);base64,/);
      if (dataUrlMatch && dataUrlMatch[1]) {
        mimeType = dataUrlMatch[1];
      }
      if (imageBase64.includes(',')) {
        imageBase64 = imageBase64.split(',')[1];
      }
    }

    // Derive hint from file name if no explicit hint was typed
    let effectiveHint = itemNameHint.trim();
    if (!effectiveHint && fileName) {
      effectiveHint = sanitizeFileNameToHint(fileName);
    }

    // If Gemini AI is active and user has not forced demo mode
    if (ai && !forceDemo) {
      // Primary model: gemini-3.8-flash, Secondary fallback: gemini-3.1-flash-lite
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

      for (const modelName of candidateModels) {
        try {
          const parts: any[] = [];

          if (imageBase64) {
            parts.push({
              inlineData: {
                data: imageBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            });
          }

          const promptText = `You are PrithveX, an expert Indian Municipal Solid Waste Management (SWM 2016) and circularity AI specialist.
Analyze this waste item accurately based on Indian household waste segregation practices, CPCB guidelines, and local recycling realities.${effectiveHint ? `\nContext/User Hint: "${effectiveHint}"` : ''}

CRITICAL ACCURACY RULES:
- Inspect physical form, material, and context thoroughly.
- DO NOT default to a plastic food container unless it is clearly an injection-molded rigid takeaway tub, dabba, or meal box.
- Organic items (fruits, vegetables, peels, banana, apple, leftover food, tea leaves) MUST be classified as "Wet / Organic Waste" (Green Bin, Compostable).
- Cardboard boxes, courier parcels, shipping cartons, and paper packaging MUST be classified as "Corrugated Cardboard Packaging Box" (Blue Bin, Recyclable).
- Aluminium cans, beverage cans, tins, and foils MUST be classified as "Metal (Dry Recyclable)" (Blue Bin).
- Beverage water bottles MUST be classified as "Plastic Beverage Bottle (PET 1)" (Blue Bin).
- Flexible dairy milk packets MUST be classified as "Milk Pouch (LDPE 4)" (Blue Bin).
- Blister medicine packs, paracetamol, syringes MUST be classified as "Medical / Domestic Hazardous" (Red Bin).
- Batteries, mobile phone cells, lithium power units MUST be classified as "Batteries & Hazardous" (Red Bin).
- Old smartphones, USB cables, earphones, and chargers MUST be classified as "E-Waste" (Special Collection Hub).
- Worn clothes, fabric scraps MUST be classified as "Textile Waste" (Donate / Upcycling).

Provide your response in strictly structured JSON matching this schema:
- itemName: Specific item name (e.g. "Vegetable & Fruit Kitchen Scraps", "Corrugated Cardboard Delivery Box", "Aluminium Beverage Can", "Transparent PET Water Bottle", "Milk Pouch (LDPE 4)", "Lithium-ion Battery", "Expired Medicine Blister Pack")
- category: One of ['wet_organic', 'dry_recyclable', 'paper', 'plastic', 'glass', 'metal', 'e_waste', 'batteries', 'hazardous', 'sanitary', 'medical', 'textile', 'used_cooking_oil', 'special_waste']
- categoryLabel: Readable category label (e.g. "Wet / Organic Waste", "Paper & Cardboard", "Metal (Dry Recyclable)", "Plastic (Dry Recyclable)")
- confidence: Floating number between 0.85 and 0.99
- explanation: Clear 2-3 sentence explanation of material composition, resin/material code, and why it belongs to this stream.
- disposalMethod: Practical disposal method under Indian municipal norms.
- primaryPathway: One of ['Recyclable', 'Reusable', 'Compostable', 'Donate', 'Repair', 'Special collection', 'Hazardous / safe disposal', 'Reject / residual waste']
- binColor: One of ['green', 'blue', 'red', 'black', 'yellow', 'special']
- binName: Specific bin name (e.g. "Green Bin (Wet / Organic)", "Blue Bin (Dry Recyclable)", "Red Bin / Hazardous")
- preparationSteps: Array of 3-4 concise, practical preparation steps before disposal.
- reuseOptions: Feasible reuse or upcycling ideas.
- recyclingOptions: How this item is recycled in India or what products it converts into.
- warnings: Important health, safety, or environmental warnings.
- suggestedNextAction: Immediate recommended action for the user.
- isHazardous: Boolean indicating whether item presents toxic, chemical, bio-hazard, or fire risks.
- cpcbRegulation: Relevant Indian environmental rule (e.g. "Solid Waste Management Rules 2016", "Plastic Waste Management Rules 2016", "Battery Waste Management Rules 2022").`;

          parts.push({ text: promptText });

          const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              responseMimeType: 'application/json',
            },
          });

          const rawText = response.text || '';
          const parsed = JSON.parse(rawText);

          return res.json({
            ...parsed,
            provider: modelName,
            timestamp: new Date().toISOString(),
          });
        } catch (modelError: any) {
          console.warn(`[PrithveX] Model ${modelName} error:`, modelError?.message || modelError);
          // Loop continues to next candidate model (e.g., flash-lite)
        }
      }
    }

    // Local Deterministic / Rule-based Indian waste classifier for demo or fallback
    const result = runLocalDemoClassifier(effectiveHint, imageBase64);
    return res.json({
      ...result,
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
      note: 'Processed via PrithveX rule-based classification engine. Grounded in Indian SWM 2016 standards.',
    });
  } catch (err: any) {
    console.error('[PrithveX Server Error]', err);
    res.status(500).json({ error: 'Failed to classify waste item. ' + (err.message || '') });
  }
});

function sanitizeFileNameToHint(fileName: string): string {
  if (!fileName) return '';
  return fileName
    .replace(/\.[a-zA-Z0-9]+$/, '') // strip extension
    .replace(/[_-]+/g, ' ') // replace dashes and underscores
    .replace(/\b(img|image|photo|pic|screenshot|camera|dscn|pxl|sample)\b/gi, '') // remove generic camera tags
    .replace(/[0-9]+/g, ' ') // strip numbers
    .trim();
}

function runLocalDemoClassifier(hint: string, imageBase64?: string) {
  const query = (hint || '').toLowerCase();

  // 1. Corrugated Cardboard / Delivery Box / Amazon Carton / Paper Packaging (PRIORITIZED BEFORE PLASTICS)
  if (
    query.includes('cardboard') ||
    query.includes('carton') ||
    query.includes('amazon') ||
    query.includes('parcel') ||
    query.includes('shipping box') ||
    query.includes('courier') ||
    query.includes('kraft') ||
    (query.includes('box') && !query.includes('plastic') && !query.includes('tiffin') && !query.includes('meal') && !query.includes('container') && !query.includes('tub'))
  ) {
    return {
      itemName: 'Corrugated Cardboard Packaging Box (Kraft Paper)',
      category: 'paper',
      categoryLabel: 'Paper & Cardboard (Dry Recyclable)',
      confidence: 0.97,
      explanation: 'High-grade brown corrugated kraft cardboard widely used in e-commerce and retail parcel boxes. It is 100% biodegradable and among the highest-value dry paper recyclables in India.',
      disposalMethod: 'Peel off plastic courier tape, flatten horizontally, keep completely dry, and place in Blue Bin or bundle for local Kabadiwala.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Peel away plastic adhesive tape, bubble wrap, and sticky courier bills.',
        'Flatten box completely flat to reduce bulk and storage volume by 80%.',
        'Store in a dry location away from water or kitchen grease (wet fibers degrade pulp quality).'
      ],
      reuseOptions: 'Excellent for household pantry storage, cat scratching pads, gardening weed suppression mulch, or outgoing mail parcels.',
      recyclingOptions: 'Re-pulped in Indian paper mills to manufacture fresh secondary carton sheets, egg trays, and paper core tubes up to 7 cycles.',
      warnings: 'Do not mix oil-soaked greasy pizza box sections with clean cardboard; tear off clean flaps for paper recycling and put greasy sections into compost.',
      suggestedNextAction: 'Bundle dry flattened cardboard boxes together and sell to your local doorstep kabadiwala for Rs 12–18/kg.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Schedule II: High-Value Recyclables).'
    };
  }

  // 2. Fresh Fruit / Vegetable Peels / Kitchen Organic Scraps / Banana / Apple
  if (
    query.includes('banana') ||
    query.includes('peel') ||
    query.includes('apple') ||
    query.includes('fruit') ||
    query.includes('vegetable') ||
    query.includes('sabzi') ||
    query.includes('chhilke') ||
    query.includes('kitchen scrap') ||
    query.includes('organic') ||
    query.includes('khamba') ||
    query.includes('compost') ||
    query.includes('food scrap') ||
    query.includes('tea leaves') ||
    query.includes('coffee ground')
  ) {
    return {
      itemName: 'Vegetable & Fruit Kitchen Scraps / Peels',
      category: 'wet_organic',
      categoryLabel: 'Wet / Organic Waste (Biodegradable)',
      confidence: 0.98,
      explanation: 'Fresh raw vegetable peels, fruit rinds, and plant cuttings are nitrogen-rich organic matter. They represent 50–60% of domestic municipal solid waste in India.',
      disposalMethod: 'Compost at home in a terracotta pot/khamba or hand over daily to your municipal Green Bin wet waste tipper vehicle.',
      primaryPathway: 'Compostable',
      binColor: 'green',
      binName: 'Green Bin (Wet / Organic Waste)',
      preparationSteps: [
        'Drain off excess cooking water or liquid curries.',
        'Remove any rubber bands, fruit brand stickers, twist-ties, or plastic staples.',
        'Chop large peels or watermelon rinds into 1-inch chunks to speed up aerobic decomposition.'
      ],
      reuseOptions: 'Citrus peels can be fermented with jaggery and water to make natural bio-enzyme cleaners; banana skins can be soaked for potassium-rich plant water.',
      recyclingOptions: 'Biologically converted into rich nutrient compost via aerobic composting, vermicomposting, or decentralized biomethanation (biogas).',
      warnings: 'NEVER tie organic wet waste in conventional plastic polythene bags; anaerobic decomposition in garbage dumps generates dangerous methane and toxic leachate.',
      suggestedNextAction: 'Add to your home balcony compost bin or transfer to the daily municipal green wet waste collection.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Rule 4: Statutory duty of waste generator to segregate wet waste at source).'
    };
  }

  // 3. Aluminium Beverage Can / Metal Tin / Cold Drink Can
  if (
    query.includes('can') ||
    query.includes('aluminium') ||
    query.includes('tin') ||
    query.includes('beverage can') ||
    query.includes('soda can') ||
    query.includes('coke') ||
    query.includes('pepsi') ||
    query.includes('metal') ||
    query.includes('steel')
  ) {
    return {
      itemName: 'Aluminium Beverage Can / Metal Tin',
      category: 'metal',
      categoryLabel: 'Metal (Dry Recyclable)',
      confidence: 0.98,
      explanation: 'Aluminium beverage cans and steel food tins are among the highest-value dry recyclables. Recycling aluminium consumes 95% less energy than extracting raw virgin bauxite ore.',
      disposalMethod: 'Empty remaining liquid drops, rinse quickly with water, crush flat, and place into your Blue Dry Recyclable Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Pour out all liquid completely.',
        'Rinse quickly with half a cup of water to eliminate sugar syrups that attract ants.',
        'Crush flat with your heel to minimize storage volume.'
      ],
      reuseOptions: 'Upcycle into desk pencil holders, succulent planters, or household craft organizers.',
      recyclingOptions: 'Melted down in secondary aluminium foundries and recast into brand-new beverage cans in less than 60 days in an endless closed loop.',
      warnings: 'Be cautious of sharp metal edges when crushing cans.',
      suggestedNextAction: 'Accumulate clean crushed cans and sell for top scrap market cash (Rs 110–140/kg for aluminium) to your local kabadiwala.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Non-hazardous dry recyclable stream).'
    };
  }

  // 4. Transparent Plastic Beverage / Water Bottle (PET 1)
  if (
    query.includes('water bottle') ||
    query.includes('beverage bottle') ||
    query.includes('pet bottle') ||
    query.includes('cold drink bottle') ||
    query.includes('bisleri') ||
    query.includes('kinley') ||
    query.includes('aquafina') ||
    (query.includes('bottle') && !query.includes('glass') && !query.includes('shampoo') && !query.includes('detergent'))
  ) {
    return {
      itemName: 'Transparent Plastic Beverage Bottle (PET 1)',
      category: 'plastic',
      categoryLabel: 'Dry Recyclable (PET Plastic #1)',
      confidence: 0.98,
      explanation: 'Clear beverage and water bottles are made of Polyethylene Terephthalate (Resin #1 PET). It is the single most widely recycled post-consumer plastic in India with a thriving formal recovery value chain.',
      disposalMethod: 'Empty completely, crush flat horizontally, replace the cap onto the crushed bottle, and place into your Blue Dry Recyclable Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Drink or pour out all residual liquid.',
        'Crush flat to reduce transport and collection space by over 70%.',
        'Screw the plastic cap back on the crushed bottle so small caps do not slip into waterways.'
      ],
      reuseOptions: 'Repurpose as self-watering plant spikes or household seedling planters; avoid repeated long-term drinking refills under direct sun.',
      recyclingOptions: 'Washed and shredded into clean PET bottle flakes, which are re-extruded into recycled polyester yarn (rPET) for apparel, shoes, and automotive acoustic felt.',
      warnings: 'DO NOT BURN: Open incineration releases volatile organic compounds and carcinogenic soot.',
      suggestedNextAction: 'Crush, cap, and place into Blue Dry Waste Bin or sell to doorstep kabadiwala.',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (Mandatory EPR recycling targets for beverage brands).'
    };
  }

  // 5. Flexible Dairy Milk Pouch (LDPE 4)
  if (
    query.includes('milk pouch') ||
    query.includes('milk packet') ||
    query.includes('doodh') ||
    query.includes('curd packet') ||
    query.includes('dahi packet') ||
    query.includes('amul packet')
  ) {
    return {
      itemName: 'Milk Pouch / Flexible Polyethylene (LDPE 4)',
      category: 'plastic',
      categoryLabel: 'Plastic Film (Dry Recyclable)',
      confidence: 0.96,
      explanation: 'Flexible multilayer Low-Density Polyethylene pouch (Resin #4) used for daily pasteurized milk and curd packaging. When clean and dry, it commands strong circular demand for industrial re-granulation.',
      disposalMethod: 'Cut only partially (leave corner attached), rinse out milk fats with water, air dry thoroughly, and place into Blue Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Snip only a partial cut along the corner — NEVER sever small triangle tips as detached micro-plastics escape recycling screens.',
        'Empty all milk completely into vessel.',
        'Rinse pouch with half a cup of water to remove butterfat residue.',
        'Air dry completely before placing with dry recyclables (greasy milk spoils paper recyclables).'
      ],
      reuseOptions: 'Clean collected pouches can be saved in bulk by residential societies for direct aggregator collection into composite outdoor pavers.',
      recyclingOptions: 'Mechanically pelletized into dark LDPE granules for agricultural drip irrigation pipes, canal linings, and heavy-duty tarpaulins.',
      warnings: 'Tossing unrinsed milk packets into garbage causes sour odor and turns neighboring dry recyclables unrecoverable.',
      suggestedNextAction: 'Rinse, dry, and bundle inside a single pouch for your weekly dry waste collection.',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (EPR mandated brand take-back).'
    };
  }

  // 6. Shampoo / Detergent / Toilet Cleaner Bottle (HDPE 2)
  if (
    query.includes('shampoo') ||
    query.includes('detergent') ||
    query.includes('conditioner') ||
    query.includes('lotion') ||
    query.includes('sanitizer bottle') ||
    query.includes('hdpe') ||
    query.includes('harpic')
  ) {
    return {
      itemName: 'High-Density Polyethylene Bottle (HDPE 2)',
      category: 'plastic',
      categoryLabel: 'Dry Recyclable (HDPE Plastic #2)',
      confidence: 0.96,
      explanation: 'Rigid opaque bottles for personal care and household cleaners are manufactured from HDPE (Resin #2). It is highly durable, chemically resistant, and widely recycled in India.',
      disposalMethod: 'Rinse out lather, drain dry, replace screw cap, and place into Blue Dry Waste Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Add a splash of water, shake to dissolve lingering soap/shampoo, and empty.',
        'Drain and allow interior to dry.',
        'Keep pump or screw cap attached to container.'
      ],
      reuseOptions: 'Refill at zero-waste bulk liquid refill stations or repurpose as a utility watering can for plants.',
      recyclingOptions: 'Extruded into sturdy secondary plastic lumber, agricultural drainage pipes, buckets, and industrial drums.',
      warnings: 'Never reuse old chemical or pesticide containers for food or drinking water storage.',
      suggestedNextAction: 'Store with clean dry plastics for municipal collection or sale to scrap dealer.',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (Category I Rigid Packaging).'
    };
  }

  // 7. Glass Bottle / Pickle Jar / Kaanch ki Barni
  if (
    query.includes('glass') ||
    query.includes('jar') ||
    query.includes('barni') ||
    query.includes('kaanch') ||
    query.includes('sauce bottle')
  ) {
    return {
      itemName: 'Glass Bottle / Condiment Food Jar',
      category: 'glass',
      categoryLabel: 'Glass (Dry Recyclable)',
      confidence: 0.97,
      explanation: 'Inorganic glass (silica) is 100% infinitely recyclable without any loss of chemical purity or transparency. Melting recycled glass cullet cuts kiln energy use by 30%.',
      disposalMethod: 'Empty contents, rinse clean with water, remove metal/plastic lid, and place gently into your Blue Bin or sell to Kabadiwala.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Rinse out pickle oil or sauce residues with water.',
        'Separate metal crown cap or plastic lid for separate binning.',
        'If intact, place gently without breaking. If broken, wrap securely in newspaper and label "Broken Glass".'
      ],
      reuseOptions: 'Superb for storing kitchen spices, homemade pickles, dry lentils, or propagating indoor water plants like money plants.',
      recyclingOptions: 'Crushed into clean glass cullet and melted in industrial glass furnaces into brand-new bottles indefinitely.',
      warnings: 'Never toss loose broken shards into garbage bags; protect manual waste collectors and sanitation staff from severe cuts.',
      suggestedNextAction: 'Keep intact and sell to your local kabadiwala or dry waste collection vehicle.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Non-hazardous inert recyclables).'
    };
  }

  // 8. Rechargeable Battery / Lithium-ion / Mobile Battery / AA Cell
  if (
    query.includes('battery') ||
    query.includes('cell') ||
    query.includes('lithium') ||
    query.includes('powerbank') ||
    query.includes('inverter battery')
  ) {
    return {
      itemName: 'Lithium-ion / Rechargeable Battery Unit',
      category: 'batteries',
      categoryLabel: 'Batteries & Domestic Hazardous',
      confidence: 0.97,
      explanation: 'Lithium-ion and alkaline cells contain heavy metals (cobalt, nickel, manganese) and volatile organic electrolytes. When compacted in garbage trucks or landfills, damaged batteries rupture and ignite severe chemical fires.',
      disposalMethod: 'Tape terminal contacts with insulating tape and hand over to an authorized CPCB battery collection center or brand retail take-back kiosk.',
      primaryPathway: 'Special collection',
      binColor: 'red',
      binName: 'Red Stream / Hazardous E-Waste Kiosk',
      preparationSteps: [
        'Check for swelling, bulging, weeping liquids, or physical puncture.',
        'Cover exposed metallic contact terminals with non-conductive electrical tape.',
        'Store in a small, non-flammable dry cardboard box away from direct heat or moisture.'
      ],
      reuseOptions: 'Tested and certified safe secondary cells can be re-packed by licensed technicians for low-speed solar lighting backups.',
      recyclingOptions: 'Hydrometallurgical chemical refining extracts >90% of critical minerals including cobalt, lithium carbonate, and copper for new battery manufacturing.',
      warnings: 'CRITICAL FIRE AND TOXICITY HAZARD: Never throw batteries into regular household garbage, burn, or puncture.',
      suggestedNextAction: 'Search the PrithveX Recyclers Directory for the nearest authorized battery take-back kiosk.',
      isHazardous: true,
      cpcbRegulation: 'Battery Waste Management Rules 2022 (Mandatory EPR return channelization).'
    };
  }

  // 9. Expired Medicines / Blister Packs / Pharmaceutical Waste
  if (
    query.includes('medicine') ||
    query.includes('tablet') ||
    query.includes('paracetamol') ||
    query.includes('strip') ||
    query.includes('blister') ||
    query.includes('pharma') ||
    query.includes('syrup') ||
    query.includes('capsule')
  ) {
    return {
      itemName: 'Expired Medicines & Blister Strip Packaging',
      category: 'medical',
      categoryLabel: 'Medical / Domestic Hazardous',
      confidence: 0.96,
      explanation: 'Degraded pharmaceutical compounds and composite aluminium-PVC blister strips pose severe toxic chemical risks. Flushing medicines into municipal drains contaminates groundwater and breeds deadly antimicrobial resistance (AMR).',
      disposalMethod: 'Keep tablets in original blister foil, wrap securely in newspaper, mark with a red hazard cross, and deposit at pharmacy return drives or municipal domestic hazardous collection.',
      primaryPathway: 'Hazardous / safe disposal',
      binColor: 'red',
      binName: 'Red Bin / Domestic Hazardous Stream',
      preparationSteps: [
        'Keep tablets sealed in original foil packaging so chemical names remain legible.',
        'NEVER flush syrups or pills down sinks or toilets.',
        'Wrap securely in newspaper and clearly label "Hazardous Medical Waste".'
      ],
      reuseOptions: 'Strictly prohibited due to chemical degradation, expiration, and health risks.',
      recyclingOptions: 'Subjected to controlled high-temperature plasma incineration at authorized Common Biomedical Waste Treatment Facilities (CBWTF).',
      warnings: 'Flushing antibiotics fuels multi-drug-resistant superbugs that threaten public health.',
      suggestedNextAction: 'Check local retail pharmacies or municipal hazardous collection drives for medicine disposal drop-boxes.',
      isHazardous: true,
      cpcbRegulation: 'Biomedical Waste Management Rules 2016 and CPCB Domestic Hazardous Guidelines.'
    };
  }

  // 10. Electronic Device / Cable / Smartphone / Charger (E-Waste)
  if (
    query.includes('phone') ||
    query.includes('charger') ||
    query.includes('cable') ||
    query.includes('wire') ||
    query.includes('headphone') ||
    query.includes('laptop') ||
    query.includes('electronic') ||
    query.includes('e-waste') ||
    query.includes('mouse') ||
    query.includes('keyboard')
  ) {
    return {
      itemName: 'Electronic Device / Cable / Charger (E-Waste)',
      category: 'e_waste',
      categoryLabel: 'E-Waste (Electronic)',
      confidence: 0.96,
      explanation: 'Small consumer electronics and charging accessories contain precious metals (copper, gold, palladium) alongside hazardous lead solders and flame retardants that must not leach into soil.',
      disposalMethod: 'Hand over to authorized CPCB registered e-waste collection drives or retail electronics take-back bins.',
      primaryPathway: 'Special collection',
      binColor: 'special',
      binName: 'Grey Stream (Authorized E-Waste Hub)',
      preparationSteps: [
        'Perform factory reset and remove external SIM/memory cards if device still powers on.',
        'Bundle wires and cables neatly using natural twine or twist-ties.',
        'Never burn wire insulation to extract copper (burning PVC generates lethal cancer-causing dioxins).'
      ],
      reuseOptions: 'Explore repair at certified Right-to-Repair electronics technicians before discarding.',
      recyclingOptions: 'Refined hydrometallurgical and mechanical shredding safely recovers 98% pure copper, precious metals, and recyclable engineering plastics.',
      warnings: 'DANGER: Never hand over e-waste to unorganized street scrap burners using open cyanide acid baths.',
      suggestedNextAction: 'Deposit in the e-waste bin at your local Croma, Reliance Digital, or municipal collection center.',
      isHazardous: true,
      cpcbRegulation: 'E-Waste (Management) Rules 2022.'
    };
  }

  // 11. Used Cooking Oil (RUCO)
  if (
    query.includes('cooking oil') ||
    query.includes('frying oil') ||
    query.includes('kadai oil') ||
    query.includes('ruco') ||
    (query.includes('oil') && !query.includes('bottle') && !query.includes('shampoo'))
  ) {
    return {
      itemName: 'Used Cooking Oil (FSSAI RUCO)',
      category: 'used_cooking_oil',
      categoryLabel: 'Used Cooking Oil (RUCO Stream)',
      confidence: 0.95,
      explanation: 'Vegetable frying oil used for multiple cycles develops dangerous Total Polar Compounds (TPC). Pouring it into kitchen sinks solidifies with detergents into massive sewer fatbergs.',
      disposalMethod: 'Let cool, strain crumbs through a sieve, pour into a sealable plastic jug, and give to an authorized RUCO biofuel aggregator.',
      primaryPathway: 'Special collection',
      binColor: 'special',
      binName: 'Special Container (RUCO Biofuel)',
      preparationSteps: [
        'Allow heated oil to cool down completely to ambient room temperature.',
        'Filter out burnt batter particles using a steel strainer or cloth.',
        'Pour into a clean, screw-top plastic jar and store away from moisture.'
      ],
      reuseOptions: 'Repurpose for homemade utility floor-wash soap or garden tiki torch oil; never consume oil fried more than 3 times.',
      recyclingOptions: 'Industrial transesterification converts collected used cooking oil into clean-burning B100 Biodiesel under FSSAI RUCO.',
      warnings: 'Repeatedly heating oil past 3 cycles produces carcinogenic polymers harmful to cardiovascular health.',
      suggestedNextAction: 'Check the PrithveX Recyclers Directory for your city’s RUCO biofuel drop-off partners.',
      isHazardous: true,
      cpcbRegulation: 'FSSAI RUCO (Repurpose Used Cooking Oil) Regulations & National Policy on Biofuels.'
    };
  }

  // 12. Multilayer Packaging (MLP) / Chips Packet / Biscuit Wrapper
  if (
    query.includes('chips') ||
    query.includes('lays') ||
    query.includes('kurkure') ||
    query.includes('namkeen') ||
    query.includes('biscuit') ||
    query.includes('wrapper') ||
    query.includes('mlp') ||
    query.includes('foil packet')
  ) {
    return {
      itemName: 'Multilayer Plastic Packaging (MLP / Resin #7)',
      category: 'plastic',
      categoryLabel: 'Multilayer Plastic (Dry Waste)',
      confidence: 0.94,
      explanation: 'Composite flexible packaging featuring bonded layers of plastic and microscopic aluminium film. Because the layers cannot be easily delaminated, they are channeled for industrial co-processing.',
      disposalMethod: 'Wipe or shake out food crumbs, flatten, and place into the Blue Dry Recyclable Bin for cement kiln energy recovery.',
      primaryPathway: 'Special collection',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Waste / Co-Processing)',
      preparationSteps: [
        'Empty crumbs and food fragments completely.',
        'Wipe dry with a reusable cloth if greasy inside.',
        'Flatten packet to minimize storage volume.'
      ],
      reuseOptions: 'Can be cut and woven into sturdy upcycled tote bags and stationery pouches by social enterprises.',
      recyclingOptions: 'Co-processed at 1400°C in cement kilns as alternative fuel and raw material (AFR), leaving zero ash residue.',
      warnings: 'Do not burn in open bonfires; burning metallized plastic generates toxic airborne particulates.',
      suggestedNextAction: 'Accumulate with dry plastics for municipal collection under brand Extended Producer Responsibility (EPR).',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (EPR mandated 100% co-processing/energy recovery targets).'
    };
  }

  // 13. Worn Clothes / Cotton Fabrics / Chindi
  if (
    query.includes('cloth') ||
    query.includes('fabric') ||
    query.includes('textile') ||
    query.includes('jeans') ||
    query.includes('shirt') ||
    query.includes('towel') ||
    query.includes('chindi')
  ) {
    return {
      itemName: 'Worn Clothes & Cotton Fabric Scraps (Chindi)',
      category: 'textile',
      categoryLabel: 'Textile Waste (Upcyclable)',
      confidence: 0.94,
      explanation: 'Natural cotton and blended textile garments. India has a rich circular tradition of chindi re-spinning, mattress filling, and cloth swapping.',
      disposalMethod: 'Donate if wearable; if damaged, send to textile recycling drives or local cloth collection bins.',
      primaryPathway: 'Donate',
      binColor: 'special',
      binName: 'Textile Drop-off / Blue Dry Bin',
      preparationSteps: [
        'Wash and dry garments thoroughly (damp or moldy clothes cannot be repurposed).',
        'Sort wearable items into a clean bag for charitable donation.',
        'Cut unwearable rags for household wiping cloths.'
      ],
      reuseOptions: 'Cut into kitchen wiping cloths (pochha), stitch into durable shopping bags, or braid into floor rugs.',
      recyclingOptions: 'Garnetting machines shred scrap cotton into shoddy yarn used for industrial insulation, blankets, and automotive padding.',
      warnings: 'Synthetic polyesters take over 200 years to decompose in landfills and shed microplastics into municipal water runoff.',
      suggestedNextAction: 'Drop off at an NGO collection center (such as Goonj) or give to scrap cloth merchants.',
      isHazardous: false,
      cpcbRegulation: 'Swachh Bharat Mission Urban 2.0 Textile Segregation & Circular Economy Directives.'
    };
  }

  // 14. Thermocol / Expanded Polystyrene (EPS)
  if (query.includes('thermocol') || query.includes('styrofoam') || query.includes('eps')) {
    return {
      itemName: 'Expanded Polystyrene (Thermocol / EPS)',
      category: 'special_waste',
      categoryLabel: 'Special Bulky Dry Waste',
      confidence: 0.92,
      explanation: 'Polystyrene expanded with 98% air and 2% polymer. Extremely bulky and brittle, requiring high volume for minimal scrap weight.',
      disposalMethod: 'Keep unbroken in a closed bag and deposit at municipal Dry Waste Collection Centers (DWCC).',
      primaryPathway: 'Special collection',
      binColor: 'special',
      binName: 'Special Dry Waste Collection',
      preparationSteps: [
        'Ensure the foam is completely dry and free from adhesive shipping tape.',
        'Store in a closed sack so beads do not break and scatter into the wind.',
        'Do not crush into static crumbs.'
      ],
      reuseOptions: 'Acoustic soundproofing panels, architectural models, or fragile crockery shipping cushioning.',
      recyclingOptions: 'Thermal compaction machines densify loose EPS blocks by 90%, which are extruded into photo frames and synthetic timber.',
      warnings: 'DO NOT BURN: Open burning produces hazardous black styrene smoke, carbon monoxide, and toxic soot.',
      suggestedNextAction: 'Check with local municipal Dry Waste Collection Center (DWCC) for foam densification drives.',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (EPR mandate on protective packaging EPS).'
    };
  }

  // 15. Rigid Plastic Food Container / Takeaway Box / Dabba / Tupperware (ONLY WHEN EXPLICITLY MATCHED)
  if (
    query.includes('container') ||
    query.includes('takeaway') ||
    query.includes('tupperware') ||
    query.includes('dabba') ||
    query.includes('tiffin') ||
    query.includes('polypropylene') ||
    query.includes('tub') ||
    query.includes('pp 5')
  ) {
    return {
      itemName: 'Rigid Plastic Food Container / Takeaway Tub (PP 5)',
      category: 'plastic',
      categoryLabel: 'Dry Recyclable (Rigid Plastic PP)',
      confidence: 0.96,
      explanation: 'Injection-molded food containers are manufactured from Polypropylene (Resin #5 PP). They are durable, microwave-safe, and highly recyclable in India’s dry waste stream once cleaned of food oils.',
      disposalMethod: 'Wash out food residues with soap water, air dry, and place into your Blue Dry Recyclable Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Rinse thoroughly to remove curries, gravies, and oil coatings.',
        'Wipe or air dry completely (grease degrades neighboring paper recyclables).',
        'Stack together with lids to save collection space.',
        'Do not mix with wet food waste.'
      ],
      reuseOptions: 'Superb for storing pulses, sewing kits, hardware screws, stationery, or as seedling germination pots.',
      recyclingOptions: 'Pelletized into secondary PP granules used for automotive battery cases, buckets, crates, and storage bins.',
      warnings: 'Check the resin identification triangle at the base: Resin #5 (PP) is safe for warm food; avoid microwaving non-numbered brittle containers.',
      suggestedNextAction: 'Wash, dry, and place with dry recyclables for collection by your local scrap collector (kabadiwala).',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (Schedule II: Category I Rigid Plastic Packaging).'
    };
  }

  // 16. Intelligent Multi-Stream Domestic Segregation Guide (Default when no explicit keyword is present)
  // NEVER defaults blindly to "plastic container"
  return {
    itemName: 'Unsegregated Domestic Waste Item / Mixed Dry Packaging',
    category: 'dry_recyclable',
    categoryLabel: 'Dry Recyclable (Multi-Stream)',
    confidence: 0.88,
    explanation: 'General household item identified under Indian Municipal Solid Waste Management (SWM 2016) guidelines. To maintain circular recycling value, separate wet organic residues from clean dry recyclables.',
    disposalMethod: 'Inspect material: Place clean paper, plastic, metal, and glass into the Blue Dry Bin. Place organic food scraps into the Green Wet Bin. Place chemicals/batteries into the Red Bin.',
    primaryPathway: 'Recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Recyclable)',
    preparationSteps: [
      'Empty any organic or liquid residues completely.',
      'Ensure the material is dry and clean before placing with dry recyclables.',
      'If organic, peel, or food scrap, redirect to the Green Wet Waste Bin.',
      'If electrical, chemical, or battery, redirect to the Red Domestic Hazardous Bin.'
    ],
    reuseOptions: 'Check if this item can be cleaned and repurposed for home storage, crafting, or repair before discarding.',
    recyclingOptions: 'Segregated dry recyclables are collected by municipal workers and informal kabadiwalas for secondary material recovery.',
    warnings: 'Avoid mixing wet food waste with dry paper or plastic packaging; moisture and oils contaminate high-value recyclables.',
    suggestedNextAction: 'Identify specific material type (Plastic, Paper, Metal, or Organic) using the instant material filters below.',
    isHazardous: false,
    cpcbRegulation: 'Solid Waste Management Rules 2016 (Mandatory 3-stream source segregation).'
  };
}

// Development Vite Middleware setup or Production Static Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PrithveX Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
