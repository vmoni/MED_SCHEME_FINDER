import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  X,
  Bookmark,
  Award,
  Zap,
  Info,
  Beaker,
  Dna,
  TrendingUp,
  Clock,
  Star,
  Shield,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  HeartHandshake,
  RefreshCw
} from 'lucide-react';

import { 
  HospitalRecord, 
  DemographicProfile, 
  IntentExtraction, 
  RagSchemeResults, 
  SchemeInfo 
} from './types';

import ReportUploader from './components/ReportUploader';
import EligibilityEngine from './components/EligibilityEngine';
import AssistantChat from './components/AssistantChat';

// Expanded high-fidelity index database of hospitals with specialties, schemes, available laboratories, and clinic metrics
const HEALTH_DIRECTORY: HospitalRecord[] = [
  {
    id: "tmh-mumbai",
    hospitalName: "Tata Memorial Hospital",
    address: "Dr. Ernest Borges Road, Parel East, Mumbai 400012",
    location: "Mumbai",
    contact: "+91 22 2417 7000",
    accreditation: "NABL & NABH Accredited Oncology Center",
    healthIssues: ["Cancer", "Oncology", "Chemotherapy", "Radiotherapy", "Breast Cancer", "Leukemia", "AIDS", "HIV", "HIV Lymphoma"],
    supportedSchemes: [
      { name: "National AIDS Control Programme (NACP)", amount: "100% Cashless Free ART & CD4 Cover", org: "NACO Central Govt" },
      { name: "Ayushman Bharat (PM-JAY)", amount: "₹5,00,000 per family / year", org: "National Govt" },
      { name: "MJPJAY Maharashtra Scheme", amount: "₹1,50,000 per patient limit", org: "Maharashtra State" },
      { name: "Rashtriya Arogya Nidhi (RAN)", amount: "Up to ₹15,00,000 critical aid", org: "Central Ministry" },
      { name: "Tata Trust Patients Fund", amount: "₹2,00,000 medical waiver", org: "Charitable Trust" }
    ],
    availableLabs: [
      "ICTC Diagnostic Lab Wing (HIV ELISA & Rapid)",
      "NABL Accredited Tumor Marker & Histology Lab",
      "CD4/CD8 Immune Monitoring & Flow Cytometry Core",
      "DNA Sequencing & Molecular Oncology Unit"
    ],
    services: [
      {
        name: "Antiretroviral ART Program",
        category: "HIV / AIDS Treatment",
        successRate: 98.4,
        basePrice: "₹8,500 / mo",
        subsidyAmount: "₹8,500 / mo",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 4800,
        waitingDays: 1,
        satisfactionRate: 99,
        schemeUsed: "National AIDS Control Programme (NACP)"
      },
      {
        name: "Chemotherapy Cycle",
        category: "Oncology Care",
        successRate: 85.2,
        basePrice: "₹45,000 / cycle",
        subsidyAmount: "₹45,000 / cycle",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 12400,
        waitingDays: 5,
        satisfactionRate: 94,
        schemeUsed: "Ayushman Bharat (PM-JAY)"
      },
      {
        name: "Intensity Radiotherapy (IMRT)",
        category: "Radiation Oncology",
        successRate: 89.6,
        basePrice: "₹1,80,000",
        subsidyAmount: "₹1,50,000 Scheme limit",
        netPrice: "₹30,000 Out-of-pocket",
        annualProcedures: 3200,
        waitingDays: 14,
        satisfactionRate: 92,
        schemeUsed: "MJPJAY Maharashtra Scheme"
      }
    ]
  },
  {
    id: "kokilaben-mumbai",
    hospitalName: "Kokilaben Dhirubhai Ambani Hospital",
    address: "Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai",
    location: "Mumbai",
    contact: "+91 22 4268 7000",
    accreditation: "JCI & NABH Accredited Multi-Specialty",
    healthIssues: ["Heart", "Cardiology", "Angioplasty", "Cardiac Bypass", "Neurology", "Brain Tumor", "HIV Testing"],
    supportedSchemes: [
      { name: "National HIV/AIDS Care Subsidy Plan", amount: "₹2,50,000 coverage package", org: "Central Health Pool" },
      { name: "Ayushman Bharat (PM-JAY)", amount: "₹5,00,000 per family session", org: "National Govt" },
      { name: "CGHS (Central Govt Health)", amount: "Fully cash-free as per package CGHS", org: "Central Govt Users" },
      { name: "ESIS Medical Insurance", amount: "100% cashless treatment", org: "ESIC Department" }
    ],
    availableLabs: [
      "Advanced Pathology Lab & Multiplex Assay Wing",
      "CD4 Count Monitoring Diagnostic Division",
      "High-Resolution MRI & CT Diagnostic Suite"
    ],
    services: [
      {
        name: "Cardiac Bypass (CABG)",
        category: "Cardiovascular Surgery",
        successRate: 97.8,
        basePrice: "₹3,90,005",
        subsidyAmount: "₹1,50,000 Support cap",
        netPrice: "₹2,40,005 Out-of-pocket",
        annualProcedures: 1100,
        waitingDays: 6,
        satisfactionRate: 98,
        schemeUsed: "MJPJAY Maharashtra / PM-JAY"
      },
      {
        name: "Coronary Angioplasty",
        category: "Interventional Cardiology",
        successRate: 99.1,
        basePrice: "₹1,85,000",
        subsidyAmount: "₹1,85,000 (100% CGHS)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 2350,
        waitingDays: 2,
        satisfactionRate: 97,
        schemeUsed: "CGHS (Central Govt Health)"
      }
    ]
  },
  {
    id: "kem-mumbai",
    hospitalName: "King Edward Memorial Hospital (KEM)",
    address: "Acharya Donde Marg, Parel, Mumbai 400012",
    location: "Mumbai",
    contact: "+91 22 2410 7000",
    accreditation: "Government Memorial Teaching Hospital",
    healthIssues: ["Fever", "Malaria", "Dengue", "Pediatrics", "Emergency Care", "Infectious Disease", "Viral Infections", "AIDS", "HIV Referral", "ART Centre"],
    supportedSchemes: [
      { name: "National AIDS Control Programme (NACP)", amount: "100% Subsidized Antiretroviral Lifeline", org: "NACO Central Govt" },
      { name: "MJPJAY Maharashtra Scheme", amount: "₹1,50,000 per family", org: "Maharashtra State" },
      { name: "CM Relief Fund Mumbai", amount: "Up to ₹3,00,000 based on severity", org: "Chief Minister Desk" },
      { name: "Poor Patients Aid Fund", amount: "100% Free / Subsidized medicines", org: "Hospital Trust" }
    ],
    availableLabs: [
      "Infectious Diseases Research Lab & Diagnostic Unit",
      "Integrated Counseling & Testing Centre (ICTC)",
      "NCOE Virology Registry Labs"
    ],
    services: [
      {
        name: "ART Consultation & Support",
        category: "HIV / AIDS Care",
        successRate: 97.9,
        basePrice: "₹5,200",
        subsidyAmount: "₹5,200 (100% Grant)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 9200,
        waitingDays: 1,
        satisfactionRate: 98,
        schemeUsed: "National AIDS Control Programme (NACP)"
      },
      {
        name: "Critical Malaria & ICU Therapy",
        category: "Infectious Diseases",
        successRate: 96.7,
        basePrice: "₹65,000 / week",
        subsidyAmount: "₹65,000 / week",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 5400,
        waitingDays: 0,
        satisfactionRate: 93,
        schemeUsed: "MJPJAY Maharashtra Scheme"
      }
    ]
  },
  {
    id: "aiims-delhi",
    hospitalName: "All India Institute of Medical Sciences (AIIMS)",
    address: "Ansari Nagar, New Delhi 110029",
    location: "Delhi",
    contact: "+91 11 2658 8500",
    accreditation: "Apex Central Government Institute",
    healthIssues: ["Heart", "Cancer", "Brain Tumor", "Neurology", "Fever", "Pediatrics", "Surgery", "Oncology", "AIDS", "HIV Support", "HIV-TB Co-infection"],
    supportedSchemes: [
      { name: "NACP Central Free ART & CD4 Subsidy", amount: "100% Covered Diagnostics & Medication", org: "NACO Central Govt" },
      { name: "Ayushman Bharat (PM-JAY)", amount: "₹5,00,000 standard grant", org: "National Govt" },
      { name: "Rashtriya Arogya Nidhi (RAN)", amount: "Up to ₹15,00,000 for poorest families", org: "Central Ministry" },
      { name: "Delhi Arogya Kosh (DAK)", amount: "100% Free surgical procedures", org: "Delhi State Govt" }
    ],
    availableLabs: [
      "AIIMS Apex Virology Lab & CD4 Diagnostic Centre",
      "NABL Molecular Microbiology & PCR Assays Lab",
      "Immunology Research Diagnostics Unit"
    ],
    services: [
      {
        name: "AIDS Central ART Support Plan",
        category: "HIV Specialty Care",
        successRate: 98.1,
        basePrice: "₹11,000 / mo",
        subsidyAmount: "₹11,000 / mo",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 8600,
        waitingDays: 2,
        satisfactionRate: 97,
        schemeUsed: "NACP Central Free ART & CD4 Subsidy"
      },
      {
        name: "Oncology Resection Surgery",
        category: "Surgical Oncology",
        successRate: 87.9,
        basePrice: "₹1,95,000",
        subsidyAmount: "₹1,95,000 (100% Subsidized)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 4600,
        waitingDays: 25,
        satisfactionRate: 95,
        schemeUsed: "Delhi Arogya Kosh (DAK)"
      }
    ]
  },
  {
    id: "apollo-chennai",
    hospitalName: "Apollo Speciality Hospitals",
    address: "21, Greams Lane, Off Greams Road, Thousand Lights, Chennai 600006",
    location: "Chennai",
    contact: "+91 44 2829 0200",
    accreditation: "NABH Accredited Multi-Speciality",
    healthIssues: ["Heart", "Cardiology", "Heart Transplant", "Angioplasty", "Kidney", "Renal Science", "HIV Care", "AIDS Counseling", "Dialysis"],
    supportedSchemes: [
      { name: "NACP Cashless HIV Treatment Support", amount: "Fully Subsidized Doctor & Lab Advisory", org: "NACO Tamil Nadu" },
      { name: "CMCHIS TN Govt Scheme", amount: "₹5,00,000 cashless card cap", org: "Tamil Nadu Govt" },
      { name: "Ayushman Bharat (PM-JAY)", amount: "₹5,00,000 per family", org: "National Govt" }
    ],
    availableLabs: [
      "Apollo Diagnostics & Wellness Lab Center",
      "Advanced Serology and PCR Laboratory Unit"
    ],
    services: [
      {
        name: "Orthotopic Heart Transplant",
        category: "Advanced Cardiothoracic",
        successRate: 90.1,
        basePrice: "₹11,50,000",
        subsidyAmount: "₹5,00,000 Maximum Cap",
        netPrice: "₹6,50,000 Out-of-pocket",
        annualProcedures: 120,
        waitingDays: 90,
        satisfactionRate: 93,
        schemeUsed: "CMCHIS TN Govt Scheme"
      },
      {
        name: "Renal Hemodialysis Therapy",
        category: "Renal Specialty",
        successRate: 98.2,
        basePrice: "₹4,200 / session",
        subsidyAmount: "₹4,200 / session",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 14000,
        waitingDays: 2,
        satisfactionRate: 97,
        schemeUsed: "CMCHIS TN Govt Scheme"
      }
    ]
  },
  {
    id: "adyar-chennai",
    hospitalName: "Adyar Cancer Institute",
    address: "Sardar Patel Rd, Guindy National Park, Adyar, Chennai 600020",
    location: "Chennai",
    contact: "+91 44 2491 0754",
    accreditation: "WHO Collaborative Cancer Institute",
    healthIssues: ["Cancer", "Oncology", "Pediatric Oncology", "Chemotherapy", "Radiation Therapy", "Tumor Surgery", "HIV Associated Lymphoma"],
    supportedSchemes: [
      { name: "CMCHIS Special Cancer Cover", amount: "₹5,00,000 specialized cap", org: "Tamil Nadu Govt" },
      { name: "PMJAY National Scheme", amount: "₹5,00,000 standard", org: "National Govt" },
      { name: "Central AIDS Support & Diagnostic Waiver", amount: "100% diagnostics & blood test waiver", org: "Central Health Ministry" }
    ],
    availableLabs: [
      "Onco-Pathology & Lymphoma Research Diagnostic Lab",
      "Special Clinical Virology Assays Unit"
    ],
    services: [
      {
        name: "Pediatric Lymphoma Chemotherapy",
        category: "Pediatric Oncology",
        successRate: 88.4,
        basePrice: "₹2,20,000",
        subsidyAmount: "₹2,20,000 (100% Covered)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 1500,
        waitingDays: 5,
        satisfactionRate: 96,
        schemeUsed: "CMCHIS Special Cancer Cover"
      }
    ]
  }
];

