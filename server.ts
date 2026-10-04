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
    let { imageBase64, mimeType = 'image/jpeg', itemNameHint = '', forceDemo = false } = req.body;

    if (!imageBase64 && !itemNameHint) {
      return res.status(400).json({ error: 'Please provide either an image or an item name hint.' });
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
Analyze this waste item${itemNameHint ? ` (Item hint: "${itemNameHint}")` : ''} accurately based on Indian household waste segregation practices, CPCB guidelines, and local recycling realities.

CRITICAL INSTRUCTION FOR ACCURACY:
- Inspect the physical form and material of the object carefully.
- If it is a rigid plastic container, takeaway tub, meal box, dabba, or tupperware, classify it as "Rigid Plastic Container / Food Tub (PP 5 or HDPE 2)", NOT a milk pouch!
- If it is a plastic beverage or water bottle, classify it as "Plastic Beverage Bottle (PET 1)".
- If it is a shampoo, conditioner, or detergent bottle, classify it as "HDPE Plastic Bottle (Resin #2)".
- If it is a flexible dairy pouch, classify it as "Milk Pouch (LDPE 4)".
- If it is a crisp or snack packet, classify it as "Multilayer Plastic Packaging (MLP / Resin #7)".
- If it is an organic fruit, vegetable, or kitchen scrap, classify it as "Wet / Organic Waste".
- If it is a battery, expired medicine, or electronic item, classify it with appropriate hazardous warnings.

Provide your response in strictly structured JSON matching this schema:
- itemName: Specific item name (e.g. "Rigid Plastic Food Container (PP 5)", "Transparent PET Water Bottle", "Banana Peel", "Paracetamol Blister Strip")
- category: One of ['wet_organic', 'dry_recyclable', 'paper', 'plastic', 'glass', 'metal', 'e_waste', 'batteries', 'hazardous', 'sanitary', 'medical', 'textile', 'used_cooking_oil', 'special_waste']
- categoryLabel: Readable category label (e.g. "Dry Recyclable (Rigid Plastic PP)", "Wet / Organic Waste")
- confidence: Floating number between 0.85 and 0.99
- explanation: Clear 2-3 sentence explanation of material composition, resin code, and why it belongs to this stream.
- disposalMethod: Practical disposal method under Indian municipal norms.
- primaryPathway: One of ['Recyclable', 'Reusable', 'Compostable', 'Donate', 'Repair', 'Special collection', 'Hazardous / safe disposal', 'Reject / residual waste']
- binColor: One of ['green', 'blue', 'red', 'black', 'yellow', 'special']
- binName: Specific bin name (e.g. "Blue Bin (Dry Recyclable)", "Green Bin (Wet / Organic)", "Red Bin / Hazardous")
- preparationSteps: Array of 3-4 concise, practical preparation steps before disposal (e.g., wash off oils, air dry, remove labels).
- reuseOptions: Feasible reuse or upcycling ideas (e.g., pantry storage, seed nursery, or "None").
- recyclingOptions: How this item is recycled in India or what products it converts into.
- warnings: Important health, safety, or environmental warnings (e.g. avoid microwaving non-PP plastics, avoid burning).
- suggestedNextAction: Immediate recommended action for the user (e.g., "Wash, dry and place in Blue Dry Waste Bin").
- isHazardous: Boolean indicating whether item presents toxic, chemical, bio-hazard, or fire risks.
- cpcbRegulation: Relevant Indian environmental rule (e.g. "Plastic Waste Management Rules 2016", "Solid Waste Management Rules 2016").`;

          parts.push({ text: promptText });

          const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1,
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
    const result = runLocalDemoClassifier(itemNameHint || 'plastic container');
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

function runLocalDemoClassifier(hint: string) {
  const query = hint.toLowerCase();

  // 1. Rigid Plastic Container / Takeaway Box / Dabba / Tupperware
  if (
    query.includes('container') ||
    query.includes('tub') ||
    query.includes('box') ||
    query.includes('dabba') ||
    query.includes('tupperware') ||
    query.includes('takeaway') ||
    query.includes('polypropylene') ||
    query.includes('pp') ||
    query.includes('tiffin')
  ) {
    return {
      itemName: 'Rigid Plastic Food Container / Takeaway Box (PP 5)',
      category: 'plastic',
      categoryLabel: 'Dry Recyclable (Rigid Plastic PP)',
      confidence: 0.96,
      explanation: 'Rigid injection-molded food containers are typically made from Polypropylene (Resin #5 PP). They are durable, microwave-safe, and highly recyclable in India’s dry waste stream once cleaned of food oils.',
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

  // 2. Plastic Beverage / Water Bottle (PET 1)
  if (
    query.includes('water bottle') ||
    query.includes('beverage bottle') ||
    query.includes('pet bottle') ||
    query.includes('cold drink bottle') ||
    query.includes('bisleri') ||
    query.includes('kinley')
  ) {
    return {
      itemName: 'Transparent Plastic Beverage Bottle (PET 1)',
      category: 'plastic',
      categoryLabel: 'Dry Recyclable (PET Plastic #1)',
      confidence: 0.98,
      explanation: 'Clear beverage bottles are made of Polyethylene Terephthalate (PET 1). It is the single most valuable and widely recycled post-consumer plastic in India.',
      disposalMethod: 'Empty, rinse, crush horizontally, screw cap back on, and put in Blue Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Drink or pour out all liquid completely.',
        'Crush flat with your foot to reduce storage volume by 70%.',
        'Keep the plastic cap screwed onto the crushed bottle so small caps do not choke marine life.'
      ],
      reuseOptions: 'Can be converted into home garden drip-feeders or plant pots; avoid continuous long-term drinking refills.',
      recyclingOptions: 'Shredded into clean PET flakes and spun into recycled polyester yarn (rPET) for garments, bags, and blankets.',
      warnings: 'Do not burn; open burning emits harmful polycyclic aromatic hydrocarbons.',
      suggestedNextAction: 'Crush, cap, and place in Blue Dry Bin or sell for cash value to your doorstep kabadiwala.',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (EPR mandated 100% recycling targets for PET).'
    };
  }

  // 3. Shampoo / Detergent / Oil Bottle (HDPE 2)
  if (
    query.includes('shampoo') ||
    query.includes('detergent') ||
    query.includes('lotion') ||
    query.includes('sanitizer bottle') ||
    query.includes('hdpe')
  ) {
    return {
      itemName: 'High-Density Polyethylene Bottle (HDPE 2)',
      category: 'plastic',
      categoryLabel: 'Dry Recyclable (HDPE Plastic #2)',
      confidence: 0.95,
      explanation: 'Opaque rigid bottles used for shampoos, body washes, and household detergents are made from HDPE (Resin #2). Highly durable with high circular value.',
      disposalMethod: 'Rinse out soap lather, drain water, replace cap, and bin in Blue Dry Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Add a splash of water, shake to rinse out shampoo lather, and empty.',
        'Allow inside to dry.',
        'Leave pump or screw cap on.'
      ],
      reuseOptions: 'Refill at bulk refill stations or repurpose for watering indoor plants.',
      recyclingOptions: 'Extruded into agricultural drainage pipes, sturdy plastic lumber, floor tiles, and detergent jugs.',
      warnings: 'Do not store food or drinking water in former chemical or detergent bottles.',
      suggestedNextAction: 'Rinse, cap, and store with dry plastics.',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (Category I Rigid Plastics).'
    };
  }

  // 4. Flexible Dairy Milk Pouch (LDPE 4)
  if (
    query.includes('milk pouch') ||
    query.includes('milk packet') ||
    query.includes('doodh') ||
    query.includes('curd packet') ||
    query.includes('dahi packet')
  ) {
    return {
      itemName: 'Milk Pouch / Flexible Packaging (LDPE 4)',
      category: 'plastic',
      categoryLabel: 'Plastic (Dry Recyclable)',
      confidence: 0.95,
      explanation: 'Flexible polyethylene pouch (Resin #4) widely used in India for dairy packaging. Highly recyclable when clean, dry, and collected in volume.',
      disposalMethod: 'Empty, rinse, air dry, and place into the blue dry waste bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Snip only a partial slit along the corner — never cut off detached plastic corner triangles.',
        'Empty all milk droplets completely.',
        'Rinse with half a cup of water to wash out residual fats.',
        'Air dry thoroughly before putting with dry recyclables.'
      ],
      reuseOptions: 'Clean bulk pouches can be collected by housing societies for direct pallet recycling into durable poly-tiles.',
      recyclingOptions: 'Re-granulated into plastic pellets for agricultural irrigation drip pipes, canal liners, and heavy-duty tarpaulins.',
      warnings: 'Throwing unrinsed milk packets with wet waste causes sour putrefaction and spoils surrounding dry recyclable paper.',
      suggestedNextAction: 'Rinse, dry, and store together with other plastic bags for the weekly dry waste collection.',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (EPR mandated brand accountability).'
    };
  }

  // 5. Glass Bottle / Condiment Jar
  if (query.includes('glass') || query.includes('jar') || query.includes('barni') || query.includes('sauce bottle')) {
    return {
      itemName: 'Glass Bottle / Condiment Jar',
      category: 'glass',
      categoryLabel: 'Glass (Dry Recyclable)',
      confidence: 0.97,
      explanation: 'Glass is an inert, 100% infinitely recyclable material that can be melted down endlessly without loss of purity or structural integrity.',
      disposalMethod: 'Empty, rinse with water, remove metal/plastic cap, and place carefully in Blue Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Rinse out food or sauce residues.',
        'Separate metal crown cap or plastic lid.',
        'If intact, place gently without breaking. If broken, wrap in newspaper and label "Broken Glass".'
      ],
      reuseOptions: 'Ideal for storing kitchen spices, pickles, dry pulses, or rooting water plant cuttings.',
      recyclingOptions: 'Crushed into cullet and melted in glass furnaces into new bottles, saving 30% kiln energy.',
      warnings: 'Handle broken glass with care; wrap securely to protect manual waste collectors from injuries.',
      suggestedNextAction: 'Keep intact and sell to your local kabadiwala or deposit in the dry waste bin.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Non-hazardous inert recyclables).'
    };
  }

  // 6. Metal Can / Aluminium / Steel Tin
  if (query.includes('can') || query.includes('aluminium') || query.includes('tin') || query.includes('metal') || query.includes('coke can')) {
    return {
      itemName: 'Aluminium Beverage Can / Metal Tin',
      category: 'metal',
      categoryLabel: 'Metal (Dry Recyclable)',
      confidence: 0.97,
      explanation: 'Aluminium and steel food tins are high-value dry recyclables. Recycling aluminium saves 95% of the electrical energy required to smelt virgin bauxite ore.',
      disposalMethod: 'Rinse out sweet residue, crush flat, and place in Blue Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Empty liquid drops.',
        'Rinse quickly with water to prevent ants and flies.',
        'Crush flat to save storage space.'
      ],
      reuseOptions: 'Upcycle into desk pencil holders, small succulent planters, or craft projects.',
      recyclingOptions: 'Melted down in secondary aluminium foundries and recast into new beverage cans within 60 days.',
      warnings: 'Watch for sharp metal edges when crushed.',
      suggestedNextAction: 'Sell to local scrap dealer (kabadiwala) for high scrap value payout.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Dry Recyclables).'
    };
  }

  // 7. Banana / Vegetable / Fruit / Wet Organic Scraps
  if (query.includes('banana') || query.includes('peel') || query.includes('vegetable') || query.includes('fruit') || query.includes('food') || query.includes('organic') || query.includes('sabzi')) {
    return {
      itemName: 'Vegetable & Fruit Kitchen Scraps',
      category: 'wet_organic',
      categoryLabel: 'Wet / Organic Waste',
      confidence: 0.96,
      explanation: 'Fresh plant matter and vegetable rinds are 100% biodegradable and nitrogen-rich. In Indian households, they form 50–60% of daily domestic solid waste.',
      disposalMethod: 'Compost at home in a clay pot/khamba or dispose in the municipal green bin.',
      primaryPathway: 'Compostable',
      binColor: 'green',
      binName: 'Green Bin (Wet / Organic)',
      preparationSteps: [
        'Drain off any dripping cooking liquids or excess water.',
        'Remove rubber bands, wire twists, and plastic stickers from fruit skins.',
        'Chop thick rinds (like watermelon or pumpkin) into 1-inch pieces to speed up decomposition.'
      ],
      reuseOptions: 'Citrus peels make bio-enzyme cleaners; banana skins can be soaked in water to make liquid fertilizer for plants.',
      recyclingOptions: 'Biologically converted into rich nutrient compost via aerobic composting, vermicomposting, or biomethanation.',
      warnings: 'Do not seal in polythene bags before dumping; anaerobic decomposition in landfills produces methane gas and foul leachate.',
      suggestedNextAction: 'Add to your home compost bin or transfer to the daily municipal wet collection vehicle.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Rule 4: Duty of waste generator to segregate wet waste).'
    };
  }

  // 8. Battery / Lithium-ion
  if (query.includes('battery') || query.includes('cell') || query.includes('lithium') || query.includes('powerbank')) {
    return {
      itemName: 'Lithium-ion / Rechargeable Battery',
      category: 'batteries',
      categoryLabel: 'Batteries & Hazardous',
      confidence: 0.95,
      explanation: 'Secondary lithium cells contain cobalt, nickel, flammable organic solvents, and heavy metals. When compressed in garbage trucks, they ignite violent chemical fires.',
      disposalMethod: 'Tape terminals and deposit at authorized CPCB battery collection centers.',
      primaryPathway: 'Special collection',
      binColor: 'red',
      binName: 'Red Stream / E-Waste Hub',
      preparationSteps: [
        'Inspect for bulging, swelling, or liquid leaks.',
        'Cover exposed gold/silver terminals with non-conductive electrical tape.',
        'Place in a small non-metallic dry cardboard container away from sun and heat.'
      ],
      reuseOptions: 'Usable cells can be tested and refurbished for low-power solar backups by certified electronics technicians.',
      recyclingOptions: 'Hydrometallurgical refining recovers >90% of cobalt, lithium carbonate, and copper for battery remanufacturing.',
      warnings: 'CRITICAL FIRE RISK: Never puncture, crush, or toss into household garbage or water drains.',
      suggestedNextAction: 'Locate a nearby authorized battery recycler or electronics brand retail take-back kiosk.',
      isHazardous: true,
      cpcbRegulation: 'Battery Waste Management Rules 2022 (Mandatory Extended Producer Responsibility and safe take-back).'
    };
  }

  // 9. Medicine / Blister Packs
  if (query.includes('medicine') || query.includes('tablet') || query.includes('paracetamol') || query.includes('strip') || query.includes('blister') || query.includes('pharma') || query.includes('syrup')) {
    return {
      itemName: 'Expired Medicines & Blister Packs',
      category: 'medical',
      categoryLabel: 'Medical / Domestic Hazardous',
      confidence: 0.94,
      explanation: 'Degraded chemical pharmaceuticals and composite aluminum-PVC blister packs pose toxic hazards to soil, aquatic life, and informal waste pickers.',
      disposalMethod: 'Keep in original packaging, wrap securely in newspaper, and deposit at pharmacy return drives or domestic hazardous collection.',
      primaryPathway: 'Hazardous / safe disposal',
      binColor: 'red',
      binName: 'Red Bin / Hazardous Collection',
      preparationSteps: [
        'Keep tablets sealed in original blister foil so chemical names remain legible.',
        'Do NOT flush pills or syrups down sinks or toilets (it causes groundwater contamination).',
        'Wrap securely in newspaper and mark with a red hazard cross.'
      ],
      reuseOptions: 'Strictly prohibited due to chemical degradation and health hazards.',
      recyclingOptions: 'High-temperature plasma incineration at Common Biomedical Waste Treatment Facilities (CBWTF).',
      warnings: 'Flushing antibiotics into drainage systems fuels deadly antimicrobial drug resistance (AMR).',
      suggestedNextAction: 'Hand over to a pharmacy drug return kiosk or municipal domestic hazardous waste drive.',
      isHazardous: true,
      cpcbRegulation: 'Biomedical Waste Management Rules 2016 and CPCB domestic pharmaceutical guidelines.'
    };
  }

  // 10. Used Cooking Oil
  if (query.includes('oil') || query.includes('kadai') || query.includes('frying') || query.includes('cooking')) {
    return {
      itemName: 'Used Cooking Oil (RUCO)',
      category: 'used_cooking_oil',
      categoryLabel: 'Used Cooking Oil (RUCO)',
      confidence: 0.92,
      explanation: 'Repeatedly heated vegetable oil develops elevated Total Polar Compounds (TPC). Pouring it down household sinks coagulates with grease into massive municipal sewer fatbergs.',
      disposalMethod: 'Strain food particles, pour into a sealable plastic bottle, and hand over to RUCO biofuel aggregators.',
      primaryPathway: 'Special collection',
      binColor: 'special',
      binName: 'Special Container (RUCO)',
      preparationSteps: [
        'Allow the frying oil to cool completely to room temperature.',
        'Strain through a fine steel sieve or cloth to remove burnt pakora/puri crumbs.',
        'Pour into a clean screw-top plastic bottle and store away from moisture.'
      ],
      reuseOptions: 'Can be converted into homemade utility floor-wash soap or garden torch fuel (never consume food fried more than 3 times).',
      recyclingOptions: 'Industrial transesterification reprocesses used cooking oil into clean-burning B100 Biodiesel under FSSAI RUCO.',
      warnings: 'Re-heating oil past 3 cycles forms carcinogenic polymers and trans-fatty acids harmful to human cardiovascular health.',
      suggestedNextAction: 'Check the PrithveX Recyclers directory for your city’s RUCO biofuel drop-off partners.',
      isHazardous: true,
      cpcbRegulation: 'FSSAI RUCO (Repurpose Used Cooking Oil) Regulations & National Policy on Biofuels.'
    };
  }

  // 11. Cardboard / Paper
  if (query.includes('cardboard') || query.includes('box') || query.includes('carton') || query.includes('amazon') || query.includes('paper')) {
    return {
      itemName: 'Corrugated Cardboard Packaging Box',
      category: 'paper',
      categoryLabel: 'Paper & Cardboard',
      confidence: 0.97,
      explanation: 'High-quality brown corrugated kraft paper used in e-commerce parcel boxes. Excellent strength and high commercial recycling value.',
      disposalMethod: 'Flatten and bundle for local scrap dealer (kabadiwala) or dry waste collection.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Peel off plastic shipping tape, courier labels, and inner bubble wrap.',
        'Flatten the box completely to reduce bulk.',
        'Keep dry; do not expose to kitchen moisture or oils.'
      ],
      reuseOptions: 'Household storage, mailing shipments, cat scratching pads, or carbon mulch in garden compost piles.',
      recyclingOptions: 'Pulped in paper mills to produce new packaging sheets, cardboard cores, and egg cartons up to 7 times.',
      warnings: 'Do not recycle oil-soaked greasy pizza box bases; tear clean dry lids for recycling and put greasy sections in compost.',
      suggestedNextAction: 'Bundle with other dry paper items and sell to your local doorstep kabadiwala.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Dry Recyclables category).'
    };
  }

  // 12. Thermocol / EPS
  if (query.includes('thermocol') || query.includes('styrofoam') || query.includes('eps')) {
    return {
      itemName: 'Expanded Polystyrene (Thermocol / EPS)',
      category: 'special_waste',
      categoryLabel: 'Special / Bulky Dry Waste',
      confidence: 0.91,
      explanation: 'Polystyrene expanded with air (98% air, 2% plastic). Very bulky and brittle, requiring high volume for minimal scrap weight.',
      disposalMethod: 'Keep unbroken in a bag and deposit at specialized municipal dry waste collection centers.',
      primaryPathway: 'Special collection',
      binColor: 'special',
      binName: 'Special Dry Waste Collection',
      preparationSteps: [
        'Ensure the foam is completely dry and free from tape or adhesive glue.',
        'Store in a closed sack so beads do not scatter into the breeze.',
        'Do not break into millions of static beads.'
      ],
      reuseOptions: 'Acoustic soundproofing, architectural modeling, fragile crockery shipping cushioning.',
      recyclingOptions: 'Thermal compaction densifies EPS into solid blocks, which are extruded into photo frames, synthetic timber, and moldings.',
      warnings: 'DO NOT BURN: Open burning produces hazardous black styrene smoke, carbon monoxide, and toxic soot.',
      suggestedNextAction: 'Check with local municipal Dry Waste Collection Center (DWCC) for foam densification drives.',
      isHazardous: false,
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (EPR mandate on protective packaging EPS).'
    };
  }

  // 13. Textile / Clothes
  if (query.includes('cloth') || query.includes('fabric') || query.includes('textile') || query.includes('jeans') || query.includes('shirt') || query.includes('chindi')) {
    return {
      itemName: 'Old Cotton Clothes & Fabric Scraps (Chindi)',
      category: 'textile',
      categoryLabel: 'Textile Waste',
      confidence: 0.93,
      explanation: 'Natural and blended woven textiles. India has a massive circular tradition of chindi re-spinning, mattress filling, and cloth swapping.',
      disposalMethod: 'Donate if wearable; if damaged, send to textile recycling drives or NGO cloth collections.',
      primaryPathway: 'Donate',
      binColor: 'special',
      binName: 'Textile Drop-off / Blue Dry Bin',
      preparationSteps: [
        'Wash and dry garments thoroughly (moldy damp clothes cannot be repurposed).',
        'Check condition: fold wearable items separately for charity donation.',
        'Remove plastic buttons and metal zippers from unwearable rags.'
      ],
      reuseOptions: 'Cut into household kitchen dusters (pochha), stitch into cloth grocery totes, or make traditional rag dhurrie rugs.',
      recyclingOptions: 'Garnetting machines shred scrap cotton into shoddy yarn for industrial insulation, blankets, and auto upholstery.',
      warnings: 'Synthetic polyesters take over 200 years to decompose in landfills and shed microplastics into municipal water runoff.',
      suggestedNextAction: 'Drop off at an NGO collection box (such as Goonj) or give to scrap cloth merchants.',
      isHazardous: false,
      cpcbRegulation: 'Swachh Bharat Mission Urban 2.0 Textile Segregation & Circular Economy Directives.'
    };
  }

  // 14. E-Waste / Electronics / Cables
  if (query.includes('phone') || query.includes('charger') || query.includes('cable') || query.includes('wire') || query.includes('headphone') || query.includes('laptop') || query.includes('electronic')) {
    return {
      itemName: 'Electronic Device / Cable / Charger (E-Waste)',
      category: 'e_waste',
      categoryLabel: 'E-Waste (Electronic)',
      confidence: 0.96,
      explanation: 'Electronic appliances, PCB boards, and copper charging cables contain precious metals alongside hazardous lead and brominated flame retardants.',
      disposalMethod: 'Hand over to authorized CPCB registered e-waste collection drives or retail electronics take-back bins.',
      primaryPathway: 'Special collection',
      binColor: 'special',
      binName: 'Grey Stream (Authorized E-Waste)',
      preparationSteps: [
        'Perform factory reset or remove external SIM/memory cards if device still powers on.',
        'Bundle cables neatly using natural twine or twist-ties.',
        'Do not attempt to burn insulation off wires (generates lethal dioxins).'
      ],
      reuseOptions: 'Explore repair at certified Right-to-Repair technicians before discarding.',
      recyclingOptions: 'Refined hydrometallurgical processing safely extracts gold, silver, palladium, and pure copper.',
      warnings: 'DANGER: Never sell e-waste to unauthorized informal street burners using open cyanide/acid tanks.',
      suggestedNextAction: 'Deposit in the e-waste bin at your local Croma, Reliance Digital, or municipal drop-off hub.',
      isHazardous: true,
      cpcbRegulation: 'E-Waste (Management) Rules 2022.'
    };
  }

  // Default to Generic Rigid Household Plastic (NOT milk pouch!)
  return {
    itemName: 'Rigid Household Plastic Container / Packaging',
    category: 'plastic',
    categoryLabel: 'Dry Recyclable (Rigid Plastic)',
    confidence: 0.91,
    explanation: 'Rigid household plastic item (commonly Polypropylene PP 5 or High-Density Polyethylene HDPE 2). Fully recyclable in the dry stream when clean and dry.',
    disposalMethod: 'Empty contents, rinse lightly with water to remove food/oil residue, dry, and place into the Blue Dry Waste Bin.',
    primaryPathway: 'Recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Recyclable)',
    preparationSteps: [
      'Empty all food residues or liquids completely.',
      'Rinse with water and allow to air dry.',
      'Keep cap or lid attached with container.'
    ],
    reuseOptions: 'Household kitchen storage, tool organizing, or seed germination tray.',
    recyclingOptions: 'Mechanically shredded and pelletized into secondary plastic granules for crates, pipes, and buckets.',
    warnings: 'Avoid burning plastics; open burning releases toxic chemical fumes.',
    suggestedNextAction: 'Rinse, dry, and place into your Blue Dry Waste Bin for your local municipal collector or kabadiwala.',
    isHazardous: false,
    cpcbRegulation: 'Plastic Waste Management Rules 2016 (Rigid Packaging stream).'
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
