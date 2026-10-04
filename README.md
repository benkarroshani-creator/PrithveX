# PrithveX (पृथ्वेX)
### Intelligent Waste Segregation, Circular Recycling & Responsible Disposal Platform for India

> **"Know your waste. Sort it right. Close the loop for a cleaner India."**

---

## 1. Project Overview & Name
**PrithveX** is derived from *'Prithvi'* (Sanskrit for Mother Earth) and the symbol *'X'* (representing Circular Transformation and Multiplying Impact). 

PrithveX is a modern, responsive web application engineered to solve the most critical gap in Indian municipal solid waste management: **the lack of source segregation**. 

By combining vision-assisted AI classification, an indexed catalog of 30+ everyday Indian household items, a verified multi-city recycler directory, community action tracking, and civic grievance reporting, PrithveX empowers citizens, housing societies, and municipal wards to divert waste from landfills.

---

## 2. The Problem Statement in India
- **Massive Waste Generation:** Indian urban local bodies generate over **62 million tonnes** of municipal solid waste annually (~0.5 kg/person/day in cities), growing at 5% per year.
- **Low Source Segregation Efficiency:** Only **~20–25%** of household waste is currently segregated at the doorstep into wet (green) and dry (blue) streams.
- **Contamination & Landfill Fires:** When wet organic kitchen scraps mix with dry plastic or paper, the entire lot turns into foul, soggy refuse. Kabadiwalas and Material Recovery Facilities (MRFs) cannot recover contaminated plastics. As a result, 70% of waste ends up in towering open dump sites (such as Ghazipur in Delhi or Deonar in Mumbai), generating toxic leachate and methane fires.
- **Informal Worker Health & Dignity:** Millions of sanitation workers and informal ragpickers manually sift through unsegregated rubbish, exposing themselves to Hepatitis, needle pricks, broken glass cuts, and rotting sanitary waste.

---

## 3. The PrithveX Solution
PrithveX provides an integrated digital ecosystem:
1. **Source Segregation at the Point of Discard:** Instant multimodal AI vision recognition tells the citizen exactly which bin color to use (Green, Blue, Red, Grey, Black) and provides specific preparation steps (rinse, dry, do not snip corners of milk pouches, wrap sanitary pads in newspaper with red mark).
2. **Searchable Indian Waste Database ("What Should I Do?"):** A catalog of 30+ common Indian items detailing reuse, repair, donation, composting, recycling feasibility, and statutory CPCB rules.
3. **Verified Recyclers Directory:** Connects households and residential societies with certified recyclers across major Indian hubs (Bengaluru, Mumbai, Delhi-NCR, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad) with doorstep pickup and buyback prices.
4. **Civic Waste Issue Grievance Reporting:** Allows citizens to snap photos of illegal dumping black-spots or overflowing community dustbins, generating unique tracking tickets (`PVX-2026-XXXX`) with municipal workflow tracking.
5. **Community Action Wall & Moderation Portal:** A curated platform for sharing zero-waste hacks, balcony composting tips, and society cleanups, with built-in moderation controls.
6. **Transparent Impact Dashboard:** Citizen tracking for items sorted, waste diverted (kg), and CO₂ equivalent emissions mitigated, backed by transparent mathematical formulas.

---

## 4. Key Features
| Feature | Description | Indian Context / Statutory Standard |
| :--- | :--- | :--- |
| **AI Waste Identifier** | Upload photo or type item hint. Identifies material, confidence score, and bin assignment. | SWM Rules 2016 (Green/Blue/Red bins) |
| **Dual AI Provider** | Live server-side **Gemini 3.8 Flash** with instant local rule-based fallback. | Works offline/online with zero demo disruption |
| **10-Point Disposal Protocol** | Answers: What is it, Category, Can it be Reused, Repaired, Donated, Recycled, Prep steps, Destination, Safety warnings, and Recycler type. | Comprehensive circular audit checklist |
| **Recycler Hubs** | Filters by City, Material Category, Collection Method, and Verified status. | CPCB & State Pollution Control Board registered |
| **RUCO & Biofuel Integration** | Guidance and drop-off points for Used Cooking Oil (kadai oil). | FSSAI RUCO (Repurpose Used Cooking Oil) |
| **Sanitary Waste Protocol** | Step-by-step guidance on wrapping pads/diapers in newspaper with a red indicator mark. | SWM Rules 2016 (Rule 4b) |
| **Civic Grievance Reporting** | Photo evidence, GPS/address, unique ticket ID, and status lifecycle (Submitted → Under review → Assigned → Resolved). | Swachhata / Municipal ward complaint model |
| **Citizen Impact Dashboard** | Quantifies diverted kilograms and CO₂e mitigation with badge milestones. | Transparent CPCB heuristic calculations |
| **Moderator / Admin Portal** | Dedicated view for judges and moderators to approve community posts, update municipal ticket statuses, and inspect recycler audits. | Demonstrates end-to-end operational lifecycle |

---

## 5. Technology Stack