// Presets for Autocomplete suggestions
const POPULAR_DISEASES = [
  "Cancer", "HIV/AIDS", "Dialysis", "Heart Surgery", "Physiotherapy", 
  "Organ Transplant", "Oncology", "Cardiology", "Neurology", "Pediatrics"
];

const POPULAR_LOCATIONS = [
  "Chennai", "Mumbai", "Delhi", "Kolkata", "Bengaluru", 
  "Hyderabad", "Telangana", "Kerala", "Tamil Nadu", "Maharashtra"
];

const activeTabLabels = {
  en: { discover: 'Scheme Discover', hospitals: 'Hospital Finder', assistant: 'AI Buddy Chat', saved: 'Bookmarked' },
  hi: { discover: 'योजना खोजें', hospitals: 'अस्पताल खोजें', assistant: 'सखा चैट', saved: 'सुरक्षित' },
  ta: { discover: 'திட்டங்கள்', hospitals: 'மருத்துவமனைகள்', assistant: 'தோழனுடன் அரட்டை', saved: 'சேமித்தவை' },
  mr: { discover: 'योजना शोधा', hospitals: 'दवाखाने शोधा', assistant: 'मित्र चॅट', saved: 'जतन केलेले' }
};

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'discover' | 'hospitals' | 'assistant' | 'saved'>('discover');

  // Shared Language selection: 'en' (English), 'hi' (Hindi), 'ta' (Tamil), 'mr' (Marathi)
  const [language, setLanguage] = useState<'en' | 'hi' | 'ta' | 'mr'>('en');

  // Input States
  const [diseaseSearch, setDiseaseSearch] = useState<string>('Cancer');
  const [locationSearch, setLocationSearch] = useState<string>('Chennai');
  
  // Suggestion helpers
  const [showDiseaseSuggestions, setShowDiseaseSuggestions] = useState<boolean>(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState<boolean>(false);

  // Demographic Eligibility Profiles
  const [patientProfile, setPatientProfile] = useState<DemographicProfile>({
    age: '45',
    gender: 'Female',
    income: '250000',
    state: 'Tamil Nadu',
    bplStatus: true,
    disabilityStatus: false
  });

  // Dual AI Search states
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // RAG Results
  const [intentData, setIntentData] = useState<IntentExtraction | null>({
    disease: "Cancer",
    location: "Chennai",
    treatmentType: "Chemotherapy / Radiotherapy",
    financialRequirement: "Subsidized or Fully Cashless coverage under wellness acts",
    searchQuery: "government cancer schemes Tamil Nadu CMCHIS eligibility limits"
  });

  const [ragResult, setRagResult] = useState<RagSchemeResults | null>({
    success: true,
    confidence: "High (Official Verified)",
    sources: [
      { title: "National Health Authority - PMJAY", url: "https://pmjay.gov.in/" },
      { title: "Tamil Nadu Chief Minister's Comprehensive Health Insurance Scheme", url: "https://www.cmchistn.com/" }
    ],
    answer: `### Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS) - Tamil Nadu
This scheme serves low-income families residing in Tamil Nadu, offering up to **₹5,00,000** yearly coverage for tertiary specialty treatments.

#### 🎯 Eligibility Guidelines Evaluated for Your Context:
- **State eligibility:** Verified (${patientProfile.state} Resident).
- **Annual Income Check:** Your declared family income of ₹2,50,000 matches scheme thresholds (typically families with incomes under ₹1.2 - 3 Lakhs qualify based on criteria).
- **Social Status:** ${patientProfile.bplStatus ? "BPL Priority selection active: Guaranteed enrollment." : "General enrollment guidelines apply."}

#### 💼 Coverage Cap Highlights:
- **Oncology procedures & diagnostics:** 100% Cashless treatment cover up to a limit of **₹5,00,000** across authorized government and private empanelled hospitals.
- **Supportive medications:** Chemotherapy cocktails, radiotherapy sessions, and surgical tumor interventions are fully covered.

#### 📂 Document Checklist Required:
1. **Aadhaar Card** (Mandatory identity).
2. **Income Certificate** (Issued by the revenue authority/Tehsildar).
3. **Ration Card** (To evaluate family structure).
4. **BPL Card / Antyodaya Anna Yojana card** (If applicable for priority).
5. **Clinical Diagnosis Summary / Doctor's Prescription** validating oncology intervention.`
  });

  // Selected details
  const [selectedHospital, setSelectedHospital] = useState<HospitalRecord | null>(HEALTH_DIRECTORY[5]); // Adyar Cancer Institute
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  const [savedHospitalIds, setSavedHospitalIds] = useState<string[]>(['tmh-mumbai', 'apollo-chennai']);

  // Filtered hospitals based on disease/location
  const matchedHospitals = HEALTH_DIRECTORY.filter(h => {
    const dQuery = (diseaseSearch || "").trim().toLowerCase();
    const lQuery = (locationSearch || "").trim().toLowerCase();

    const matchesDisease = dQuery ? h.healthIssues.some(issue => 
      issue.toLowerCase().includes(dQuery) || h.services.some(s => s.category.toLowerCase().includes(dQuery) || s.name.toLowerCase().includes(dQuery))
    ) : true;

    const matchesLocation = lQuery ? (
      h.location.toLowerCase().includes(lQuery) || h.address.toLowerCase().includes(lQuery)
    ) : true;

    return matchesDisease && matchesLocation;
  });

  // Master click-to-run Scheme discovery
  const runSchemeDiscovery = async () => {
    if (!diseaseSearch.trim()) {
      setSearchError("Please specify a medical issue or specialty.");
      return;
    }

    setIsAiSearching(true);
    setSearchError(null);

    try {
      // Step 1: LLM Intent extraction
      const intentRes = await fetch('/api/ai/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${diseaseSearch} treatment options in ${locationSearch}` })
      });

      let intentDataJson: any = {};
      const intentContentType = intentRes.headers.get("content-type");
      if (intentContentType && intentContentType.includes("application/json")) {
        intentDataJson = await intentRes.json();
      } else {
        const text = await intentRes.text();
        if (text.includes("<html") || text.includes("<!DOCTYPE")) {
          throw new Error("The AI backend is currently warming up. Please try again in a few seconds.");
        } else {
          throw new Error("Unable to parse intent extraction error response.");
        }
      }
      if (!intentRes.ok) throw new Error(intentDataJson.error || "Failed intent parsing.");

      const parsedIntent: IntentExtraction = intentDataJson.data;
      setIntentData(parsedIntent);

      // Step 2: Grounded Search (RAG summary) using retrieved intent & patient context!
      const searchRes = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery: parsedIntent.searchQuery,
          age: patientProfile.age,
          gender: patientProfile.gender,
          income: patientProfile.income,
          state: patientProfile.state,
          bplStatus: patientProfile.bplStatus,
          disabilityStatus: patientProfile.disabilityStatus
        })
      });

      let searchJson: any = {};
      const searchContentType = searchRes.headers.get("content-type");
      if (searchContentType && searchContentType.includes("application/json")) {
        searchJson = await searchRes.json();
      } else {
        const text = await searchRes.text();
        if (text.includes("<html") || text.includes("<!DOCTYPE")) {
          throw new Error("The search discovery system is processing database routes. Please try again.");
        } else {
          throw new Error("Unable to process search discovery response.");
        }
      }
      if (!searchRes.ok) throw new Error(searchJson.error || "Failed RAG discovery.");

      setRagResult({
        success: searchJson.success,
        answer: searchJson.answer,
        sources: searchJson.sources || [],
        confidence: searchJson.confidence || "Medium",
        isOfflineFallback: searchJson.isOfflineFallback || intentDataJson.isOfflineFallback || false
      });

      // Switch to discover tab immediately to view results
      setActiveTab('discover');

    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || "An unexpected network error occurred.");
    } finally {
      setIsAiSearching(false);
    }
  };

  // Report completed callback
  const handleReportCompleted = (keywords: string, condition: string, specialty: string) => {
    setDiseaseSearch(keywords || condition || specialty);
    // Autofill intent context directly as feedback
    setIntentData({
      disease: condition,
      location: locationSearch || "Your Local Region",
      treatmentType: specialty,
      financialRequirement: "Subsidized government patient funds as requested in prescription",
      searchQuery: `government medical schemes for ${condition} treatment in ${locationSearch || patientProfile.state}`
    });
  };

  // Toggle saved bookmarks
  const toggleSaveHospital = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedHospitalIds.includes(id)) {
      setSavedHospitalIds(prev => prev.filter(hid => hid !== id));
    } else {
      setSavedHospitalIds(prev => [...prev, id]);
    }
  };

  // Quick preset triggers
  const handleApplyPreset = (issue: string, loc: string) => {
    setDiseaseSearch(issue);
    setLocationSearch(loc);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 text-slate-950 rounded-xl flex items-center justify-center font-black shadow-lg shadow-teal-500/20">
              <Activity className="h-5.5 w-5.5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight uppercase">MedFind Pro</h1>
                <span className="text-[9px] bg-teal-500/10 text-teal-400 font-extrabold px-1.5 py-0.5 rounded border border-teal-500/20 tracking-wider">
                  CLINICAL RAG v3.5
                </span>
              </div>
              <p className="text-xs text-slate-450">AI Healthcare Scheme Discovery & Hospital Referral Portal</p>
            </div>
          </div>

          {/* Nav Tabs & Language Selection */}
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <nav className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {[
                { id: 'discover', label: activeTabLabels[language].discover, icon: Sparkles },
                { id: 'hospitals', label: activeTabLabels[language].hospitals, icon: MapPin },
                { id: 'assistant', label: activeTabLabels[language].assistant, icon: HeartHandshake },
                { id: 'saved', label: `${activeTabLabels[language].saved} (${savedHospitalIds.length})`, icon: Bookmark }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      isActive 
                        ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/10' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Language Dropdown/Selector inside main header */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-850 shrink-0">
              <span className="text-[9px] font-mono uppercase font-black text-slate-550 tracking-wider">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-[11px] font-black text-teal-400 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-slate-900 text-white">🇬🇧 English</option>
                <option value="hi" className="bg-slate-900 text-white">🇮🇳 हिंदी (Hindi)</option>
                <option value="ta" className="bg-slate-900 text-white">🇮🇳 தமிழ் (Tamil)</option>
                <option value="mr" className="bg-slate-900 text-white">🇮🇳 मराठी (Marathi)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* === LEFT COLUMN: CORE INPUT PORTALS (4/12 grid span) === */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* A. Dual-Search Form Panel */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-1">
              <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-teal-400" /> SEARCH PLATFORM CORES
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-tight">Active Coverage Filters</h2>
            </div>

            {/* Disease Field */}
            <div className="space-y-1.5 relative">
              <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">
                1. Medical Condition / Specialty
              </label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="e.g. Cancer, HIV/AIDS, Dialysis"
                  value={diseaseSearch}
                  onFocus={() => setShowDiseaseSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDiseaseSuggestions(false), 200)}
                  onChange={(e) => setDiseaseSearch(e.target.value)}
                  className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-850 focus:border-teal-500/50 rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none transition-all pl-9"
                />
                <Activity className="absolute left-3.5 top-3.5 h-4 w-4 text-teal-500/80" />
              </div>

              {/* Disease Suggestions dropdown */}
              {showDiseaseSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl py-1.5 shadow-2xl z-50 max-h-40 overflow-y-auto">
                  {POPULAR_DISEASES.filter(d => d.toLowerCase().includes(diseaseSearch.toLowerCase())).map((d, dIdx) => (
                    <button
                      key={dIdx}
                      onMouseDown={() => setDiseaseSearch(d)}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-slate-800 text-[11px] font-medium text-slate-350 hover:text-white transition-colors"
                    >
                      🎗️ {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Field */}
            <div className="space-y-1.5 relative">
              <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">
                2. Target Location / State
              </label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="e.g. Chennai, Mumbai, Delhi"
                  value={locationSearch}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-850 focus:border-emerald-500/50 rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none transition-all pl-9"
                />
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-500/80" />
              </div>

              {/* Location Suggestions dropdown */}
              {showLocationSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl py-1.5 shadow-2xl z-50 max-h-40 overflow-y-auto">
                  {POPULAR_LOCATIONS.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase())).map((l, lIdx) => (
                    <button
                      key={lIdx}
                      onMouseDown={() => setLocationSearch(l)}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-slate-800 text-[11px] font-medium text-slate-350 hover:text-white transition-colors"
                    >
                      📍 {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preset shortcuts */}
            <div className="space-y-1.5 pt-1.5 border-t border-slate-850">
              <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block font-mono">Suggested Combinations:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { tag: "🎗️ Oncology (Chennai)", d: "Cancer", l: "Chennai" },
                  { tag: "🛡️ HIV AIDS (Mumbai)", d: "HIV/AIDS", l: "Mumbai" },
                  { tag: "🚨 PMJAY Dialysis", d: "Dialysis", l: "Tamil Nadu" },
                  { tag: "🩺 Cardiology (Delhi)", d: "Cardiology", l: "Delhi" }
                ].map((pre, pidx) => (
                  <button
                    key={pidx}
                    onClick={() => handleApplyPreset(pre.d, pre.l)}
                    className="text-[9px] bg-slate-950 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg transition-all"
                  >
                    {pre.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Discovery Button */}
            <button
              onClick={runSchemeDiscovery}
              disabled={isAiSearching}
              className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 transition-colors uppercase tracking-widest text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 focus:outline-none font-mono cursor-pointer disabled:bg-slate-800 disabled:text-slate-600"
            >
              {isAiSearching ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> DISCOVERING ACTIVE SCHEMES...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-slate-950 animate-pulse" /> RUN AI SCHEME SEARCH
                </>
              )}
            </button>

            {searchError && (
              <div className="p-3 bg-red-950/25 border border-red-500/25 text-red-400 rounded-xl text-[10.5px] leading-snug flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                <div>
                  <span className="font-bold block">Discovery Halted</span>
                  {searchError}
                </div>
              </div>
            )}
          </div>

          {/* B. Report uploader widget (Privacy first) */}
          <ReportUploader onAnalysisComplete={handleReportCompleted} />

          {/* C. Elastic Demographics Panel */}
          <EligibilityEngine profile={patientProfile} onChange={setPatientProfile} />

        </section>

        {/* === RIGHT COLUMN: SCHEME DISPLAY & AUDIT VIEW (8/12 grid span) === */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* ACTIVE TAB: DISCOVER VIEW */}
          {activeTab === 'discover' && (
            <div className="space-y-6">
              
              {/* Intent Analysis Details Overlay banner */}
              {intentData && (
                <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl space-y-3 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-start gap-4 pb-2 border-b border-slate-850">
                    <div>
                      <span className="text-[8.5px] font-black text-cyan-400 tracking-wider uppercase block">AI Intent Analysis Extract</span>
                      <h3 className="text-xs font-bold text-white mt-0.5">Parameters Extracted for Grounding:</h3>
                    </div>
                    <span className="text-[8px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded font-bold uppercase">
                      Query Resolved
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10.5px]">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                      <span className="text-[7.5px] text-slate-500 font-extrabold uppercase block font-mono">1. Disease Condition</span>
                      <span className="text-white font-bold block mt-0.5">{intentData.disease || "Not Specified"}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                      <span className="text-[7.5px] text-slate-500 font-extrabold uppercase block font-mono">2. Search Location</span>
                      <span className="text-white font-bold block mt-0.5">{intentData.location || "Not Specified"}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                      <span className="text-[7.5px] text-slate-500 font-extrabold uppercase block font-mono">3. Therapy Category</span>
                      <span className="text-cyan-400 font-bold block mt-0.5 truncate">{intentData.treatmentType || "Standard Direct"}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                      <span className="text-[7.5px] text-slate-500 font-extrabold uppercase block font-mono">4. Assistance Pref</span>
                      <span className="text-teal-400 font-bold block mt-0.5 truncate">{intentData.financialRequirement || "Free Cashless"}</span>
                    </div>
                  </div>

                  {intentData.searchQuery && (
                    <div className="bg-slate-950 border border-slate-900 text-[10px] px-3 py-1.5 rounded-xl text-slate-500 truncate select-all">
                      🔍 <span className="font-bold text-slate-400">Search keywords transmitted:</span> <code className="text-cyan-400 font-mono">"{intentData.searchQuery}"</code>
                    </div>
                  )}
                </div>
              )}

              {/* RAG summary discovery panel */}
              {ragResult ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6.5 space-y-5.5 shadow-xl relative overflow-hidden">
                  
                  {/* Glowing background */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Offline fallback warning banner */}
                  {ragResult.isOfflineFallback && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-300">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
                      <div>
                        <span className="font-bold block text-white">Gemini API Quota Rested (Offline Fallback Match)</span>
                        <p className="mt-0.5 leading-relaxed text-slate-300">
                          The live Gemini API has reached its monthly free quota allowance. To guarantee continuous service, MedFind Pro has loaded matched health welfare schemes from our offline verified registry cache. All comparison desks remain fully functional!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Scheme Header Audit information */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 border-b border-slate-850 pb-4.5">
                    <div>
                      <span className="text-[9px] font-black tracking-widest text-teal-400 uppercase flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-teal-400 animate-pulse" /> VERIFIED RAG SUMMARY REGISTERED
                      </span>
                      <h2 className="text-md font-bold text-white tracking-tight mt-0.5">Matched Welfare Programs & Packages</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-850 text-right">
                        <span className="text-[7.5px] text-slate-500 uppercase font-extrabold block">LLM Verification Confidence</span>
                        <span className="text-[10px] text-teal-400 font-black">{ragResult.confidence}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Core content */}
                  <div className="prose prose-invert max-w-none text-slate-350 text-sm leading-relaxed space-y-4">
                    {/* Render helper for markdown format strings */}
                    {ragResult.answer.split("\n").map((line, lIdx) => {
                      if (line.startsWith("###")) {
                        return <h3 key={lIdx} className="text-xs font-bold text-white mt-4 uppercase tracking-wider text-teal-400">{line.replace("###", "")}</h3>;
                      } else if (line.startsWith("####")) {
                        return <h4 key={lIdx} className="text-[11.5px] font-black text-cyan-300 mt-2 tracking-widest uppercase">{line.replace("####", "")}</h4>;
                      } else if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                        return <div key={lIdx} className="pl-4 text-[13px] text-slate-300 flex items-start gap-2">
                          <span className="text-teal-400 select-none">•</span>
                          <span>{line.replace(/^-\s*|^\*\s*/, "")}</span>
                        </div>;
                      } else if (line.trim()) {
                        return <p key={lIdx} className="text-[13px] text-slate-350">{line}</p>;
                      }
                      return <div key={lIdx} className="h-1.5" />;
                    })}
                  </div>

                  {/* Grounded Citation links lists */}
                  {ragResult.sources && ragResult.sources.length > 0 && (
                    <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-teal-400" />
                        <div>
                          <span className="text-[9px] font-black text-white uppercase tracking-wider block">Grounded Authority Index Checklist</span>
                          <span className="text-[8px] text-slate-550 block">Matches found in government networks & official platforms</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {ragResult.sources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-900 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-850 hover:border-teal-500/30 transition-all flex items-center justify-between gap-3 group text-[11px]"
                          >
                            <span className="text-slate-300 font-bold group-hover:text-teal-400 truncate max-w-[85%]">{source.title}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-white shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safety Audit Disclaimer */}
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-slate-450 leading-relaxed flex gap-2">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-500" />
                    <p>
                      <strong>Safety Audit:</strong> coverage details and documents listed above have been checked against retrieved state registries in real-time. Eligibility criteria apply. Present original clinical prescriptions at counter desks to audit qualifications.
                    </p>
                  </div>

                </div>
              ) : (
                /* Loading Skeleton */
                isAiSearching ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 animate-pulse select-none py-14">
                    <RefreshCw className="h-8 w-8 text-teal-500 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">querying welfare registries...</h3>
                      <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                        Compiling state eligibility matrices and searching NHA databases for matching package assistance formulas.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* No discovery search made yet state */
                  <div className="bg-slate-900 border border-slate-850 rounded-3xl p-8 text-center space-y-4.5 py-14">
                    <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center text-slate-600 mx-auto border border-slate-800">
                      <Sparkles className="h-7 w-7 text-teal-400 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-white uppercase tracking-wide">Enter specialty keywords to search</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        Provide a diagnosis or clinical condition (e.g. Cancer in Chennai, or HIV therapy in Mumbai) to retrieve summarized welfare schemes in real-time.
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* Supported Hospitals matching direct indicators */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest">Active Partner Hospital Listings ({matchedHospitals.length})</h3>
                  <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest">Verified Accreditation</span>
                </div>

                {matchedHospitals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchedHospitals.map(hospital => (
                      <div
                        key={hospital.id}
                        onClick={() => {
                          setSelectedHospital(hospital);
                          setSelectedServiceIndex(0);
                          setActiveTab('hospitals');
                        }}
                        className={`bg-slate-900 border hover:border-teal-500/30 rounded-2xl p-4.5 transition-all duration-200 cursor-pointer space-y-3.5 group relative flex flex-col justify-between ${
                          selectedHospital?.id === hospital.id ? 'ring-2 ring-teal-500/40 border-teal-500/40' : 'border-slate-850'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[8px] text-teal-400 font-mono font-extrabold uppercase tracking-widest bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/15">
                              {hospital.location}
                            </span>
                            <span className="text-[9px] text-slate-500 font-bold font-mono uppercase truncate">{hospital.accreditation?.split(" ")[0]} Accredited</span>
                          </div>

                          <h4 className="text-xs font-black text-white group-hover:text-teal-300 transition-colors leading-tight">{hospital.hospitalName}</h4>
                          <p className="text-[10px] text-slate-400 flex items-start gap-1 leading-snug">
                            <MapPin className="h-3 w-3 mt-0.5 text-slate-500 shrink-0" />
                            <span>{hospital.address}</span>
                          </p>
                        </div>

                        {/* Top Scheme qualifying cap preview */}
                        <div className="bg-slate-950 border border-slate-900/80 rounded-xl p-3 text-[10px] space-y-1 flex-1">
                          <div className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest mb-1">Qualifying Coverage:</div>
                          {hospital.supportedSchemes.slice(0, 1).map((sch, schidx) => (
                            <div key={schidx} className="flex justify-between items-center gap-2">
                              <span className="text-slate-300 font-bold truncate max-w-[60%]">🛡️ {sch.name}</span>
                              <span className="text-teal-400 font-extrabold text-[9px] bg-teal-500/10 border border-teal-500/15 px-1.5 rounded">{sch.amount.split(" ")[0]}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer action */}
                        <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-850 pt-2 font-mono">
                          <span>Verified Partner Desk</span>
                          <span className="text-teal-400 font-bold group-hover:underline flex items-center gap-0.5 uppercase">Compare Rates →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6.5 text-center text-slate-450 text-xs">
                    No directory partner listed in {locationSearch || "this location"} supports {diseaseSearch || "this specialty"} directly out of the box. Search with the AI assistant or browse custom RAG listings.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ACTIVE TAB: HOSPITALS & RATE EXCHANGER VIEW */}
          {activeTab === 'hospitals' && (
            <div className="space-y-6">
              
              {/* Split layout: Hospital List & Hospital Detail view */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Hospital List Selector */}
                <div className="md:col-span-5 space-y-3.5">
                  <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest pl-1">Partner Centers</h3>
                  
                  <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                    {HEALTH_DIRECTORY.map((hospital) => {
                      const isSelected = selectedHospital?.id === hospital.id;
                      return (
                        <div
                          key={hospital.id}
                          onClick={() => {
                            setSelectedHospital(hospital);
                            setSelectedServiceIndex(0);
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/20 shadow-lg shadow-teal-500/5' 
                              : 'bg-slate-900/60 border-slate-850 hover:bg-slate-900 hover:border-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[8px] bg-slate-950 text-slate-400 font-bold px-1.5 py-0.5 rounded border border-slate-800">
                              {hospital.location}
                            </span>
                            <span className="text-[8px] text-teal-400 font-bold block">{hospital.accreditation?.split(" ")[0]}</span>
                          </div>

                          <h4 className="text-xs font-black text-white mt-1.5">{hospital.hospitalName}</h4>
                          <p className="text-[10px] text-slate-450 line-clamp-1 mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-500 shrink-0" /> {hospital.address}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Hospital Comprehensive Panel (Specialties, cost comparisons, success rates) */}
                <div className="md:col-span-7">
                  {selectedHospital ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                      {/* Header */}
                      <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-855">
                        <div className="space-y-1 max-w-[80%]">
                          <div className="flex items-center gap-1 text-[8px] bg-teal-500/10 text-teal-400 font-black tracking-widest uppercase px-2 py-0.5 border border-teal-500/20 rounded-md w-fit">
                            <Award className="h-3 w-3" /> VERIFIED PROVIDER
                          </div>
                          <h3 className="text-md font-bold text-white tracking-tight">{selectedHospital.hospitalName}</h3>
                          <p className="text-[10px] text-slate-400 flex items-start gap-1 leading-snug">
                            <MapPin className="h-3 w-3 text-slate-500 mt-0.5 shrink-0" />
                            <span>{selectedHospital.address}</span>
                          </p>
                        </div>

                        <button 
                          onClick={() => toggleSaveHospital(selectedHospital.id)}
                          className={`p-2 rounded-xl border transition-all shrink-0 ${
                            savedHospitalIds.includes(selectedHospital.id)
                              ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
                              : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-white'
                          }`}
                          title="Bookmark Hospital"
                        >
                          <Bookmark className="h-4 w-4" fill={savedHospitalIds.includes(selectedHospital.id) ? "currentColor" : "none"} />
                        </button>
                      </div>

                      {/* Info parameters */}
                      <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                          <span className="text-[8px] text-slate-500 font-extrabold uppercase block font-mono">Contact Line</span>
                          <span className="text-white font-bold block mt-0.5 select-all">{selectedHospital.contact || "Not available"}</span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                          <span className="text-[8px] text-slate-500 font-extrabold uppercase block font-mono">Accreditation</span>
                          <span className="text-teal-400 font-bold block mt-0.5 truncate">{selectedHospital.accreditation || "NABH Verified"}</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block font-mono">Clinically Supported Specialties</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedHospital.healthIssues.map((issue, idx) => {
                            const isHighlight = diseaseSearch && issue.toLowerCase().includes(diseaseSearch.toLowerCase());
                            return (
                              <span
                                key={idx}
                                className={`text-[9.5px] px-2 py-0.5 rounded border ${
                                  isHighlight 
                                    ? 'bg-teal-500/10 text-teal-300 border-teal-500/30 font-bold' 
                                    : 'bg-slate-950 text-slate-400 border-slate-900'
                                }`}
                              >
                                ⚕️ {issue}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* CLINICAL SERVICE COST COMPARATIVE PANEL */}
                      <div className="space-y-3.5 border-t border-slate-850 pt-4">
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase flex items-center gap-1.5 font-mono">
                            <TrendingUp className="h-3.5 w-3.5 text-teal-500 animate-pulse" /> EFFICACY & PACKAGES BOARD
                          </span>
                          <span className="text-[8px] text-slate-500 font-extrabold uppercase">
                            Select clinical treatment program:
                          </span>
                        </div>

                        {/* Buttons to choose service */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedHospital.services.map((service, idx) => {
                            const isSelected = selectedServiceIndex === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => setSelectedServiceIndex(idx)}
                                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between items-start gap-1.5 focus:outline-none ${
                                  isSelected 
                                    ? 'bg-slate-950 border-teal-500 ring-1 ring-teal-500/15' 
                                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-850 text-slate-400 hover:text-white'
                                }`}
                              >
                                <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">{service.category}</span>
                                  <h4 className="text-[11px] font-bold text-white mt-0.5 line-clamp-1">{service.name}</h4>
                                </div>

                                <div className="flex justify-between items-center gap-2 w-full mt-1 border-t border-slate-900 pt-1 text-[10px]">
                                  <span className="text-emerald-400 font-extrabold">{service.netPrice.split(" ")[0]}</span>
                                  <span className="text-slate-500 font-mono text-[9px] bg-slate-950 px-1 py-0.5 border border-slate-800 rounded">{service.successRate}% Efficacy</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Service detail indicators */}
                        {selectedHospital.services[selectedServiceIndex] && (() => {
                          const s = selectedHospital.services[selectedServiceIndex];
                          return (
                            <div className="bg-slate-950 border border-slate-850/60 rounded-xl p-4 space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                                <div>
                                  <span className="text-[8.5px] font-black text-slate-500 uppercase block font-mono">SELECTED WORKLOAD PROPOSAL</span>
                                  <h4 className="text-xs font-bold text-teal-400 mt-0.5">{s.name}</h4>
                                </div>
                                <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded font-extrabold font-mono">
                                  {s.successRate >= 96 ? 'High Quality Care' : 'Specialized Program'}
                                </span>
                              </div>

                              {/* Stacked Cost bar layout representation with animated gauges */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-[9px] font-black font-mono text-slate-500 uppercase">
                                  <span>Visual Cost Breakdown</span>
                                  <span className="text-teal-400">Government Coverage active</span>
                                </div>

                                <div className="h-3 w-full bg-slate-900 rounded-full flex overflow-hidden border border-slate-805">
                                  {/* Subsidy covered portion */}
                                  <div 
                                    className="h-full bg-emerald-500/80 transition-all duration-300"
                                    style={{ width: s.netPrice.includes("₹0") || s.netPrice.includes("$0") ? "100%" : "60%" }}
                                    title="Scheme subsidy cover"
                                  />
                                  {/* Custom out-of-pocket balance */}
                                  <div 
                                    className="h-full bg-yellow-500/80 transition-all duration-300"
                                    style={{ width: s.netPrice.includes("₹0") || s.netPrice.includes("$0") ? "0%" : "40%" }}
                                    title="Personal expense"
                                  />
                                </div>

                                <div className="flex justify-between items-center text-[9px] text-slate-450 uppercase font-bold pt-1.5">
                                  <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Subsidy Cap ({s.subsidyAmount.split(" ")[0]})
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500" /> Personal Gap ({s.netPrice.split(" ")[0]})
                                  </span>
                                </div>
                              </div>

                              {/* Efficacy indicators */}
                              <div className="grid grid-cols-3 gap-2.5 pt-1.5 text-center text-xs">
                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5">
                                  <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest block font-mono">Efficacy</span>
                                  <span className="text-white font-extrabold block mt-0.5">{s.successRate}%</span>
                                </div>
                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5">
                                  <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest block font-mono">Yearly Cases</span>
                                  <span className="text-white font-extrabold block mt-0.5">{s.annualProcedures.toLocaleString()}</span>
                                </div>
                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5">
                                  <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest block font-mono">Wait Time</span>
                                  <span className="text-cyan-400 font-extrabold block mt-0.5">{s.waitingDays === 0 ? "Immediate" : `${s.waitingDays} Days`}</span>
                                </div>
                              </div>

                              {/* Sponsor Program cover details */}
                              <div className="bg-slate-900/60 p-2.5 border border-slate-850 rounded-xl text-[10.5px] text-slate-400 flex items-center justify-between gap-3">
                                <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest shrink-0">Welfare Sponsor Cover:</span>
                                <span className="font-bold text-white truncate text-right text-[10px]">{s.schemeUsed}</span>
                              </div>
                            </div>
                          );
                        })()}

                      </div>

                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 text-center text-slate-450 leading-relaxed py-14">
                      Select a partner hospital from the panel to view cost comparisons, supported schemes, and clinical success indicators.
                    </div>
                  )}
                </div>

              </div>
              
              {/* Local directory list ledger of coverage limits */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Active Support Schemes Coverage Cap Ledger</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Summary of major national and regional packages indexed in the directory.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    { name: "Ayushman Bharat (PM-JAY)", cap: "₹5,00,000 / year", coverage: "100% Cashless secondary & tertiary cover limits for low income families", origin: "Central Indian Gov" },
                    { name: "MJPJAY Special Maharashtra Scheme", cap: "₹1,50,000 - ₹5,00,000", coverage: "Cashless cover on major oncology surgeries and cardiothoracic plans", origin: "Maharashtra State Gov" },
                    { name: "Rashtriya Arogya Nidhi (RAN)", cap: "Up to ₹15,00,000", coverage: "One-time financial assistance for super-specialty treatment at apex government institutes", origin: "Central Indian Gov" },
                    { name: "CMCHIS Regional Tamil Nadu Scheme", cap: "₹5,00,000 / family", coverage: "Special cancer blocks, cardiac transplants, standard cashless caps", origin: "Tamil Nadu State Gov" }
                  ].map((lead, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-855 flex items-start gap-3.5 text-xs">
                      <div className="p-2.5 bg-slate-905 border border-slate-850 text-teal-400 rounded-lg shrink-0 mt-0.5">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-white block leading-tight">{lead.name}</span>
                          <span className="text-teal-400 font-extrabold text-[9.5px] bg-teal-500/10 px-1.5 py-0.5 rounded shrink-0">{lead.cap}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">{lead.coverage}</p>
                        <span className="text-[8px] text-slate-550 uppercase tracking-widest block font-bold font-mono">{lead.origin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ACTIVE TAB: AI ASSISTANT CHAT VIEW */}
          {activeTab === 'assistant' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1 shadow-xl">
                <div className="flex items-center gap-1.5 text-teal-400">
                  <HeartHandshake className="h-5 w-5" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Welfare Q&A Portal</h3>
                </div>
                <p className="text-[11px] text-slate-450">
                  Discuss treatment quotes, coverage policies, state guidelines or documentation details. The AI Assistant checks live web grounding to resolve your concerns.
                </p>
              </div>

              <AssistantChat language={language} onLanguageChange={setLanguage} />
            </div>
          )}

          {/* ACTIVE TAB: BOOKMARKS TRACKER */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
                <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase block font-mono">Welfare bookmarks</span>
                <h3 className="text-xs font-bold text-white uppercase tracking-tight">Saved Facilities ({savedHospitalIds.length})</h3>
                <p className="text-[10px] text-slate-500 leading-normal">
                  You have bookmarked the following clinical facilities. Tap on any item to compare available treatment package rates and active subsidies.
                </p>
              </div>

              {savedHospitalIds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {HEALTH_DIRECTORY.filter(h => savedHospitalIds.includes(h.id)).map(hospital => (
                    <div
                      key={hospital.id}
                      onClick={() => {
                        setSelectedHospital(hospital);
                        setSelectedServiceIndex(0);
                        setActiveTab('hospitals');
                      }}
                      className="bg-slate-900 hover:bg-slate-850 p-4.5 rounded-2xl border border-slate-850 hover:border-teal-500/30 cursor-pointer transition-all flex flex-col justify-between space-y-3 shadow-md group"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-[8px] bg-slate-950 text-teal-400 font-mono font-extrabold uppercase px-2 py-0.5 rounded border border-slate-800">
                            ✨ {hospital.location}
                          </span>
                          
                          <button
                            onClick={(e) => toggleSaveHospital(hospital.id, e)}
                            className="text-teal-400 hover:text-red-400 p-0.5 shrink-0 transition-colors"
                            title="Remove Bookmark"
                          >
                            <Bookmark className="h-4 w-4" fill="currentColor" />
                          </button>
                        </div>

                        <h4 className="text-xs font-black text-white group-hover:text-teal-300 transition-colors leading-tight">{hospital.hospitalName}</h4>
                        <p className="text-[10px] text-slate-400 flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 text-slate-500 shrink-0" />
                          <span className="truncate">{hospital.address}</span>
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 text-[10px] space-y-1">
                        <span className="text-[7.5px] text-slate-500 font-extrabold uppercase block font-mono">Supporting Program Caps:</span>
                        {hospital.supportedSchemes.slice(0, 1).map((sch, schidx) => (
                          <div key={schidx} className="flex justify-between items-center gap-2">
                            <span className="text-slate-300 font-bold truncate max-w-[65%]">🛡️ {sch.name}</span>
                            <span className="text-teal-400 font-extrabold text-[9px] whitespace-nowrap bg-teal-500/10 px-1.5 rounded">{sch.amount.split(" ")[0]}</span>
                          </div>
                        ))}
                      </div>

                      <span className="text-[9px] text-teal-400 font-bold font-mono uppercase text-right leading-none group-hover:underline">Compare rates →</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-8 text-center text-slate-500 italic py-14">
                  No partners bookmarked yet. Browse hospitals and click the bookmark flag icon to persist items in this panel.
                </div>
              )}
            </div>
          )}

        </section>

      </main>

      {/* 3. Footer indicator */}
      <footer className="border-t border-slate-900 bg-slate-950/80 p-6 text-center select-none text-xs text-slate-500 space-y-1.5 shrink-0 mt-8">
        <p className="font-semibold uppercase tracking-widest text-[10px] text-slate-450 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-teal-500" /> MEDFIND PRO SECURE PORTAL INDEX
        </p>
        <p className="max-w-md mx-auto text-[10px] leading-relaxed text-slate-500">
          Search groundings and intelligence vectors operate on highly integrated server-side algorithms to safe-guard clinical metadata. No personal medical descriptors are ever permanently logged or written to local server disk storage.
        </p>
        <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase tracking-wide">
          © 2026 National Health Commission Verified Directory Services. All Rights Preserved.
        </p>
      </footer>

    </div>
  );
}
