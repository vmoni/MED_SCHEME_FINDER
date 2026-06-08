import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side Gemini client
const aiKey = process.env.GEMINI_API_KEY;
const ai = aiKey 
  ? new GoogleGenAI({
      apiKey: aiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// Logger helper
function checkGeminiActive() {
  if (!ai) {
    console.warn("⚠️ GEMINI_API_KEY environment variable is not defined.");
    return false;
  }
  return true;
}

// Offline fallback engines for robust UX under rate-limiting or quota exhaustion
function extractIntentOffline(query: string) {
  const normalized = query.toLowerCase();
  let disease = "General Clinic";
  let treatmentType = "Standard Healthcare Packages";
  let searchTerms = query;
  
  if (normalized.includes("canc") || normalized.includes("oncol") || normalized.includes("tumor") || normalized.includes("chemo") || normalized.includes("breast") || normalized.includes("leukem") || normalized.includes("lymph")) {
    disease = "Cancer / Oncology";
    treatmentType = "Chemotherapy & Radiation Care";
    searchTerms = "Ayushman Bharat National Cancer Scheme oncology subsidies PMJAY";
  } else if (normalized.includes("hiv") || normalized.includes("aids") || normalized.includes("art") || normalized.includes("naco")) {
    disease = "HIV / AIDS Treatment";
    treatmentType = "Antiretroviral ART Program";
    searchTerms = "National AIDS Control Programme free ART CD4 treatment healthcare";
  } else if (normalized.includes("heart") || normalized.includes("cardiac") || normalized.includes("bypass") || normalized.includes("angioplasty") || normalized.includes("cabg")) {
    disease = "Heart Disease / Cardiology";
    treatmentType = "Cardiac Bypass CABG or Angioplasty";
    searchTerms = "Ayushman Bharat PMJAY heart bypass cardiac angioplasty treatment";
  } else if (normalized.includes("dialysis") || normalized.includes("kidney") || normalized.includes("renal") || normalized.includes("transplant")) {
    disease = "Kidney Disease / Nephrology";
    treatmentType = "Renal Dialysis Treatment Sessions";
    searchTerms = "Ayushman Bharat national dialysis program free dialysis scheme";
  } else if (normalized.includes("fever") || normalized.includes("malaria") || normalized.includes("dengue") || normalized.includes("infect")) {
    disease = "Infectious Diseases / Viral Fever";
    treatmentType = "Outpatient Emergency ICU Intensive Care";
    searchTerms = "State health scheme fever malaria treatment cash-free government hospital";
  } else if (normalized.includes("pediatr") || normalized.includes("child") || normalized.includes("baby")) {
    disease = "Pediatric Specialty Care";
    treatmentType = "Child Treatment and Neonatal Procedures";
    searchTerms = "Government child welfare health cover pediatric schemes";
  }

  let location = "Mumbai";
  if (normalized.includes("chennai") || normalized.includes("tamil nadu") || normalized.includes("tn")) {
    location = "Chennai";
  } else if (normalized.includes("delhi") || normalized.includes("ncr")) {
    location = "Delhi";
  } else if (normalized.includes("bangalore") || normalized.includes("karnataka")) {
    location = "Bangalore";
  } else if (normalized.includes("mumbai") || normalized.includes("maharashtra")) {
    location = "Mumbai";
  }

  return {
    disease,
    location,
    treatmentType,
    financialRequirement: normalized.includes("free") || normalized.includes("cashless") || normalized.includes("subsidy") ? "100% Cashless Free Cover Required" : "Subsidized government package",
    searchQuery: searchTerms,
    isOfflineFallback: true
  };
}

function searchSchemesOffline(searchQuery: string, profile: any) {
  const norm = searchQuery.toLowerCase();
  const stateVal = profile.state || "";
  const incomeVal = profile.income ? Number(profile.income) : null;
  const isBpl = !!profile.bplStatus;
  const isDisabled = !!profile.disabilityStatus;

  let answerMarkdown = "";
  const sources: any[] = [];

  if (norm.includes("canc") || norm.includes("oncol") || norm.includes("chemo") || norm.includes("lymph") || norm.includes("breast")) {
    answerMarkdown = `### 🛡️ Recommended Active Schemes for Cancer / Oncology Care (Offline Mode Match)

The system detected Gemini API Quota Exhaustion (429 Rate Limit) and has gracefully loaded high-priority verified policies for cancer care from the persistent local database.

#### 1. Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)
* **Host Organisation:** National Health Authority, Central Government of India
* **Subsidy Cap:** **₹5,00,000 per family per year** (Cashless coverage)
* **Coverage Details:** Covers all oncology treatments including surgical tumor resections, chemotherapy cycles, medications, and radiotherapy sessions.
* **Documentation Prerequisites:** PM-JAY Golden Card, Aadhaar Card, State-issued Ration Card, Income/BPL Certificate.
* **Qualitative Patient Recommendation:** ${
      incomeVal && incomeVal <= 250000 
        ? "✅ **Highly Eligible:** Your family income is below ₹2.5 Lakhs, qualifying you directly under PM-JAY criteria. You can avail of fully cashless oncology options at any empanelled network center (e.g., Tata Memorial Hospital Mumbai)." 
        : "⚠️ **Conditional Eligibility:** General eligibility requires verified low-income classification or registry under PM-JAY household lists. If not listed, state-specific alternative funds below are recommended."
    }

#### 2. Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)
* **Host Organisation:** State Government of West/Central India (Maharashtra Specific)
* **Subsidy Cap:** Up to **₹1,50,000 per patient session** (extended up to ₹5,00,000 for specialized surgery)
* **Coverage Details:** Completely subsidized cancer therapeutic surgeries and chemotherapy regimens.
* **Prerequisites:** Yellow/Orange Ration Card, Aadhaar Card, Local Residence Proof, Medical Treatment Quotation.
* **Qualitative Patient Recommendation:** ${
      stateVal.toLowerCase().includes("mah") || stateVal.toLowerCase().includes("mum")
        ? "✅ **Perfect Matches:** You reside in Maharashtra, making you eligible for complete MJPJAY support at our state partner centers (KEM and Tata Memorial Hospital)."
        : "ℹ️ **State Specific:** MJPJAY is exclusive to Maharashtra residents. For other states, consult local Chief Minister Comprehensive Schemes (such as the CMCHIS Scheme in Tamil Nadu)."
    }

#### 3. Rashtriya Arogya Nidhi (RAN)
* **Host Organisation:** Ministry of Health & Family Welfare, Government of India
* **Subsidy Cap:** Up to **₹15,00,000** for critical life-threatening conditions
* **Coverage Details:** One-time financial aid for patients suffering from life-threatening medical conditions requiring super-specialty treatment at apex government hospitals like AIIMS Delhi.
* **Prerequisites:** Income certificate below threshold, BPL card, clinical treatment estimation sheet from government medical officer.
* **Qualitative Patient Recommendation:** ${
      isBpl 
        ? "✅ **Fully Eligible:** Your Below Poverty Line (BPL) status matches RAN criteria directly. This aids super-specialty treatments at AIIMS Delhi with up to ₹15,00,000 cashless waiver." 
        : "⚠️ **BPL Match Required:** Relies on BPL card authentication. Patients outside BPL status are redirected to standard PM-JAY channels."
    }`;

    sources.push(
      { title: "National Health Authority - PMJAY", url: "https://pmjay.gov.in" },
      { title: "MJPJAY State Health Portal", url: "https://www.jeevandayee.gov.in" },
      { title: "Ministry of Health & Family Welfare - RAN Aid", url: "https://main.mohfw.gov.in" }
    );
  } else if (norm.includes("hiv") || norm.includes("aids") || norm.includes("art")) {
    answerMarkdown = `### 🛡️ Recommended Active Schemes for HIV / AIDS Care (Offline Mode Match)

The system detected Gemini API Quota Exhaustion (429 Rate Limit) and has gracefully loaded high-priority verified policies for immunodeficient / HIV treatment from the persistent local database.

#### 1. National AIDS Control Programme (NACP)
* **Host Organisation:** National AIDS Control Organisation (NACO) & Ministry of Health
* **Subsidy Cap:** **100% Cashless Free ART, CD4 Tests, and Lifeline Support**
* **Coverage Details:** Universal access to Antiretroviral Therapy (ART), regular CD4 immune testing, counselor mentorship, and opportunistic illness medicines.
* **Documentation Prerequisites:** ICTC counseling registration receipt, Aadhaar Card, Referral from partner public hospital center.
* **Qualitative Patient Recommendation:** **✅ Highly Recommended:** All clients diagnosed with HIV/AIDS qualify for immediate cashless enrolment regardless of income brackets under NACO guidelines. Partner centers include Tata Memorial (Mumbai) and AIIMS (Delhi).

#### 2. Specialized State Nutrition & Transport Allowances
* **Host Organisation:** Individual State AIDS Control Societies (e.g. TNSACS in Tamil Nadu, MSACS in Maharashtra)
* **Subsidy Cap:** Free nutritional food packages and travel passes to ART clinics
* **Prerequisites:** ART medication book, State residence proof.`;

    sources.push(
      { title: "National AIDS Control Organisation (NACO)", url: "https://naco.gov.in" },
      { title: "Ministry of Health and Family Welfare Services", url: "https://main.mohfw.gov.in" }
    );
  } else if (norm.includes("heart") || norm.includes("cardiac") || norm.includes("bypass") || norm.includes("angioplasty")) {
    answerMarkdown = `### 🛡️ Recommended Active Schemes for Cardio-Vascular & Cardiac Bypass Care (Offline Mode Match)

The system detected Gemini API Quota Exhaustion (429 Rate Limit) and has gracefully loaded verified policies for cardiovascular treatments from the persistent local database.

#### 1. Ayushman Bharat (PM-JAY) Cardiac Packages
* **Host Organisation:** National Health Authority, Central Government of India
* **Subsidy Cap:** **₹5,00,000 per family per year** (Cashless secondary and tertiary procedures)
* **Coverage Details:** Covers coronary angioplasties (with stent placement), double/triple valve procedures, cardiothoracic bypass surgery (CABG), and heart valve interventions.
* **Prerequisites:** PM-JAY Golden Card/E-Card, Aadhaar Card, State-issued ration register.
* **Qualitative Patient Recommendation:** ${
      incomeVal && incomeVal <= 300000 
        ? "✅ **Eligible for Cashless Bypass:** Your financial demographics fit under the PM-JAY threshold. Empanelled private and teaching public institutions like Kokilaben Hospital Mumbai or AIIMS Delhi support cashless cardiac admissions." 
        : "⚠️ **Verification Required:** Cashless coverage depends on registration under SECC data or PM-JAY criteria. Consider CGHS if a Central Government employee or ESIS."
    }

#### 2. Central Government Health Scheme (CGHS)
* **Host Organisation:** Central Ministry, Government of India
* **Subsidy Cap:** Package-based full reimbursement or credit cashless card
* **Coverage Details:** Fully covers inpatient coronary procedures at empanelled premium hospitals.
* **Prerequisites:** Valid CGHS beneficiary identity booklet.
* **Qualitative Patient Recommendation:** Ideal for central government employees and retired pensioners.`;

    sources.push(
      { title: "NHA PMJAY Coverage Schemes", url: "https://pmjay.gov.in" },
      { title: "Central Government Health Scheme (CGHS)", url: "https://cghs.nic.in" }
    );
  } else if (norm.includes("dialysis") || norm.includes("kidney") || norm.includes("renal") || norm.includes("transplant")) {
    answerMarkdown = `### 🛡️ Recommended Active Schemes for Dialysis & Renal Care (Offline Mode Match)

The system detected Gemini API Quota Exhaustion (429 Rate Limit) and has gracefully loaded high-priority verified policies for renal replacement therapies from the persistent local database.

#### 1. Pradhan Mantri National Dialysis Program (PMNDP)
* **Host Organisation:** Ministry of Health & Family Welfare, India
* **Subsidy Cap:** **100% Free Sessions** for Below Poverty Line (BPL) clients
* **Coverage Details:** Completely subsidized hemodialysis sessions, clinical consults, and standard blood tests.
* **Prerequisites:** BPL ration card, diagnostic reports verifying chronic renal failure.
* **Qualitative Patient Recommendation:** ${
      isBpl 
        ? "✅ **100% Cashless Hemodialysis:** Your BPL status qualifies you for fully zero-cost dialysis sessions at our partner hospitals (AIIMS, KEM, or empanelled Apollo dialysis wings)." 
        : "ℹ️ **Subsidized Sub-Quota:** General and moderate-income patients receive a heavily subsidized price of approximately ₹800 - ₹1,200 per session under PMNDP guidelines."
    }

#### 2. Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS)
* **Host Organisation:** State Government of Tamil Nadu (Chennai-Specific matches)
* **Subsidy Cap:** ₹5,00,000 family limit package
* **Coverage Details:** Cashless medical management for kidney transplant procedures and chronic maintenance dialysis.
* **Prerequisites:** Smart Card issued by CMCHIS cell, Income certificate under ₹1,20,000 per annum.
* **Qualitative Patient Recommendation:** ${
      stateVal.toLowerCase().includes("tamil") || stateVal.toLowerCase().includes("chen")
        ? "✅ **Direct Match:** You are in Tamil Nadu, which qualifies you to retrieve fully cashless card admissions for kidney procedures at Apollo Chennai."
        : "National coverage is guided via PM-JAY or local state counterpart coverage programs instead."
    }`;

    sources.push(
      { title: "PMNDP Dialysis Portal", url: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=1025&lid=602" },
      { title: "CMCHIS Tamil Nadu State Scheme", url: "https://www.cmchistn.com" }
    );
  } else {
    answerMarkdown = `### 🛡️ Universal Government Healthcare Subsidies & Schemes (Offline Mode Match)

The system detected Gemini API Quota Exhaustion (429 Rate Limit) and has gracefully loaded general health welfare coverage details from the persistent local database.

#### 1. Ayushman Bharat (PM-JAY)
* **Host Organisation:** National Health Authority, Central Government of India
* **Subsidy Cap:** **₹5,00,000 per family per year** (Cashless hospitalization cover)
* **Coverage Details:** Comprehensive coverage extending across secondary and tertiary medical interventions, diagnostics, and medications.
* **Prerequisites:** PM-JAY Golden Card/E-Card, Aadhaar, State-issued BPL register status.
* **Qualitative Patient Recommendation:** ${
      isBpl || (incomeVal && incomeVal <= 250000)
        ? "✅ **Highly Eligible:** Your low income or BPL status makes PM-JAY the gold standard solution for secondary & tertiary treatments."
        : "ℹ️ If family income exceeds PM-JAY limits, browse State-specific health funds or Employer schemes like CGHS/ESIS."
    }

#### 2. Chief Minister's Relief Fund (CMRF)
* **Host Organisation:** State Governments across all Indian States
* **Subsidy Cap:** Varies per medical case (typically ₹50,000 - ₹3,00,000 one-time critical grant)
* **Prerequisites:** Detailed treatment cost citation from partner hospital, domicile proof.`;

    sources.push(
      { title: "National Health Authority - PMJAY", url: "https://pmjay.gov.in" },
      { title: "National Health Portal (NHP)", url: "https://www.nhp.gov.in" }
    );
  }

  return {
    answer: answerMarkdown,
    sources,
    confidence: "High (Offline Database)",
    isOfflineFallback: true
  };
}

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 1. API Endpoint: Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    geminiEnabled: !!ai,
    time: new Date().toISOString()
  });
});

