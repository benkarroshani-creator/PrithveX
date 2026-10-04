import { ClassificationResult } from '../types';

/**
 * AI Classification Service
 *
 * Provider Abstraction supporting:
 * 1. Server-side Google Gemini 3.8 Flash API (/api/classify)
 * 2. Intelligent local rule-based demo classifier (Indian SWM 2016 rules)
 *
 * Designed to ensure the website is 100% functional during hackathon demonstrations,
 * with or without active external API credentials.
 */

export interface ClassifyWasteOptions {
  imageBase64?: string;
  mimeType?: string;
  itemNameHint?: string;
  forceDemo?: boolean;
}

export async function checkAiHealth(): Promise<{ hasGeminiKey: boolean; defaultModel: string }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return {
        hasGeminiKey: !!data.hasGeminiKey,
        defaultModel: data.defaultModel || 'gemini-3.8-flash',
      };
    }
  } catch (err) {
    console.warn('[AI Classifier] Health check could not reach server:', err);
  }
  return { hasGeminiKey: false, defaultModel: 'demo_classifier' };
}

export async function classifyWaste(options: ClassifyWasteOptions): Promise<ClassificationResult> {
  const { imageBase64, mimeType = 'image/jpeg', itemNameHint = '', forceDemo = false } = options;

  // Attempt server call
  try {
    const response = await fetch('/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        itemNameHint,
        forceDemo,
      }),
    });

    if (response.ok) {
      const result: ClassificationResult = await response.json();
      return result;
    }
    const errData = await response.json().catch(() => ({}));
    console.warn('[AI Classifier] Server returned error, switching to client fallback:', errData);
  } catch (netErr) {
    console.warn('[AI Classifier] Server network error, executing client fallback:', netErr);
  }

  // Client-side simulated fallback if server endpoint is unreachable
  return runClientMockClassifier(itemNameHint || 'plastic container');
}

function runClientMockClassifier(hint: string): ClassificationResult {
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
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (Schedule II: Category I Rigid Plastic Packaging).',
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
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
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (EPR mandated 100% recycling targets for PET).',
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Flexible Dairy Milk Pouch (LDPE 4)
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
      cpcbRegulation: 'Plastic Waste Management Rules 2016 (EPR mandated brand accountability).',
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Glass Bottle / Jar
  if (query.includes('glass') || query.includes('jar') || query.includes('barni')) {
    return {
      itemName: 'Glass Bottle / Condiment Jar',
      category: 'glass',
      categoryLabel: 'Glass (Dry Recyclable)',
      confidence: 0.97,
      explanation: 'Glass is an inert, 100% infinitely recyclable material that can be melted down endlessly without loss of purity.',
      disposalMethod: 'Empty, rinse with water, remove metal/plastic cap, and place carefully in Blue Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Rinse out food or sauce residues.',
        'Separate metal crown cap or plastic lid.',
        'If intact, place gently without breaking.'
      ],
      reuseOptions: 'Ideal for storing kitchen spices, pickles, or rooting plants.',
      recyclingOptions: 'Crushed into cullet and melted in glass furnaces into new bottles.',
      warnings: 'Handle broken glass with care; wrap securely to protect manual waste collectors.',
      suggestedNextAction: 'Keep intact and sell to your local kabadiwala.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016.',
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
    };
  }

  // 5. Metal Can / Aluminium Tin
  if (query.includes('can') || query.includes('tin') || query.includes('metal') || query.includes('aluminium')) {
    return {
      itemName: 'Aluminium Beverage Can / Metal Tin',
      category: 'metal',
      categoryLabel: 'Metal (Dry Recyclable)',
      confidence: 0.97,
      explanation: 'Aluminium beverage cans and steel tins are high-value dry recyclables.',
      disposalMethod: 'Rinse out sweet residue, crush flat, and place in Blue Bin.',
      primaryPathway: 'Recyclable',
      binColor: 'blue',
      binName: 'Blue Bin (Dry Recyclable)',
      preparationSteps: [
        'Empty liquid drops.',
        'Rinse quickly with water to prevent insects.',
        'Crush flat to save space.'
      ],
      reuseOptions: 'Upcycle into desk pencil holders or small succulent planters.',
      recyclingOptions: 'Melted down in secondary foundries and recast into new cans.',
      warnings: 'Watch for sharp metal edges when crushed.',
      suggestedNextAction: 'Sell to local scrap dealer (kabadiwala) for cash value.',
      isHazardous: false,
      cpcbRegulation: 'Solid Waste Management Rules 2016.',
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
    };
  }

  // 6. Food Scraps / Organic Wet Waste
  if (query.includes('banana') || query.includes('peel') || query.includes('vegetable') || query.includes('fruit') || query.includes('organic') || query.includes('wet') || query.includes('food')) {
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
      cpcbRegulation: 'Solid Waste Management Rules 2016 (Rule 4: Duty of waste generator to segregate wet waste).',
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
    };
  }

  // 7. Battery
  if (query.includes('battery') || query.includes('cell') || query.includes('lithium')) {
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
      cpcbRegulation: 'Battery Waste Management Rules 2022 (Mandatory Extended Producer Responsibility and safe take-back).',
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
    };
  }

  // 8. Medicine
  if (query.includes('medicine') || query.includes('tablet') || query.includes('paracetamol') || query.includes('strip')) {
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
      cpcbRegulation: 'Biomedical Waste Management Rules 2016 and CPCB domestic pharmaceutical guidelines.',
      provider: 'demo_classifier',
      timestamp: new Date().toISOString(),
    };
  }

  // Default to Rigid Household Plastic Container (NOT milk pouch!)
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
    cpcbRegulation: 'Plastic Waste Management Rules 2016 (Rigid Packaging stream).',
    provider: 'demo_classifier',
    timestamp: new Date().toISOString(),
  };
}