### Frontend:
- **React 19:** Modern functional components, hooks (`useState`, `useEffect`, `useMemo`, `useRef`).
- **TypeScript:** Strict type safety across all waste schemas, recycler models, and API responses.
- **Tailwind CSS v4:** Modern utility-first styling with responsive breakpoints.
- **Lucide React:** Lightweight, accessible icons.

### Backend & Server:
- **Node.js & Express:** Full-stack architecture hosting API endpoints and serving Vite middleware in development.
- **`@google/genai` (v2.4.0):** Official Google Gen AI TypeScript SDK configured with `gemini-3.8-flash`.
- **Environment Variables (`dotenv`):** Server-side secret protection ensuring API keys are never leaked to client bundles.

### Cloud, Persistence & Authentication Layer:
- **Firebase Firestore:** Enterprise-grade NoSQL cloud database persisting citizen reports, community posts, user impact profiles, and activity logs. Hardened with Zero-Trust `firestore.rules` and indexed collections.
- **Firebase Authentication:** Google Sign-In and anonymous demo authentication for secure, multi-tenant citizen tracking.
- **Firebase Cloud Storage:** Object storage for uploaded grievance evidence photos with direct public access and signed download URLs.
- **Modular Storage Service (`storageService.ts`):** Complete Firestore CRUD operations (`getDocs`, `setDoc`, `updateDoc`, `onSnapshot`) backed by optimistic local cache for instantaneous UI interactions.

---

## 6. Architecture & Data Flow

```
                      +-----------------------------+
                      |   Citizen / User Browser   |
                      |   (React 19 + Tailwind CSS) |
                      +--------------+--------------+
                                     |
                                     | HTTP REST
                                     v
                      +-----------------------------+
                      |      Express Server         |
                      |   (server.ts on Port 3000)  |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v (Has GEMINI_API_KEY)                        v (Offline / No Key / Fallback)
    +--------------------+                        +--------------------+
    |  Google Gemini AI  |                        | Local Rule-Based   |
    | (gemini-3.8-flash) |                        |  Classifier Engine |
    +---------+----------+                        +---------+----------+
              |                                             |
              +----------------------+----------------------+
                                     |
                                     v JSON Structured Response
                      +-----------------------------+
                      |   PrithveX UI Presentation  |
                      |  - Bin Assignment Card      |
                      |  - Preparation Steps        |
                      |  - Reuse / Recycler Match   |
                      +-----------------------------+
```

---

## 7. AI Classification Workflow & Prompt Engineering

### Server Endpoint: `POST /api/classify`
1. The frontend encodes the uploaded photo to base64 or captures an item hint.
2. The payload is sent to `/api/classify` on the backend.
3. The server constructs a multimodal prompt grounded in Indian environmental statutes:
   - Solid Waste Management Rules 2016
   - Plastic Waste Management Amendment Rules 2021
   - E-Waste (Management) Rules 2022
   - Battery Waste Management Rules 2022
   - Biomedical Waste Management Rules 2016
4. Gemini returns a strictly typed JSON structure containing:
   - `itemName`, `category`, `confidence`, `explanation`, `disposalMethod`, `primaryPathway`, `binColor`, `binName`, `preparationSteps`, `reuseOptions`, `recyclingOptions`, `warnings`, `suggestedNextAction`, `isHazardous`, and `cpcbRegulation`.
5. If the Gemini API key is absent, rate-limited, or if the user requests demo mode, PrithveX seamlessly executes its deterministic Indian waste classification engine, returning realistic data clearly tagged as `provider: 'demo_classifier'`.

---

## 8. Database Design

PrithveX models data across 6 primary collections/schemas:

1. **`wasteItems`**: Detailed profiles of 30+ items with categories, bin colors, preparation checklists, reuse options, and CPCB regulations.
2. **`recyclers`**: Directory of 11+ verified facilities across 8 metropolitan hubs with accepted waste streams, collection methods, ratings, and operating schedules.
3. **`reports`**: Civic grievances with unique ticket ID (`PVX-2026-XXXX`), issue type, location, GPS coordinates, photo, reporter details, and status tracker.
4. **`communityPosts`**: Citizen sustainable actions with author, city, category, content, likes, and moderation status (`Approved` vs `Pending review`).
5. **`userProfiles`**: Citizen stats (items identified, reports submitted, waste diverted kg, CO₂e avoided), badges, and recent activity history.
6. **`educationalGuides`**: In-depth tutorials on balcony composting, plastic resin numbers 1–7, e-waste safety, and sanitary wrapping.

---

## 9. Environment Variables Setup

PrithveX reads configuration from `.env` in the root directory:

```env
# Server-side Gemini API key (recommended)
GEMINI_API_KEY="your_gemini_api_key_here"

# Application hosting URL (optional)
APP_URL="http://localhost:3000"

# Optional Client-side Fallbacks (leave blank for production security):
VITE_GEMINI_API_KEY=""
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""
```

*Note: In Google AI Studio Build, `GEMINI_API_KEY` is automatically injected into the server environment at runtime.*

---

## 10. How to Run Locally