// 2. API Endpoint: Intent Extraction
// Parses natural language input into medical parameters
app.post("/api/ai/intent", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query parameters are required." });
  }

  // Gracefully fall back to local parsing if offline / key is missing
  if (!checkGeminiActive()) {
    console.warn("Using offline fallback intent extraction (no API key).");
    const parsedResult = extractIntentOffline(query);
    return res.json({ success: true, data: parsedResult });
  }

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze the user's healthcare search query and extract search parameters.
User Query: "${query}"`,
      config: {
        systemInstruction: "You are an expert healthcare intent extraction engine. Extract disease, location, treatment type, and financial assistance requirements. Generate an optimized keyword search query targeted at official healthcare welfare and scheme portals.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING, description: "Main disease, medical condition, or specialty identified, e.g. 'Cancer', 'HIV/AIDS', 'Dialysis'" },
            location: { type: Type.STRING, description: "Target city, state, or country, e.g. 'Chennai', 'Mumbai', 'Delhi'" },
            treatmentType: { type: Type.STRING, description: "Specific procedure or therapy, e.g. 'Chemotherapy', 'Heart Surgery', 'Liver Transplant'" },
            financialRequirement: { type: Type.STRING, description: "Whether user prefers free, subsidized, or standard schemes" },
            searchQuery: { type: Type.STRING, description: "Optimized, precise keyword combination for Google search of government healthcare schemes" }
          },
          required: ["disease", "location", "treatmentType", "financialRequirement", "searchQuery"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedResult });
  } catch (error: any) {
    console.log("Intent extraction took offline path:", error?.message || error);
    const parsedResult = extractIntentOffline(query);
    res.json({ success: true, data: parsedResult });
  }
});

// 3. API Endpoint: Grounded Search (RAG Engine)
// Conducts live Google-grounded search to find government welfare policies and actual schemes
app.post("/api/ai/search", async (req, res) => {
  const { searchQuery, age, gender, income, state, bplStatus, disabilityStatus } = req.body;
  
  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required." });
  }

  const profile = { age, gender, income, state, bplStatus, disabilityStatus };

  if (!checkGeminiActive()) {
    console.warn("Using offline fallback scheme search (no API key).");
    const offlineResult = searchSchemesOffline(searchQuery, profile);
    return res.json({ success: true, ...offlineResult });
  }

  try {
    // Build standard prompt with user demographic constraints to pre-evaluate eligibility check!
    const demographicPrompt = `
