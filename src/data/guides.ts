import { EducationalGuide } from '../types';

export const GUIDES: EducationalGuide[] = [
  {
    id: 'guide-composting-khamba',
    title: 'Balcony Composting: The 3-Tier Khamba & Clay Pot Method',
    subtitle: 'Zero foul smell, minimal space: convert kitchen scraps into dark black gold for your home plants.',
    category: 'wet_organic',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    summary: 'A step-by-step masterclass on aerobic kitchen composting in compact Indian apartments using terracotta khambas, coco-peat, and dry leaves.',
    materialsNeeded: [
      'Terracotta 3-tier khamba stack or two 15-litre terracotta planters with drainage holes',
      'Coco-peat brick (soaked in water) or dried crushed neem/peepal leaves (Browns)',
      'Daily chopped vegetable peels and raw fruit scraps (Greens)',
      '1 tablespoon of sour buttermilk or curd water (microbial inoculant)',
      'Garden hand trowel and breathable mesh lid'
    ],
    steps: [
      {
        title: 'Step 1: Balance the Carbon to Nitrogen Ratio (Browns vs Greens)',
        description: 'Aerobic composting thrives when you maintain roughly 2 parts Browns (coco-peat, shredded cardboard, dry leaves) to 1 part Greens (fresh wet kitchen peels). This prevents fruit flies and foul wet odors.',
        tip: 'Never leave wet vegetable peels exposed at the top surface; always cap with a 1-inch blanket of dry coco-peat.'
      },
      {
        title: 'Step 2: Chop Scraps Small',
        description: 'Microbes feed along exposed surface edges. Chopping banana skins, melon rinds, and cauliflower stalks into 1-inch chunks cuts composting time in half (from 75 days down to 35 days).',
        tip: 'Sprinkle 2 spoons of sour buttermilk once a week to seed billions of beneficial aerobic lactic acid bacteria.'
      },
      {
        title: 'Step 3: Rotate and Aerate Weekly',
        description: 'Aerobic bacteria require oxygen. Use your hand trowel to gently turn the top layer once every 5 to 7 days. If the mix feels soggy, add extra dry cocopeat. If it feels dusty bone-dry, mist lightly with water.',
        tip: 'A healthy compost pile emits an earthy fragrance reminiscent of fresh wet soil after the first monsoon rain (Petrichor).'
      },
      {
        title: 'Step 4: Harvesting & Curing',
        description: 'When the top container fills, rotate it to the bottom and let it rest undisturbed for 3–4 weeks. The material will shrink by 70% and become rich, crumbly black vermicompost ready for potting.',
        tip: 'Sieve through a 4mm garden mesh to separate any unbroken mango seeds or avocado pits and toss them back into the active bin.'
      }
    ],
    dos: [
      'Add raw vegetable cuttings, fruit skins, tea bag leaves (remove staple pins), crushed eggshells, and coffee grounds.',
      'Always cover the fresh wet layer with dry leaves or coco-peat to eliminate odor and fungus gnats.',
      'Keep the compost pot in a semi-shaded, well-ventilated balcony or utility terrace.'
    ],
    donts: [
      'Do NOT add cooked oily gravies, sambar, dairy cheese, cooked meats, or fish bones (these attract rats and rot anaerobically).',
      'Do NOT add plastic stickers, plastic tea bags, or dog/cat faeces.',
      'Do NOT expose the compost pot to pouring monsoon rainwater without a protective overhang.'
    ],
    safetyNotes: [
      'Wear cotton gardening gloves when turning compost to protect cuts from soil microbes.',
      'If you notice white fuzzy fungal threads (actinomycetes), do not panic — they are harmless natural decomposers breaking down tough cellulose!'
    ],
    relatedCategories: ['wet_organic']
  },
  {
    id: 'guide-plastics-resin-codes',
    title: 'Deciphering Indian Plastic Resin Codes (1 to 7): What Actually Gets Recycled?',
    subtitle: 'Why the triangle chasing arrows do not always mean recyclable, and what local scrap dealers (kabadiwalas) truly buy.',
    category: 'plastic',
    difficulty: 'Moderate',
    estimatedMinutes: 10,
    summary: 'Understand the polymer chemistry of everyday consumer packaging in India — from PET bottles and HDPE shampoo containers to multilayer chips pouches (MLP).',
    materialsNeeded: [
      'Any plastic container from your home',
      'Magnifying glass or smartphone camera to spot the resin triangle at the base'
    ],
    steps: [
      {
        title: 'Code 1 (PET / PETE) — High Scrap Value',
        description: 'Found in mineral water bottles (Bisleri, Kinley), soft drinks, and cooking oil bottles. Transparent and rigid. Kabadiwalas pay top rupee because PET flakes are spun into polyester fleece and geotextiles.',
        tip: 'Crush the bottle flat with the cap screwed on after drying.'
      },
      {
        title: 'Code 2 (HDPE) & Code 5 (PP) — High Recyclability',
        description: 'Found in milk jugs, shampoo bottles, detergent cans (HDPE 2), and food takeaway containers, medicine bottles, bucket mugs (PP 5). Highly durable and remolded easily into pipes and crates.',
        tip: 'Rinse out thick shampoo and conditioner residue before recycling.'
      },
      {
        title: 'Code 4 (LDPE) — Film Plastics & Milk Pouches',
        description: 'Found in grocery polybags, bubble wraps, and dairy milk pouches. Recyclable if collected clean and dry in bulk bundles.',
        tip: 'Always cut only the partial corner of milk packets so the tiny cut-off does not escape into storm drains.'
      },
      {
        title: 'Code 3 (PVC), 6 (PS / Thermocol), 7 (Other / Multilayer)',
        description: 'Code 3 (pipes, blister packs) releases chlorine when heated. Code 6 (thermocol, disposable cups) is bulky and brittle. Code 7 includes multilayer chips packets (Lays, Kurkure) combining plastic and vaporized aluminum film.',
        tip: 'Multilayer plastics (MLP) cannot be separated mechanically; they are routed to cement kilns for energy co-processing.'
      }
    ],
    dos: [
      'Look for the embossed resin number triangle on the bottom of plastic containers.',
      'Rinse food containers lightly with greywater; dried grease spoils whole recycling batches.',
      'Segregate hard plastics (Code 1, 2, 5) from soft film plastics (Code 4).'
    ],
    donts: [
      'Never burn plastic bags or thermocol in open street piles; this generates carcinogenic dioxins and furans.',
      'Do not throw plastic containers with remaining liquids into dry bins; liquid destroys cardboard and paper.'
    ],
    safetyNotes: [
      'Never microwave food inside single-use Code 6 PS or Code 7 non-BPA containers, as plasticizers leach into hot food.'
    ],
    relatedCategories: ['plastic', 'dry_recyclable']
  },
  {
    id: 'guide-ewaste-battery-safety',
    title: 'E-Waste & Lithium Battery Protocol: Avoiding Toxic Landfill Fires',
    subtitle: 'How to safely decommission dead smartphones, swollen powerbanks, and button cells under CPCB 2022 rules.',
    category: 'e_waste',
    difficulty: 'Moderate',
    estimatedMinutes: 6,
    summary: 'Electronic waste contains both precious metals and lethal neurotoxins. Learn how to store, tape, and channel electronics away from informal acid baths.',
    materialsNeeded: [
      'Non-conductive electrical PVC insulation tape',
      'Small cardboard shoe box or plastic tupperware container',
      'Permanent marker'
    ],
    steps: [
      {
        title: 'Step 1: Terminal Taping for Fire Prevention',
        description: 'Loose 9V batteries and lithium pouch cells can bridge terminals against metal keys or adjacent coin cells in a drawer, generating intense spark friction. Wrap clear or black electrical tape over both positive and negative terminals.',
        tip: 'Do this immediately upon pulling dead batteries from remote controls, toys, or smoke alarms.'
      },
      {
        title: 'Step 2: Identify Swollen or Punctured Batteries',
        description: 'If your powerbank, phone, or laptop battery bulges like a pillow, it has generated flammable gases internally. NEVER pierce or press it. Place it immediately in a metal tin filled with dry sand or baking soda away from curtains.',
        tip: 'Do not charge swollen devices; they can experience runaway thermal combustion within seconds.'
      },
      {
        title: 'Step 3: Personal Data Sanitization',
        description: 'Before handing a phone or laptop to an e-waste aggregator, perform a full cryptographic factory wipe and remove physical SIM and memory cards. If the screen is dead, certified recyclers offer video-recorded shredding certificates.',
        tip: 'Look for CPCB-registered formal recyclers rather than roadside scrap collectors.'
      },
      {
        title: 'Step 4: Deposit at Authorized Collection Centers',
        description: 'Major electronic retail chains (like Croma, Reliance Digital) and authorized brand service centers maintain green e-waste collection bins under Extended Producer Responsibility (EPR) mandates.',
        tip: 'Hulladek, Saahas, and Attero also operate free courier pickup drives in many Indian tier-1 and tier-2 cities.'
      }
    ],
    dos: [
      'Tape battery contacts before storing in a dedicated e-waste box.',
      'Keep old cables, chargers, and dead adapters coiled neatly together.',
      'Choose electronics designed for repairability and modular component replacement.'
    ],
    donts: [
      'NEVER toss button cells or phone batteries into the daily municipal garbage bin.',
      'Never dismantle CRT monitors or compact fluorescent lamps (CFL) as they contain mercury vapor and leaded glass phosphors.',
      'Never sell circuit boards to unauthorized scrap burners who use open cyanide/acid tanks.'
    ],
    safetyNotes: [
      'Inhaling fumes from a punctured lithium battery can cause acute pulmonary irritation. Evacuate the room if a battery begins smoking.'
    ],
    relatedCategories: ['e_waste', 'batteries', 'hazardous']
  },
  {
    id: 'guide-sanitary-dignity-rule4b',
    title: 'Sanitary Waste Protocol: Protecting Health & Dignity of Sanitation Workers',
    subtitle: 'The newspaper wrap and red mark rule under Indian Solid Waste Management Rules 2016.',
    category: 'sanitary',
    difficulty: 'Easy',
    estimatedMinutes: 5,
    summary: 'Sanitation workers handle thousands of tons of domestic waste manually every day. Learn the hygienic, dignified method to package sanitary napkins and diapers.',
    materialsNeeded: [
      'Old newspaper sheets (2 to 3 broadsheet pages)',
      'Red sketch pen, red marker, or red bindi sticker'
    ],
    steps: [
      {
        title: 'Step 1: Inward Enclosure',
        description: 'Roll the used menstrual pad or baby diaper firmly inward so the soiled absorbent surface is completely concealed inside its own outer plastic or adhesive backing.',
        tip: 'Do not flush down toilets; superabsorbent sodium polyacrylate gel expands 300x in water, instantly causing severe sewer line blockages.'
      },
      {
        title: 'Step 2: Multi-Layer Newspaper Wrap',
        description: 'Wrap the folded pad securely in 2 to 3 full layers of clean newspaper. Fold all corners tightly so the packet cannot open accidentally during transport in the municipal garbage tipper.',
        tip: 'Newspaper absorbs moisture and blocks odor naturally.'
      },
      {
        title: 'Step 3: The Red Mark Indicator (Rule 4b SWM 2016)',
        description: 'Draw a prominent red cross or paste a red bindi on the outside of the newspaper package. This universally signals to the waste collector that the package contains personal sanitary waste, allowing them to segregate it without unravelling the package.',
        tip: 'This simple 5-second action saves a waste worker from direct pathogen exposure and Hepatitis transmission.'
      }
    ],
    dos: [
      'Always wrap used pads and diapers in newspaper before handover.',
      'Affix a visible red marking or cross on the package.',
      'Hand over to the municipal vehicle driver directly in the sanitary/reject compartment.'
    ],
    donts: [
      'Never throw unwrapped pads or tampons into the dry recyclable bin.',
      'Never mix medical sharps (needles) loosely with sanitary pads; needles must be placed in a puncture-proof plastic bottle.'
    ],
    safetyNotes: [
      'Universal precaution: Treat all bodily fluids as potentially infectious. Wash hands thoroughly with soap after handling.'
    ],
    relatedCategories: ['sanitary', 'medical']
  },
  {
    id: 'guide-5r-indian-household',
    title: 'The 5R Framework for Modern Indian Households: Refuse to Rot',
    subtitle: 'Moving beyond just "Recycle" to Refuse, Reduce, Reuse, Repurpose, and Rot (Compost).',
    category: 'general_sustainability',
    difficulty: 'Easy',
    estimatedMinutes: 7,
    summary: 'India has an innate historical culture of circularity and frugality. Reclaim modern zero-waste living with actionable everyday swaps.',
    materialsNeeded: [
      'Cotton cloth tote bag kept in your vehicle or backpack',
      'Stainless steel water bottle',
      'Steel tiffin box for restaurant takeaways'
    ],
    steps: [
      {
        title: '1. Refuse: The First Line of Defense',
        description: 'Refuse single-use plastic straws, promotional flyers, disposable plastic cutlery, and flimsy polybags when shopping for vegetables at local sabzi mandis. Carry 3 small cloth pouches inside a master tote.',
        tip: 'Tell delivery apps "Do not send disposable cutlery" on Swiggy and Zomato.'
      },
      {
        title: '2. Reduce: Conscious Consumption',
        description: 'Audit your pantry before grocery trips to avoid fresh produce spoilage. Buy grains and pulses in bulk to minimize multiple small multilayer plastic packets.',
        tip: 'Plan weekly meals around perishables like spinach and coriander that wilt fastest.'
      },
      {
        title: '3. Reuse & Repair: The Indian "Jugaad" Wisdom',
        description: 'Support local cobblers (mochi), tailor shops, mixer-grinder mechanics, and mobile screen replacement technicians under the Right to Repair movement instead of quick discarding.',
        tip: 'Glass Horlicks and pickle jars can serve for generations as spice containers.'
      },
      {
        title: '4. Repurpose / Upcycle',
        description: 'Worn cotton tees become cleaning rags (pochha), tender coconut shells transform into rustic succulent pots, and empty biscuit tins store sewing threads.',
        tip: 'Upcycling breathes fresh utility into items before they reach the recycling stage.'
      },
      {
        title: '5. Rot (Compost) & Recycle',
        description: 'Close the loop by converting wet organic food waste into black soil amendments, and channeling clean dry recyclables to registered scrap aggregators.',
        tip: 'Recycling should be the last resort when Refuse and Reuse have done their job.'
      }
    ],
    dos: [
      'Keep a foldaway cloth bag in your everyday bag at all times.',
      'Patronize local repair shops and kabadiwalas.',
      'Segregate at source every single day without exception.'
    ],
    donts: [
      'Do not rely solely on recycling; recycling consumes energy and water, whereas Refusing uses zero resources.',
      'Do not throw mixed unsegregated waste into black garbage bags.'
    ],
    safetyNotes: [
      'Empower domestic househelp and family members through positive reinforcement rather than punitive reprimands.'
    ],
    relatedCategories: ['wet_organic', 'dry_recyclable', 'plastic', 'paper']
  }
];