### Prerequisites:
- Node.js (v18 or v20+)
- npm or pnpm

### Steps:
```bash
# 1. Clone repository
git clone https://github.com/your-username/prithvex.git
cd prithvex

# 2. Install dependencies
npm install

# 3. Create .env file from .env.example
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY

# 4. Start the full-stack development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 11. Deployment Instructions

### Full-Stack Node/Express Deployment (Render, Railway, Cloud Run):
```bash
# Build the production Vite bundle
npm run build

# Start the full-stack Express server
npm start
```
Ensure that `PORT` and `GEMINI_API_KEY` are configured in the hosting provider's environment variables.

---

## 12. Common Errors and Solutions

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **"Gemini API Key missing / 401 Unauthorized"** | `GEMINI_API_KEY` not present in `.env` | PrithveX automatically falls back to the deterministic demo classifier. To enable live Gemini vision, set `GEMINI_API_KEY="your_key"` in `.env`. |
| **"Cannot find module '@google/genai'"** | Dependencies not installed | Run `npm install` in the project root. |
| **"CORS error on /api/classify"** | Frontend calling another port directly | PrithveX mounts Vite middlewares directly inside Express on port 3000, so API calls to `/api/*` are same-origin and never trigger CORS. |
| **"Image upload too large"** | Image exceeds 8MB payload limit | Express limit is configured to `15mb`, and the client warns if files exceed 8MB. Compress high-res camera photos before upload. |

---

## 13. Likely Hackathon Judge Questions & Technically Accurate Answers

#### Q1: "Why did you build an Express backend rather than calling Gemini directly from React in the browser?"
> **Answer:** "Exposing private API keys in client-side JavaScript bundles is an anti-pattern that violates basic security principles. Anyone opening DevTools could steal the key. In PrithveX, client requests pass through our backend endpoint (`/api/classify`), keeping the Gemini secret key secure on the server while allowing us to enforce rate-limiting, validate file payloads, and structure prompt engineering."

#### Q2: "What happens if the Gemini API is down, rate-limited, or there's no internet at an exhibition venue?"
> **Answer:** "PrithveX uses a **Dual-Provider Abstraction Architecture**. The server attempts the Gemini 3.8 Flash model first. If it encounters a network timeout, quota limit, or missing key, it gracefully falls back to our local deterministic rule engine grounded in CPCB Indian SWM rules. Furthermore, the UI transparently displays `Demo Classifier Mode`, ensuring judges and users always know the data source without interrupting app functionality."

#### Q3: "How does PrithveX calculate the diverted waste and CO₂ avoided numbers on the dashboard?"
> **Answer:** "We use transparent, conservative heuristics derived from Central Pollution Control Board (CPCB) benchmarks: an average of 0.35 kg diverted per household item properly sorted, and 1.48 kg CO₂ equivalent emissions avoided per kg of dry recyclables by preventing landfill methane generation and reducing virgin material extraction. We explicitly state this methodology in a disclaimer banner on the dashboard."

#### Q4: "Why did you focus specifically on Indian waste categories like RUCO and sanitary waste wrapping?"
> **Answer:** "Standard Western recycling apps assume curb-side single-stream recycling. In India, 50–60% of municipal waste is wet kitchen organic waste, and domestic hazardous waste like used cooking oil (RUCO) clogs municipal sewers into massive fatbergs. Additionally, under SWM Rules 2016 Rule 4(b), wrapping menstrual hygiene pads in newspaper with a red indicator mark is legally mandated to protect sanitation workers from direct pathogen exposure. PrithveX was built specifically for Indian ground realities."

#### Q5: "How does the Community Wall prevent spam or offensive submissions?"
> **Answer:** "PrithveX implements a strict moderation-friendly data structure. All user-submitted actions are saved with `status: 'Pending review'` by default and do not appear on the public feed until approved by a moderator. In the hackathon prototype, judges can toggle the 'Judge / Admin' portal in the navbar to inspect pending posts and test the real-time approval/rejection lifecycle."

---

## 14. Future Scope
1. **Vernacular Multilingual Voice AI:** Audio prompts in Hindi, Kannada, Marathi, Tamil, Bengali, and Telugu for doorstep sanitation workers and domestic helpers.
2. **Computer Vision on Micro-Edge (TensorFlow Lite / ONNX):** Offline waste sorting on low-cost Android mobile devices without cellular data.
3. **Smart Bin QR Code Integration:** Housing societies scan bin QR codes to log apartment-wise segregation compliance and earn municipal property tax rebates.
4. **Direct Kabadiwala UPI Escrow:** Doorstep scrap pickup booking with digital weight verification and direct UPI cash payouts.

---

## 15. Team & Acknowledgements
- **Platform Name:** PrithveX
- **Context:** National Hackathon Submission — Waste Segregation, Recycling & Sustainability in India
- **Built With:** React 19, TypeScript, Express, Google Gen AI SDK (`gemini-3.8-flash`), Tailwind CSS v4.
- **Dedicated to:** The sanitation workers and circular waste cooperatives of India who keep our cities clean every single day.