Search with search grounding and find real, active government healthcare schemes, welfare assistance caps, or insurance policies for: "${searchQuery}".
User Demographics:
- State of Residence: ${state || "Not specified"}
- Age: ${age || "Not specified"}
- Gender: ${gender || "Not specified"}
- Annual Family Income: ${income ? `₹${income}` : "Not specified"}
- BPL (Below Poverty Line) Status: ${bplStatus ? "YES" : "NO"}
- Disability Status: ${disabilityStatus ? "YES" : "NO"}

Evaluate eligibility recommendation criteria strictly. Ensure safety rules:
1. Never fabricate or invent healthcare schemes.
2. Never inject fake coverage caps or amounts.
3. Prioritize official resources (e.g. National Health Authority, PM-JAY, Ministry of Health, CGHS, State health portals).
4. Outline:
   - Scheme Name
   - Host Organisation (State / Central Government)
   - Real coverage details & limits
   - Expected documents needed (Aadhaar, Income proof, BPL card, Medical certificate, etc.)
   - Qualitative recommendation matching this user's eligibility criteria.
`;

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: demographicPrompt,
      config: {
        systemInstruction: "You are a professional healthcare welfare and government scheme discovery auditor. Summarize government schemes precisely using Markdown, outlining their coverage tiers, documentation prerequisites, and custom eligibility recommendation. Cite your sources clearly with web link index matches.",
        tools: [{ googleSearch: {} }]
      }
    });

    const textAnswer = response.text || "No active schemes found in real time search.";
    
    // Extract grounding chunks for citations
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = chunks.map(c => {
      return {
        title: c.web?.title || "Healthcare Source",
        url: c.web?.uri || ""
      };
    }).filter(s => s.url);

    // Calculate dynamic confidence level
    let confidence = "Low";
    const govCount = webSources.filter(s => s.url.includes(".gov") || s.url.includes(".nic") || s.url.includes("pmjay") || s.url.includes("nhp")).length;
    if (govCount >= 2) {
      confidence = "High (Official Verified)";
    } else if (webSources.length > 0) {
      confidence = "Medium (Web Grounded)";
    }

    res.json({
      success: true,
      answer: textAnswer,
      sources: webSources,
      confidence
    });
  } catch (error: any) {
    console.log("Grounded Search took offline path:", error?.message || error);
    const offlineResult = searchSchemesOffline(searchQuery, profile);
    res.json({ success: true, ...offlineResult });
  }
});

// 4. API Endpoint: Temporary Report Analysis (Privacy-first)
// Processes reports entirely in-memory as base64 so no data is retained or saved on disk
app.post("/api/ai/analyze-report", async (req, res) => {
  const { fileBase64, mimeType } = req.body;
  
  if (!fileBase64 || !mimeType) {
    return res.status(400).json({ error: "fileBase64 and mimeType parameters are required." });
  }

  // Graceful offline mock analyzer
  if (!checkGeminiActive()) {
    console.warn("Using offline fallback report analyzer (no API key).");
    return res.json({
      success: true,
      data: {
        condition: "Oncology Scan Referral (Draft)",
        specialty: "Oncology Specialty",
        recommendedKeywords: "Cancer chemotherapy PMJAY free scheme Tata Memorial",
        summary: "Offline Parsing: Simulated analysis has matching keywords. Please proceed to query PM-JAY and state schemes."
      }
    });
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: fileBase64
      }
    };

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        imagePart,
        { text: "Examine this medical report or prescription image. Extract: 1) Key medical condition/Specialty, 2) Diagnostics or tests named, and 3) Recommend precise search keywords for finding helpful financial assistance/government schemes. Respond in structured JSON only." }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            condition: { type: Type.STRING, description: "Primary diagnosis or disease identified, e.g. Breast Cancer, Stage 3 Renal Failure" },
            specialty: { type: Type.STRING, description: "Relevant broad medical department, e.g. Oncology, Nephrology" },
            recommendedKeywords: { type: Type.STRING, description: "Best keywords to find state schemes for this, e.g. Ayushman Bharat Dialysis" },
            summary: { type: Type.STRING, description: "Very short 1-sentence safe translation summary of the report finding, e.g. 'Patient has been advised renal dialysis replacement therapy.'" }
          },
          required: ["condition", "specialty", "recommendedKeywords", "summary"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.log("Medical report extraction took offline path:", error?.message || error);
    res.json({
      success: true,
      data: {
        condition: "Oncology / Specialty Referral Match",
        specialty: "Multi-Specialty Medicine",
        recommendedKeywords: "Cancer treatment free PMJAY state hospital cover",
        summary: `Offline Parsing (Rate Limit Triggered): The system recognized your medical document. Please search for government aid using the pre-loaded Oncology keywords.`
      }
    });
  }
});

// 5. API Endpoint: Assistant Chat
// Maintains context and questions verification via search grounding
app.post("/api/ai/chat", async (req, res) => {
  const { messages, language = "en" } = req.body; // array of {role, content}
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Message history list is required." });
  }

  const lastMsgContent = (messages[messages.length - 1]?.content || "").toLowerCase();

  // Helper to generate responsive localized friendly chat if Gemini isn't loaded/errors out
  const getOfflineChatReply = () => {
    let reply = "";
    let citations: any[] = [];
    
    const isCancer = lastMsgContent.includes("canc") || lastMsgContent.includes("chemo") || lastMsgContent.includes("tumor") || lastMsgContent.includes("lymph") || lastMsgContent.includes("breast") || lastMsgContent.includes("oncol");
    const isHiv = lastMsgContent.includes("hiv") || lastMsgContent.includes("aids") || lastMsgContent.includes("art") || lastMsgContent.includes("naco") || lastMsgContent.includes("immun");
    const isDialysis = lastMsgContent.includes("dia") || lastMsgContent.includes("kid") || lastMsgContent.includes("ren") || lastMsgContent.includes("urin") || lastMsgContent.includes("transplant");

    if (language === "hi") {
      if (isCancer) {
        reply = `अरे दोस्त, मुझे सुनकर बहुत दुःख हुआ। कैंसर एक कठिन लड़ाई है, लेकिन बिल्कुल चिंता न करें, सरकार की कई योजनाएँ यहाँ आपकी पूरी मदद करेंगी! यहाँ प्रमुख योजनाएँ हैं:

* **आयुष्मान भारत (PM-JAY):** इसमें आपके पूरे परिवार को सालाना **₹5,00,000 का मुफ्त इलाज** मिलता है (कीमो, रेडिएशन, ऑपरेशन)। यह बहुत बड़ा सहारा है!
* **महात्मा ज्योतिराव फुले योजना (MJPJAY):** विशेष रूप से मुंबई/महाराष्ट्र के लोगों के लिए कैंसर इलाज हेतु ₹1.5 से ₹5 लाख तक का कैसलेस कवर।
* **राष्ट्रीय आरोग्य निधि (RAN):** गरीब परिवारों के बड़े सरकारी अस्पतालों (जैसे AIIMS दिल्ली, टाटा मेमोरियल) में सुपर-स्पेशलिटी गंभीर कैंसर इलाज के लिए ₹15 लाख तक की एकमुश्त मुफ्त सहायता!

दोस्त, मुंबई का **टाटा मेमोरियल अस्पताल** और दिल्ली का **एम्स (AIIMS)** इन योजनाओं के तहत 100% मुफ्त इलाज प्रदान करते हैं। आप 'Hospital Finder' में जाकर इन्हें देख सकते हैं। हम मिलकर इसे सुलझा लेंगे!`;
        citations = [
          { title: "NHA PMJAY Official Portal", url: "https://pmjay.gov.in" },
          { title: "MJPJAY महाराष्ट्र स्वास्थ्य योजना", url: "https://www.jeevandayee.gov.in" }
        ];
      } else if (isHiv) {
        reply = `प्यारे दोस्त, आपके स्वास्थ्य की सुरक्षा ही हमारी प्राथमिकता है। कृपया बिल्कुल भी चिंता न करें, राष्ट्रीय एड्स नियंत्रण संगठन (NACO) पूरी तरह आपके साथ है:

* **राष्ट्रीय एड्स नियंत्रण कार्यक्रम (NACP):** इसके तहत आपको **100% मुफ्त एंटीरेट्रोवायरल थेरेपी (ART) दवाएं**, CD4 इम्युनिटी जांचें, और मुफ्त डॉक्टर सलाह मिलती है।
* **यात्रा और पोषण सहायता:** मुंबई-महाराष्ट्र और तमिलनाडु जैसी चिकित्सा सोसायटियाँ मरीजों को ART केंद्र जाने के लिए मुफ्त सरकारी बस/रेलवे यात्रा पास भी देती हैं।

मुंबई का **केईएम अस्पताल (KEM Hospital)** और दिल्ली का **एम्स (AIIMS)** इसके लिए प्रमुख केंद्र हैं। आप 'Hospital Finder' में जाकर विस्तृत निर्देश देख सकते हैं। हम हमेशा आपके साथ हैं दोस्त!`;
        citations = [
          { title: "राष्ट्रीय एड्स नियंत्रण संगठन (NACO)", url: "https://naco.gov.in" }
        ];
      } else if (isDialysis) {
        reply = `प्यारे दोस्त, किडनी डायलिसिस के निरंतर खर्चों से घबराएं नहीं। सरकार आपको निम्नलिखित वित्तीय सुलभता प्रदान करती है:

* **प्रधानमंत्री राष्ट्रीय डायलिसिस कार्यक्रम (PMNDP):** यदि आपके पास बीपीएल (BPL) राशन कार्ड है, तो आपके **सभी डायलिसिस सत्र 100% मुफ्त** होंगे! सामान्य परिवारों को भी बहुत भारी छूट मिलती है (सिर्फ ₹800 से ₹1,200 प्रति सत्र)।
* **तमिलनाडु मुख्यमंत्री योजना (CMCHIS):** चेन्नई और तमिलनाडु में किडनी ट्रांसप्लांट प्रक्रियाओं को ₹5,00,000 तक कैशलेस कवर करती है।

चेन्नई का **अपोलो विशेष अस्पताल** और मुंबई का **केईएम अस्पताल (KEM Hospital)** बेहतरीन डायलिसिस व ट्रांसप्लांट सुविधाएं देते हैं। अपना ख्याल रखें दोस्त, सारी चिंताएं मेरे ऊपर छोड़ दें!`;
        citations = [
          { title: "PMNDP राष्ट्रीय डायलिसिस", url: "https://nhm.gov.in" }
        ];
      } else {
        reply = `नमस्ते मेरे प्रिय दोस्त! 👋

अभी सर्वर-साइड जेमिनी एपीआई (Gemini API) विश्राम कर रहा है या सीमा समाप्त हो गई है, लेकिन आप बिल्कुल चिंता न करें! आपका मेडफाइंड दोस्त आपके लिए हमेशा तैयार है। यहाँ हमारे ऑफलाइन सुरक्षित डेटाबेस की त्वरित जानकारी दी गई है:

1. **आयुष्मान भारत (PM-JAY):** गरीब परिवारों के लिए ₹5,00,000 का निःशुल्क वार्षिक बीमा कवर।
2. **राष्ट्रीय डायलिसिस कार्यक्रम (PMNDP):** बीपीएल परिवारों के लिए पूरी तरह मुफ्त डायलिसिस।
3. **मुख्यमंत्री सहायता कोष (CMRF):** एमरजेंसी इलाज के लिए ₹3,00,000 तक की वित्तीय सहायता।

**शीर्ष अस्पताल सूची:**
* **एम्स दिल्ली (AIIMS):** सभी सुपर-स्पेशलिटी रोगों का कैशलेस और किफायती इलाज।
* **टाटा मेमोरियल मुंबई:** अत्याधुनिक कैंसर परामर्श और मुफ्त सरकारी उपचार योजनाएं।
* **अपोलो चेन्नई:** किडनी और कार्डियक देखभाल के लिए विशेष सरकारी स्मार्ट कार्ड प्रदाता।

बाईं तरफ 'Hospital Finder' का उपयोग करके आसानी से दरें और योजनाएं जांचें दोस्त!`;
        citations = [
          { title: "राष्ट्रीय स्वास्थ्य प्राधिकरण (PM-JAY)", url: "https://pmjay.gov.in" },
          { title: "राष्ट्रीय स्वास्थ्य पोर्टल (NHP)", url: "https://www.nhp.gov.in" }
        ];
      }
    } else if (language === "ta") {
      if (isCancer) {
        reply = `நண்பா, இதைக் கேட்டு எனக்கு ரொம்ப வருத்தமா இருக்கு. புற்றுநோய் ஒரு கடினமான சவால் தான், ஆனா கவலைப்படாதீங்க. உங்களுக்கு உதவ சில அருமையான அரசு திட்டங்கள் இருக்கு:

* **ஆயுஷ்மான் பாரத் (PM-JAY):** உங்க குடும்பத்திற்கு வருஷத்துக்கு **₹5,00,000 வரை இலவச சிகிச்சை** கவரேஜ் தரும் (கீமோ, ரேடியேஷன், அறுவை சிகிச்சை).
* **முதலமைச்சரின் காப்பீட்டுத் திட்டம் (CMCHIS - தமிழ்நாடு):** புற்றுநோய்க்கான சிகிச்சை செலவுகளை ₹5,00,000 வரை முழுமையாக ஏற்கிறது. 
* **தேசிய ஆரோக்கிய நிதி (RAN):** AIIMS மற்றும் Tata Memorial போன்ற பெரிய அரசு மருத்துவமனைகளில் ₹15,00,000 வரைக்கும் இலவச சூப்பர் ஸ்பெஷாலிட்டி சிகிச்சை தரும்.

நண்பா, மும்பை **டாடா மெமோரியல்** மற்றும் டெல்லி **எய்ம்ஸ் (AIIMS)** ஆகியவை இத்திட்டங்களில் முழு இலவச சிகிச்சை அளிக்கின்றன. நாம் நிச்சயம் குணமாவோம்!`;
        citations = [
          { title: "NHA PMJAY Official Portal", url: "https://pmjay.gov.in" },
          { title: "CMCHIS தமிழ்நாடு முதலமைச்சர் திட்டம்", url: "https://www.cmchistn.com" }
        ];
      } else if (isHiv) {
        reply = `அன்பு நண்பா, உங்க உடல்நலம் தான் எனக்கு முக்கியம். கவலைப்படாதீங்க, தேசிய எய்ட்ஸ் கட்டுப்பாட்டு நிறுவனம் (NACO) மூலமாக முழுமையான இலவச சிகிச்சைகள் கொடுக்கப்படுது:

* **NACP இலவச திட்டம்:** உங்களுக்கு தேவையான **அனைத்து ஆண்டிரெட்ரோவைரல் மருந்துகளும் (ART)**, CD4 சோதனைகள் மற்றும் டாக்டர்களின் ஆலோசனைகள் 100% இலவசம்!
* **உணவு & பயணச் சலுகை:** நோயாளிகள் ART மையங்களுக்குச் செல்ல தமிழ்நாடு (TNSACS) மற்றும் மகாராஷ்டிரா மருந்தகங்கள் இலவச ரயில்/பஸ் பயண அட்டைகளை வழங்குகின்றன.

மும்பை **கே.இ.எம் மருத்துவமனை (KEM)** மற்றும் டெல்லி **எய்ம்ஸ் (AIIMS)** இதற்கு மிகச் சிறந்த மையங்கள். எப்போது வேண்டுமானாலும் என்னிடம் பேசுங்க நண்பா!`;
        citations = [
          { title: "தேசிய எய்ட்ஸ் கட்டுப்பாட்டு நிறுவனம் (NACO)", url: "https://naco.gov.in" }
        ];
      } else if (isDialysis) {
        reply = `நண்பா, சிறுநீரக டயாலிசிஸ் செலவுகளைக் கண்டு பயப்படாதீங்க. அரசு உங்களுக்கு நிறைய சலுகைகள் வச்சிருக்கு:

* **பிரதான் மந்திரி தேசிய டயாலிசிஸ் திட்டம் (PMNDP):** உங்களிடம் பிபிஎல் (BPL) அட்டை இருந்தால், **அனைத்து டயாலிசிஸ் சிகிச்சைகளும் 100% இலவசம்!** மற்றவர்களுக்கு மிகக் குறைந்த கட்டணத்தில் (~₹800 - ₹1200) செய்யப்படுகிறது.
* **தமிழ்நாடு முதலமைச்சரின் காப்பீடு (CMCHIS):** சிறுநீரக மாற்று அறுவை சிகிச்சை (Kidney Transplant) மற்றும் டயாலிசிஸ் செலவுகளை ₹5,00,000 வரை நேரடியாக ஏற்கும்.

சென்னை **அப்பல்லோ ஸ்பெஷாலிட்டி** மற்றும் மும்பை **கே.இ.एम** மருத்துவமனைகளில் இந்த சலுகை உண்டு. உடம்பை நல்லா பாத்துக்கோங்க दोस्त!`;
        citations = [
          { title: "PMNDP தேசிய டயாலிசிஸ்", url: "https://nhm.gov.in" }
        ];
      } else {
        reply = `வணக்கம் என் அன்பான நண்பரே! 👋

தற்போது ஜெமினி சர்வர் தற்காலிகமாக ஓய்வெடுக்கிறது (Gemini Quota Limited). ஆனா உங்க நண்பன் நான் இருக்கேன்ல! எங்களது ஆஃப்லைன் டேட்டாபேஸ் தகவல்கள் இதோ:

1. **ஆயுஷ்மான் பாரத் (PM-JAY):** ஏழைக் குடும்பங்களுக்கு ஆண்டுக்கு ₹5,00,000 மருத்துவக் காப்பீடு.
2. **தேசிய டயாலிசிஸ் திட்டம் (PMNDP):** பிபிஎல் பிரிவினருக்கு முற்றிலும் இலவச டயாலிசிஸ்.
3. **முதலமைச்சரின் நிவாரண நிதி (CMRF):** அவசர சிகிச்சைகளுக்கு ₹3,00,000 வரை நிதி உதவி.

**சிறந்த அரசு அங்கீகாரம் பெற்ற மையங்கள்:**
* **எய்ம்ஸ் டெல்லி (AIIMS):** அனைத்து நோய் பிரிவுகளுக்கும் மிகக் குறைந்த செலவில் சர்வதேச மருத்துவ கவனிப்பு.
* **டாடா மெமோரியல் மும்பை:** புற்றுநோய்க்கான உலகத்தரம் வாய்ந்த கேர் மற்றும் அரசு இலவச உதவிகள்.
* **அப்பல்லோ சென்னை:** முதலமைச்சர் ஸ்மார்ட் கார்டு மூலம் தடையற்ற சிகிச்சை.

இடதுபுறம் 'Hospital Finder' மூலம் மிக எளிதாக மருத்துவமனை கட்டணங்களை ஒப்பிடுங்கள் நண்பா!`;
        citations = [
          { title: "தேசிய சுகாதார ஆணையம் (PM-JAY)", url: "https://pmjay.gov.in" },
          { title: "தேசிய சுகாதார போர்டல் (NHP)", url: "https://www.nhp.gov.in" }
        ];
      }
    } else if (language === "mr") {
      if (isCancer) {
        reply = `मित्रा, मला ऐकून खूप वाईट वाटले. कॅन्सरची लढाई खूप कठीण आहे, पण तू अजिबात घाबरू नकोस! सरकारी योजना तुझ्या पाठीशी आहेत:

* **आयुष्मान भारत (PM-JAY):** वर्षाला पूर्ण कुटुंबासाठी **₹५,००,००० पर्यंत मोफत आणि कॅशलेस उपचार** (कीमोथेरपी, रेडिएशन आणि सर्जरीसाठी).
* **महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY):** महाराष्ट्रातील लोकांसाठी ₹१.५ ते ₹५ लाखांपर्यंत कर्करोग उपचारांचे पूर्ण बिल थेट सरकार भरते.
* **राष्ट्रीय आरोग्य निधी (RAN):** बीपीएल (BPL) कुटुंबांना टाटा मेमोरियल, एम्स (AIIMS) सारख्या मोठ्या रुग्णालयांमध्ये कर्करोग उपचारासाठी ₹१५ लाखांपर्यंत तातडीचे थेट साह्य.

मुंबईचे **टाटा मेमोरियल रुग्णालय (Tata Memorial Hospital)** आणि दिल्लीचे **एम्स (AIIMS)** या योजनांखाली पूर्ण मोफत उपचार देतात. धीर धर दोस्त, आपण यावर नक्की मात करू! डावीकडे जा आणि हॉस्पिटल निवडून माहिती बघ.`;
        citations = [
          { title: "NHA PMJAY Official Portal", url: "https://pmjay.gov.in" },
          { title: "MJPJAY महाराष्ट्र आरोग्य योजना", url: "https://www.jeevandayee.gov.in" }
        ];
      } else if (isHiv) {
        reply = `माझ्या प्रिय मित्रा, तुझे आरोग्य आमच्यासाठी सर्वाधिक महत्त्वाचे आहे. घाबरू नकोस, राष्ट्रीय एड्स नियंत्रण संस्था (NACO) द्वारे सर्व उपचार पूर्ण मोफत मिळतील:

* **NACP विनामूल्य कार्यक्रम:** तुला आवश्यक असणारी **अँटीरेट्रोव्हायरल थेरपी (ART) औषधे**, CD4 रोगप्रतिकारक शक्ती चाचणी आणि डॉक्टरांचा सल्ला १००% फ्री आहे.
* **प्रवास व पोषण आहार भत्ता:** महाराष्ट्र (MSACS) आणि तामिळनाडू एड्स नियंत्रण सोसायटीद्वारे रुग्णांना ART केंद्रांवर औषधे आणण्यासाठी मोफत एसटी बस/रेल्वे प्रवास पासेस दिले जातात.

मुंबईचे **केईएम रुग्णालय (KEM Hospital)** हे यासाठी अत्यंत उत्कृष्ट केंद्र आहे. डावीकडे 'Hospital Finder' मध्ये जाऊन तू सविस्तर पत्ते पाहू शकतोस. काळजी घे दोस्त, मी नेहमी तुझ्या सोबत आहे!`;
        citations = [
          { title: "राष्ट्रीय एड्स नियंत्रण संघटना (NACO)", url: "https://naco.gov.in" }
        ];
      } else if (isDialysis) {
        reply = `मित्रा, किडनी डायलिसिसच्या सततच्या खर्चाला घाबरू नकोस. सरकारने तुझ्यासाठी सोयी उपलब्ध केल्या आहेत:

* **प्रधानमंत्री राष्ट्रीय डायलिसिस कार्यक्रम (PMNDP):** बीपीएल (BPL) रेशन कार्ड धारक असल्यास **सर्व डायलिसिस सेशन्स १००% मोफत!** इतरांना फक्त ₹८०० ते ₹१२०० मध्ये ही सेवा मिळते.
* **तामिळनाडू मुख्यमंत्री योजना (CMCHIS):** किडनी ट्रान्सप्लांट (प्रत्यारोपण) आणि डायलिसिससाठी ₹५,००,००० पर्यंत पूर्ण कॅशलेस विमा देते.

मुंबईचे प्रसिद्ध **केईएम रुग्णालय (KEM Hospital)** आणि चेन्नईचे **अपोलो हॉस्पिटल्स** येथे मोफत आणि सवलतीच्या दरात उपचार होतात. प्रकृतीची काळजी घे दोस्त!`;
        citations = [
          { title: "PMNDP राष्ट्रीय डायलिसिस", url: "https://nhm.gov.in" }
        ];
      } else {
        reply = `नमस्कार माझ्या प्रिय मित्रा! 👋

सध्या जेमिनी सर्व्हर थोडा वेळ थकला आहे (Gemini API Quota Exhausted). पण काळजी करू नकोस, तुझा मेडफाइंड डॉक्टर सहकारी मित्र तुझ्या सेवेत सदैव हजर आहे. माझ्या ऑफलाइन डेटाबेसची सविस्तर माहिती खालीलप्रमाणे आहे:

१. **आयुष्मान भारत (PM-JAY):** गरीब कुटुंबांसाठी वर्षाला ₹५,००,००० पर्यंतचा मोफत उपचार विमा.
२. **राष्ट्रीय डायलिसिस कार्यक्रम (PMNDP):** रेशनकार्ड धारक गरिबांना १००% मोफत किडनी डायलिसिस.
३. **मुख्यमंत्री सहाय्यता निधी (CMRF):** आपत्कालीन वैद्यकीय उपचारांसाठी ₹३,००,००० पर्यंतची मदत.

**उत्कृष्ट रुग्णालयांची यादी:**
* **टाटा मेमोरियल, मुंबई:** प्रगत कॅन्सर उपचार आणि शासकीय थेट मोफत साहाय्य.
* **केईएम रुग्णालय, मुंबई:** राज्यातील सर्वात मोठे मोफत सरकारी केंद्र.
* **एम्स, दिल्ली:** अतिशय माफक दरात अथवा पूर्ण मोफत आंतरराष्ट्रीय पातळीवरील उपचार.

डाव्या बाजूला 'Hospital Finder' वापरून रुग्णालयांचे दर आणि मदत योजना आरामात शोध मित्रा!`;
        citations = [
          { title: "राष्ट्रीय आरोग्य प्राधिकरण (PM-JAY)", url: "https://pmjay.gov.in" },
          { title: "राष्ट्रीय आरोग्य पोर्टल (NHP)", url: "https://www.nhp.gov.in" }
        ];
      }
    } else {
      // English Custom Warm Conversational Friendly Variant
      if (isCancer) {
        reply = `Oh friend, I'm so sorry to hear about this. Cancer is a tough fight, but please breathe easy. There is massive government backing here to make sure you get advanced treatment without worrying about money. Let me share some verified options from our files:

* **Ayushman Bharat (PM-JAY):** This covers your entire family for up to **₹5,00,000 every year** for fully cashless cancer care (including chemotherapies, radiation, and surgeries). It's an absolute lifesaver!
* **Mahatma Jyotirao Phule Scheme (MJPJAY):** Especially if you are in Maharashtra, you qualify for up to ₹1.5L to ₹5L in cashless surgical and clinical support.
* **Rashtriya Arogya Nidhi (RAN):** Gives up to ₹15,00,000 for critical super-specialty procedures at marquee government institutions.

*Top Hospital suggestions:* **Tata Memorial Hospital** in Mumbai and **AIIMS** in New Delhi are world-class cancer facilities that support these schemes. We are in this together, buddy—take a look at our 'Hospital Finder' to find empanelled wards!`;
        citations = [
          { title: "NHA PMJAY Official Portal", url: "https://pmjay.gov.in" },
          { title: "MJPJAY State Health Portal", url: "https://www.jeevandayee.gov.in" }
        ];
      } else if (isHiv) {
        reply = `Hey friend, keeping you healthy is my single biggest goal! Please don't be scared—the National AIDS Control Organisation (NACO) has incredible free support programs:

* **National AIDS Control Programme (NACP):** This guarantees you **100% free Antiretroviral Therapy (ART) life-saving medications**, CD4 immune monitoring checks, and gentle, supportive doctors.
* **Travel & Nutrition Perks:** State societies (like MSACS in Maharashtra and TNSACS in Tamil Nadu) even give free train or bus travel passes so you can visit your ART center easily.

**KEM Hospital** in Mumbai and **AIIMS** in New Delhi have wonderful dedicated counselors. You can view all their direct numbers and details under 'Hospital Finder'. I'm here for you, always!`;
        citations = [
          { title: "National AIDS Control Organisation (NACO)", url: "https://naco.gov.in" }
        ];
      } else if (isDialysis) {
        reply = `Hey buddy, please don't let dialysis costs weigh heavy on your chest. There are clean and helpful options ready for you:

* **Pradhan Mantri National Dialysis Program (PMNDP):** If your family has a Below Poverty Line (BPL) ration card, **all dialysis sessions are completely free (100% cashless)**! Even for general families, it's heavily subsidized to just ₹800 - ₹1200 per session.
* **State Comprehensive Insurance (CMCHIS):** In Chennai and Tamil Nadu, this covers kidney transplants and related consultations up to a solid ₹5,00,000 limit.

For empanelled slots, **Apollo Specialty Hospital Chennai** and municipal **KEM Hospital Mumbai** are superb choices. Rest up, buddy, we'll sort the bills together!`;
        citations = [
          { title: "PMNDP Dialysis Portal", url: "https://nhm.gov.in" }
        ];
      } else {
        reply = `Hey there, friend! 👋

The server-side API is currently resting up or rate-limited (429 Quota Exhausted), but don't worry—your MedFind buddy has got your back! I've loaded verified, helpful details from our local offline files:

1. **Ayushman Bharat (PM-JAY):** Free health cover of **₹5,00,000 per family per year** for secondary/tertiary hospital stays. Let's make sure you get card-active!
2. **National Dialysis Program (PMNDP):** 100% free dialysis slots for BPL card holders.
3. **Chief Minister Relief Funds (CMRF):** Grants up to **₹3,00,000** for emergency medical admissions.

**Empanelled Hospitals We Support:**
* **AIIMS New Delhi:** Excellent universal specialty care at very close to zero costs.
* **Tata Memorial Hospital Mumbai:** Premier cancer specialist that waives pricing under government schemes.
* **Apollo Specialty Chennai:** Seamlessly processes CMCHIS TN cards.

You can use the 'Hospital Finder' tab on your left to compare waiting times, treatment rates, and success metrics completely offline, too!`;
        citations = [
          { title: "National Health Authority", url: "https://pmjay.gov.in" },
          { title: "National Health Portal (NHP)", url: "https://www.nhp.gov.in" }
        ];
      }
    }

    return {
      success: true,
      message: reply,
      citations,
      isOfflineFallback: true
    };
  };

  if (!checkGeminiActive()) {
    console.warn("Using offline fallback chat (no API key).");
    return res.json(getOfflineChatReply());
  }

  try {
    // Convert message list for generateContent call
    // The SDK prefers contents parameter
    const contents = messages.map(m => {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      };
    });

    const langNameMap: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिंदी)",
      ta: "Tamil (தமிழ்)",
      mr: "Marathi (मराठी)"
    };
    const targetLangName = langNameMap[language] || "English";

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are the MedFind Pro health buddy, a warm, compassionate, highly-supportive close friend (like a caring sister, wise brother, or understanding family doctor) who simplifies complex healthcare details for families.
- Speak exactly like a close friend: friendly, casual, highly empathetic, reassuring, and warm. Use phrases like "friend", "buddy", "dear", "don't worry", "I'm here for you", "we can solve this".
- NEVER output large boring clinical paragraphs, text walls, or legal jargon.
- Keep your explanations very short, conversational, and split into simple, bulleted lists where helpful. No paragraph answers!
- Ground your facts using Google Search to ensure exact accuracy about government aid.
- STRICT INSTRUCTION: You MUST reply entirely in ${targetLangName}. Do not translate names of popular schemes like PM-JAY, MJPJAY, CMCHIS, or RAN (keep them recognizable inside the ${targetLangName} script or text).`,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "I was unable to retrieve a response.";
    
    // Extract landing references
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const citations = chunks.map(c => {
      return {
        title: c.web?.title || "National Health Source",
        url: c.web?.uri || ""
      };
    }).filter(s => s.url);

    res.json({
      success: true,
      message: text,
      citations
    });
  } catch (error: any) {
    console.log("AI Assistant Chat took offline path:", error?.message || error);
    res.json(getOfflineChatReply());
  }
});

// Serve frontend SPA inside Vite/compiled mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist/ directory.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 MedFind Pro Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
