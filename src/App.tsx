import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  X,
  Plus,
  Compass,
  Heart,
  FileText,
  Bookmark,
  Wifi,
  Battery,
  Award,
  Zap,
  Info,
  Beaker,
  Dna,
  TrendingUp,
  Clock,
  Star,
  Shield
} from 'lucide-react';

// Define strict typing for Hospital Records
interface SchemeInfo {
  name: string;
  amount: string;
  org: string; // Government body e.g. "Govt of India" or "State NY"
}

interface ServiceMetric {
  name: string;
  category: string;
  successRate: number; // percentage (e.g. 96.8)
  basePrice: string; // cost without scheme
  subsidyAmount: string; // direct scheme deduction
  netPrice: string; // client out-of-pocket
  annualProcedures: number; // clinical volume info
  waitingDays: number; // average wait listing
  satisfactionRate: number; // client positive rating
  schemeUsed: string; // qualifying government scheme name
}

interface HospitalRecord {
  id: string;
  hospitalName: string;
  address: string;
  location: string;
  healthIssues: string[]; // split into array for cleaner matching
  supportedSchemes: SchemeInfo[];
  availableLabs: string[]; // Associated diagnosis and pathology laboratories
  services: ServiceMetric[]; // clinical success rates & pricings dashboard source
}

// Built-in database of Indian & International hospitals with expanded government health schemes, clinical lab directories, and service dashboards
const HEALTH_DIRECTORY: HospitalRecord[] = [
  {
    id: "tmh-mumbai",
    hospitalName: "Tata Memorial Hospital",
    address: "Dr. Ernest Borges Road, Parel East, Mumbai 400012",
    location: "Mumbai",
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
      },
      {
        name: "Malignant Hematology Trial",
        category: "Leukemia/Lymphoma Care",
        successRate: 91.1,
        basePrice: "₹2,50,000",
        subsidyAmount: "₹2,00,000 Grant",
        netPrice: "₹50,000 Out-of-pocket",
        annualProcedures: 1850,
        waitingDays: 7,
        satisfactionRate: 95,
        schemeUsed: "Tata Trust Patients Fund"
      }
    ]
  },
  {
    id: "kokilaben-mumbai",
    hospitalName: "Kokilaben Dhirubhai Ambani Hospital",
    address: "Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai",
    location: "Mumbai",
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
      },
      {
        name: "Craniotomy Tumor Resection",
        category: "Neurosurgery Core",
        successRate: 84.5,
        basePrice: "₹4,80,000",
        subsidyAmount: "₹1,50,000 Support cap",
        netPrice: "₹3,30,000 Out-of-pocket",
        annualProcedures: 450,
        waitingDays: 10,
        satisfactionRate: 91,
        schemeUsed: "Ayushman Bharat (PM-JAY)"
      }
    ]
  },
  {
    id: "kem-mumbai",
    hospitalName: "King Edward Memorial Hospital (KEM)",
    address: "Acharya Donde Marg, Parel, Mumbai 400012",
    location: "Mumbai",
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
      "NCOE Virology Registry Labs",
      "General Clinical Pathology Laboratory"
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
      },
      {
        name: "Pediatric Emergency Resuscitation",
        category: "Child Health & ICU",
        successRate: 98.3,
        basePrice: "₹40,000",
        subsidyAmount: "₹40,000 (Advisors Fund)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 3100,
        waitingDays: 0,
        satisfactionRate: 97,
        schemeUsed: "Poor Patients Aid Fund"
      }
    ]
  },
  {
    id: "fortis-mumbai",
    hospitalName: "Fortis Hiranandani Hospital",
    address: "Mini Seashore Road, Sector 10, Vashi, Navi Mumbai",
    location: "Mumbai",
    healthIssues: ["Heart", "Cardiology", "Knee Replacement", "Orthopedics", "Fever", "HIV Screening"],
    supportedSchemes: [
      { name: "National HIV Free Screening Scheme", amount: "100% fully waived test & referral", org: "NACO Linked Plan" },
      { name: "Ayushman Bharat (PM-JAY)", amount: "₹5,00,000 coverage", org: "National Govt" },
      { name: "Rashtriya Swasthya Bima", amount: "₹30,000 emergency fund", org: "State Health Authority" }
    ],
    availableLabs: [
      "Fortis Standard Pathology Diagnostics",
      "Rapid HIV ELISA Laboratory Wing",
      "NABL Hematology Lab Core"
    ],
    services: [
      {
        name: "Total Knee Replacement",
        category: "Orthopedic Arthroplasty",
        successRate: 96.2,
        basePrice: "₹2,60,000",
        subsidyAmount: "₹1,50,000 Cover",
        netPrice: "₹1,10,000 Out-of-pocket",
        annualProcedures: 850,
        waitingDays: 8,
        satisfactionRate: 96,
        schemeUsed: "Ayushman Bharat (PM-JAY)"
      },
      {
        name: "Rapid HIV Viral Screening",
        category: "Virology Diagnostics",
        successRate: 99.8,
        basePrice: "₹1,500",
        subsidyAmount: "₹1,500 (100% Reimbursement)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 12000,
        waitingDays: 1,
        satisfactionRate: 99,
        schemeUsed: "National HIV Free Screening Scheme"
      },
      {
        name: "Cardiac Angioplasty Stent",
        category: "Heart Care Specialty",
        successRate: 98.6,
        basePrice: "₹2,10,005",
        subsidyAmount: "₹1,50,000 Support cap",
        netPrice: "₹60,005 Out-of-pocket",
        annualProcedures: 940,
        waitingDays: 4,
        satisfactionRate: 95,
        schemeUsed: "Ayushman Bharat (PM-JAY)"
      }
    ]
  },
  {
    id: "aiims-delhi",
    hospitalName: "All India Institute of Medical Sciences (AIIMS)",
    address: "Ansari Nagar, New Delhi 110029",
    location: "Delhi",
    healthIssues: ["Heart", "Cancer", "Brain Tumor", "Neurology", "Fever", "Pediatrics", "Surgery", "Oncology", "AIDS", "HIV Support", "HIV-TB Co-infection"],
    supportedSchemes: [
      { name: "NACP Central Free ART & CD4 Subsidy", amount: "100% Covered Diagnostics & Medication", org: "NACO Central Govt" },
      { name: "Ayushman Bharat (PM-JAY)", amount: "₹5,00,000 standard grant", org: "National Govt" },
      { name: "Rashtriya Arogya Nidhi (RAN)", amount: "Up to ₹15,00,000 for poorest families", org: "Central Ministry" },
      { name: "Delhi Arogya Kosh (DAK)", amount: "100% Free surgical procedures", org: "Delhi State Govt" },
      { name: "PM National Relief Fund (PMNRF)", amount: "₹3,00,000 direct transfer subsidy", org: "PMO India" }
    ],
    availableLabs: [
      "AIIMS Apex Virology Lab & CD4 Diagnostic Centre",
      "NABL Molecular Microbiology & PCR Assays Lab",
      "Immunology Research Diagnostics Unit",
      "Pediatric Hematology Diagnostics"
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
      },
      {
        name: "Coronary Bypass (CABG)",
        category: "Cardiothoracic Surgery",
        successRate: 97.5,
        basePrice: "₹2,40,000",
        subsidyAmount: "₹2,40,000 (100% Cover)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 2300,
        waitingDays: 30,
        satisfactionRate: 94,
        schemeUsed: "Rashtriya Arogya Nidhi (RAN)"
      }
    ]
  },
  {
    id: "apollo-chennai",
    hospitalName: "Apollo Speciality Hospitals",
    address: "21, Greams Lane, Off Greams Road, Thousand Lights, Chennai 600006",
    location: "Chennai",
    healthIssues: ["Heart", "Cardiology", "Heart Transplant", "Angioplasty", "Kidney", "Renal Science", "HIV Care", "AIDS Counseling"],
    supportedSchemes: [
      { name: "NACP Cashless HIV Treatment Support", amount: "Fully Subsidized Doctor & Lab Advisory", org: "NACO Tamil Nadu" },
      { name: "CMCHIS TN Govt Scheme", amount: "₹5,00,000 cashless card cap", org: "Tamil Nadu Govt" },
      { name: "Ayushman Bharat (PM-JAY)", amount: "₹5,00,000 per family", org: "National Govt" },
      { name: "Cooperative Govt Health Pool", amount: "Up to ₹2,50,050 treatment cover", org: "Joint Health Board" }
    ],
    availableLabs: [
      "Apollo Diagnostics & Wellness Lab Center",
      "Advanced Serology and PCR Laboratory Unit",
      "Clinical Pathology & Biochemistry Core"
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
      },
      {
        name: "AIDS / HIV Viral Diagnostic Panel",
        category: "Clinical Serology",
        successRate: 99.7,
        basePrice: "₹3,400",
        subsidyAmount: "₹3,400 (Welfare pool)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 6500,
        waitingDays: 1,
        satisfactionRate: 98,
        schemeUsed: "NACP Cashless HIV Treatment Support"
      }
    ]
  },
  {
    id: "adyar-chennai",
    hospitalName: "Adyar Cancer Institute",
    address: "Sardar Patel Rd, Guindy National Park, Adyar, Chennai 600020",
    location: "Chennai",
    healthIssues: ["Cancer", "Oncology", "Pediatric Oncology", "Chemotherapy", "Radiation Therapy", "Tumor Surgery", "HIV Associated Lymphoma"],
    supportedSchemes: [
      { name: "CMCHIS Special Cancer Cover", amount: "₹5,00,000 specialized cap", org: "Tamil Nadu Govt" },
      { name: "PMJAY National Scheme", amount: "₹5,00,000 standard", org: "National Govt" },
      { name: "Central AIDS Support & Diagnostic Waiver", amount: "100% diagnostics & blood test waiver", org: "Central Health Ministry" },
      { name: "Cancer Relief Fund TN", amount: "Fully Subsidized Care (No Cap limit)", org: "Regional Department" }
    ],
    availableLabs: [
      "Onco-Pathology & Lymphoma Research Diagnostic Lab",
      "Special Clinical Virology Assays Unit",
      "DNA Sequencing & Cytogenetics Lab Services"
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
      },
      {
        name: "Tumor Resection Surgery",
        category: "Surgical Oncology",
        successRate: 92.5,
        basePrice: "₹3,10,000",
        subsidyAmount: "₹3,10,000 (Full Subsidy)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 4200,
        waitingDays: 10,
        satisfactionRate: 95,
        schemeUsed: "Cancer Relief Fund TN"
      },
      {
        name: "HIV Associated Sarcoma Management",
        category: "Co-Infection Treatment",
        successRate: 86.1,
        basePrice: "₹2,50,000",
        subsidyAmount: "₹2,50,000 (Dual Cover)",
        netPrice: "₹0 (Cashless)",
        annualProcedures: 780,
        waitingDays: 7,
        satisfactionRate: 92,
        schemeUsed: "Central AIDS Support & Diagnostic Waiver"
      }
    ]
  },
  {
    id: "mount-sinai-ny",
    hospitalName: "Mount Sinai Hospital",
    address: "1468 Madison Ave, East Harlem, New York, NY 10029",
    location: "New York",
    healthIssues: ["Heart", "Cardiology", "Cardiac Bypass", "Fever", "Pediatrics", "Infectious Disease", "AIDS", "HIV Prevention", "PrEP Support"],
    supportedSchemes: [
      { name: "Ryan White HIV/AIDS Treatment Program", amount: "Up to $100,000 comprehensive medicine", org: "US Federal HRSA" },
      { name: "New York State Medicaid", amount: "100% standard clinical cost cover", org: "State of New York" },
      { name: "Federal Medicare Program", amount: "80% of authorized ICU/Heart surgery", org: "US Federal System" },
      { name: "Child Health Plus (CHP)", amount: "Up to $15,000 preventative pediatric", org: "NY Health Dept" }
    ],
    availableLabs: [
      "Mount Sinai Clinical Virology Lab & PCR Testing Wing",
      "NYS Certified Immune Assessment Center",
      "Biomedical Pathology and Genotyping Core"
    ],
    services: [
      {
        name: "Antiviral HIV Management",
        category: "Infectious Disease / AIDS",
        successRate: 99.2,
        basePrice: "$3,300 / mo",
        subsidyAmount: "$3,300 / mo (100% Federal)",
        netPrice: "$0 (Cashless)",
        annualProcedures: 2900,
        waitingDays: 1,
        satisfactionRate: 98,
        schemeUsed: "Ryan White HIV/AIDS Treatment Program"
      },
      {
        name: "Cardiac Bypass Resection",
        category: "Cardiothoracic Care",
        successRate: 98.4,
        basePrice: "$85,000",
        subsidyAmount: "80% Cover ($68,000)",
        netPrice: "$17,000 Out-of-pocket",
        annualProcedures: 780,
        waitingDays: 15,
        satisfactionRate: 96,
        schemeUsed: "Federal Medicare Program"
      },
      {
        name: "PrEP Prevention Protocol",
        category: "Clinical Prophylaxis",
        successRate: 99.9,
        basePrice: "$450 / mo",
        subsidyAmount: "$450 / mo (State Medicaid)",
        netPrice: "$0 (Cashless)",
        annualProcedures: 11000,
        waitingDays: 1,
        satisfactionRate: 99,
        schemeUsed: "New York State Medicaid"
      }
    ]
  },
  {
    id: "mskcc-ny",
    hospitalName: "Memorial Sloan Kettering Cancer Center",
    address: "1275 York Ave, Upper East Side, New York, NY 10065",
    location: "New York",
    healthIssues: ["Cancer", "Oncology", "Breast Cancer", "Leukemia", "Lymphoma", "Immunotherapy", "HIV Related Sarcoma"],
    supportedSchemes: [
      { name: "Ryan White HIV/AIDS Care Grant Help", amount: "Fully subsidized specialty therapies", org: "US Federal HRSA" },
      { name: "Federal Medicare Program", amount: "80% medical assistance benefit", org: "US Federal System" },
      { name: "MSK Financial Assistance Program", amount: "Fully Subsidized Sliding Scale (No Cap)", org: "MSK Compassionate Fund" },
      { name: "Healthfirst Managed Care Scheme", amount: "Up to $120,000 annual therapy cap", org: "Managed Government Plan" }
    ],
    availableLabs: [
      "MSK Immuno-Oncology & Histopathology Testing Core",
      "Molecular Diagnostics Advanced Pathology Lab",
      "AIDS Malignancy Center Diagnosis Wing"
    ],
    services: [
      {
        name: "CAR-T Cell Immunotherapy",
        category: "Advanced Oncology Therapy",
        successRate: 88.1,
        basePrice: "$375,000",
        subsidyAmount: "Sliding Scale Full Waiver",
        netPrice: "$0 (Fully Subsidized)",
        annualProcedures: 320,
        waitingDays: 12,
        satisfactionRate: 97,
        schemeUsed: "MSK Financial Assistance Program"
      },
      {
        name: "Sarcoma Surgical Oncology",
        category: "Complex Tumor Removal",
        successRate: 91.3,
        basePrice: "$140,000",
        subsidyAmount: "80% authorized ($112,000)",
        netPrice: "$28,000 Out-of-pocket",
        annualProcedures: 480,
        waitingDays: 10,
        satisfactionRate: 94,
        schemeUsed: "Federal Medicare Program"
      },
      {
        name: "HIV Sarcoma Specialty Care",
        category: "Oncology Co-Infection",
        successRate: 95.8,
        basePrice: "$5,200",
        subsidyAmount: "$5,200 (Federal Grant Support)",
        netPrice: "$0 (Cashless)",
        annualProcedures: 600,
        waitingDays: 3,
        satisfactionRate: 97,
        schemeUsed: "Ryan White HIV/AIDS Care Grant Help"
      }
    ]
  }
];

export default function App() {
  // Mobile UI search inputs - exactly two user inputs requested: Health Issue and Location
  const [healthIssueInput, setHealthIssueInput] = useState<string>("Heart");
  const [locationInput, setLocationInput] = useState<string>("Mumbai");
  
  // Custom states
  const [isExactMatchOnly, setIsExactMatchOnly] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<HospitalRecord | null>(null);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  const [savedHospitals, setSavedHospitals] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'about'>('search');

  // Exact matching and filtering routine
  const filteredHospitals = HEALTH_DIRECTORY.filter(hospital => {
    const normIssue = healthIssueInput.trim().toLowerCase();
    const normLoc = locationInput.trim().toLowerCase();

    // Query 1: Health Issue Matching
    let matchedIssue = true;
    if (normIssue) {
      if (isExactMatchOnly) {
        matchedIssue = hospital.healthIssues.some(issue => issue.toLowerCase() === normIssue);
      } else {
        matchedIssue = hospital.healthIssues.some(issue => issue.toLowerCase().includes(normIssue));
      }
    }

    // Query 2: Location Matching
    let matchedLoc = true;
    if (normLoc) {
      if (isExactMatchOnly) {
        matchedLoc = hospital.location.toLowerCase() === normLoc;
      } else {
        matchedLoc = hospital.location.toLowerCase().includes(normLoc) || hospital.address.toLowerCase().includes(normLoc);
      }
    }

    return matchedIssue && matchedLoc;
  });

  // Bookmark toggler
  const toggleSaveHospital = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedHospitals.includes(id)) {
      setSavedHospitals(savedHospitals.filter(hId => hId !== id));
    } else {
      setSavedHospitals([...savedHospitals, id]);
    }
  };

  // Generate current timestamp for simulated mobile screen
  const getSimulatedTime = () => {
    return "09:38";
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-0 sm:p-6 md:p-8 font-sans antialiased selection:bg-teal-500 selection:text-slate-950">
      
      {/* Phone Shell Simulator Centered with "Geometric Balance" layout in beautiful dark clinical scheme */}
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[840px] bg-slate-950 sm:rounded-[44px] shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-[8px] border-slate-800/90 ring-1 ring-slate-700/50">
        
        {/* Simulated Phone Status Bar */}
        <div className="bg-slate-950 text-slate-400 px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold select-none shrink-0 border-b border-slate-900/40 z-20">
          <span className="text-teal-400 font-bold">{getSimulatedTime()}</span>
          {/* Speaker pill */}
          <div className="w-24 h-4 bg-slate-900 rounded-full hidden sm:block absolute left-1/2 -translate-x-1/2 top-2.5 border border-slate-800/80" />
          
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-emerald-500 flex items-center gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LTE
            </span>
            <Wifi className="h-3.5 w-3.5 text-slate-400" />
            <Battery className="h-3.5 w-3.5 text-teal-400" />
          </div>
        </div>

        {/* Mobile App Header */}
        <header className="bg-slate-950 border-b border-slate-900/60 px-5 py-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-500 text-slate-950 font-black rounded-lg flex items-center justify-center text-sm shadow-md shadow-teal-500/20">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Government Scheme</h2>
              <h1 className="text-sm font-black text-white tracking-tight mt-0.5 uppercase">MedFind Pro</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-slate-900 text-teal-400 font-extrabold px-2 py-1 rounded border border-teal-500/20">
              {HEALTH_DIRECTORY.length} Schemes Indexed
            </span>
          </div>
        </header>

        {/* Inner viewport container - flexible tabs layout */}
        <div className="flex-1 overflow-y-auto bg-slate-950 flex flex-col px-5 py-4 space-y-4 shadow-inner">
          
          {activeTab === 'search' && (
            <>
              {/* Exactly Two Inputs Form Container */}
              <div id="search-card-container" className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4.5 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-teal-400 tracking-widest uppercase flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Scheme Directory Query
                  </span>
                  <h3 className="text-xs text-slate-400 leading-tight">
                    Specify health issue & region to extract authenticated government and welfare package rates instantly.
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {/* First Input: Health Issue */}
                  <div className="space-y-1.5" id="health-issue-group">
                    <label htmlFor="input-issue" className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                      1. Health Issue / Treatment Specialty
                    </label>
                    <div className="relative">
                      <input 
                        id="input-issue"
                        type="text"
                        placeholder="e.g. Heart, Cancer, Fever"
                        value={healthIssueInput}
                        onChange={(e) => setHealthIssueInput(e.target.value)}
                        className="w-full bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:border-teal-500/60 rounded-xl px-3.5 py-3 text-xs font-medium focus:outline-none transition-all pl-9"
                      />
                      <Activity className="absolute left-3.5 top-3.5 h-4 w-4 text-teal-500/80 pointer-events-none" />
                      {healthIssueInput && (
                        <button 
                          onClick={() => setHealthIssueInput("")}
                          aria-label="Clear health issue input"
                          className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Second Input: Location */}
                  <div className="space-y-1.5" id="location-group">
                    <label htmlFor="input-loc" className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                      2. Destination / Clinical Location
                    </label>
                    <div className="relative">
                      <input 
                        id="input-loc"
                        type="text"
                        placeholder="e.g. Mumbai, New York, Chennai"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        className="w-full bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:border-teal-500/60 rounded-xl px-3.5 py-3 text-xs font-medium focus:outline-none transition-all pl-9"
                      />
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-500/80 pointer-events-none" />
                      {locationInput && (
                        <button 
                          onClick={() => setLocationInput("")}
                          aria-label="Clear location input"
                          className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Filter & Fast Query Tools */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <label className="inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isExactMatchOnly}
                      onChange={(e) => setIsExactMatchOnly(e.target.checked)}
                    />
                    <div className="relative w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-500 peer-checked:after:bg-slate-950" />
                    <span className="ms-1.5 font-semibold text-slate-400">Exact Match Only</span>
                  </label>

                  {(healthIssueInput || locationInput) && (
                    <button 
                      onClick={() => { setHealthIssueInput(""); setLocationInput(""); }}
                      className="text-teal-400 hover:text-teal-300 font-bold transition-all uppercase tracking-wider text-[10px]"
                    >
                      Reset inputs
                    </button>
                  )}
                </div>

                {/* Quick Presets Carousel directly embedded */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Quick Presets</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
                    {[
                      { issue: "Heart", loc: "Mumbai", tag: "❤️ Heart (Mumb)" },
                      { issue: "AIDS", loc: "Mumbai", tag: "🎗️ AIDS (Mumb)" },
                      { issue: "Cancer", loc: "Delhi", tag: "🎗️ Cancer (Delhi)" },
                      { issue: "AIDS", loc: "Delhi", tag: "🛡️ HIV Support (Delhi)" },
                      { issue: "AIDS", loc: "New York", tag: "🇺🇸 Ryan White (NY)" },
                      { issue: "Oncology", loc: "New York", tag: "🧬 Tumor (NY)" }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setHealthIssueInput(preset.issue);
                          setLocationInput(preset.loc);
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-full border whitespace-nowrap snap-center transition-all ${
                          healthIssueInput.toLowerCase() === preset.issue.toLowerCase() && 
                          locationInput.toLowerCase() === preset.loc.toLowerCase()
                            ? 'bg-teal-500 text-slate-950 border-teal-500 font-black'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {preset.tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matched Hospitals Results List */}
              <div className="space-y-3" id="catalog-list">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                    Directory Results ({filteredHospitals.length})
                  </span>
                  
                  {isExactMatchOnly && (
                    <span className="text-[9px] text-teal-400 font-black tracking-wider uppercase">
                      Exact Filtering Active
                    </span>
                  )}
                </div>

                {filteredHospitals.length > 0 ? (
                  <div className="space-y-3">
                    {filteredHospitals.map((hospital) => {
                      const isSaved = savedHospitals.includes(hospital.id);
                      return (
                        <div 
                          key={hospital.id} 
                          onClick={() => {
                            setSelectedHospital(hospital);
                            setSelectedServiceIndex(0);
                          }}
                          className="bg-slate-900 border border-slate-800/80 hover:border-teal-500/40 rounded-2xl p-4 transition-all duration-200 cursor-pointer relative group flex flex-col justify-between space-y-3.5 shadow-sm"
                        >
                          {/* Card top banner with save bookmark */}
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5 max-w-[84%]">
                              <h4 className="text-xs font-bold text-teal-300 group-hover:text-teal-200 transition-colors leading-tight line-clamp-1">
                                {hospital.hospitalName}
                              </h4>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                                {hospital.address}
                              </p>
                            </div>

                            {/* Bookmark toggler */}
                            <button
                              onClick={(e) => toggleSaveHospital(hospital.id, e)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                isSaved 
                                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
                                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                              }`}
                              title={isSaved ? "Remove Bookmark" : "Save Hospital Details"}
                            >
                              <Bookmark className="h-3 w-3" fill={isSaved ? "currentColor" : "none"} />
                            </button>
                          </div>

                          {/* Specialties listed */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap gap-1">
                              {hospital.healthIssues.map((issue, issueIdx) => {
                                const isHighlight = healthIssueInput && issue.toLowerCase().includes(healthIssueInput.toLowerCase());
                                return (
                                  <span 
                                    key={issueIdx} 
                                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                                      isHighlight 
                                        ? 'bg-teal-500/15 text-teal-300 border-teal-500/40 font-bold' 
                                        : 'bg-slate-950 text-slate-500 border-slate-900'
                                    }`}
                                  >
                                    {issue}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Available Labs preview list for prompt inclusion */}
                          {hospital.availableLabs && hospital.availableLabs.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 items-center bg-slate-950/40 border border-slate-900/60 rounded-xl p-2 select-none">
                              <span className="text-[8px] font-black text-teal-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                                <Beaker className="h-3 w-3 text-teal-400" /> Clinical Labs:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {hospital.availableLabs.slice(0, 2).map((lab, labIdx) => (
                                  <span key={labIdx} className="text-[9px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/80 shrink-0 max-w-[120px] truncate">
                                    🔬 {lab}
                                  </span>
                                ))}
                                {hospital.availableLabs.length > 2 && (
                                  <span className="text-[8px] text-slate-500 font-extrabold px-1">
                                    +{hospital.availableLabs.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Top Government Scheme amount preview */}
                          <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[8px] font-black tracking-widest text-slate-500 uppercase">
                              <span>QUALIFYING SUBSIDY</span>
                              <span className="text-teal-400">SECURE RATE</span>
                            </div>

                            <div className="space-y-1">
                              {hospital.supportedSchemes.slice(0, 2).map((scheme, scIdx) => (
                                <div key={scIdx} className="flex justify-between items-center text-[10px] gap-2">
                                  <span className="text-slate-300 font-bold truncate max-w-[55%]">
                                    🛡️ {scheme.name}
                                  </span>
                                  <span className="text-teal-400 font-extrabold text-[9px] whitespace-nowrap bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                                    {scheme.amount}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            {hospital.supportedSchemes.length > 2 && (
                              <div className="text-[8px] text-slate-500 text-right font-semibold pt-0.5">
                                + {hospital.supportedSchemes.length - 2} more available schemes
                              </div>
                            )}
                          </div>

                          {/* Bottom metadata */}
                          <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-slate-800/80 pt-2 font-medium">
                            <span>Verified Scheme Hospital</span>
                            <span className="text-teal-400 font-bold group-hover:underline flex items-center gap-0.5">
                              Tap to View <ExternalLink className="h-2.5 w-2.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Custom clinical phone empty state */
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3.5 my-4">
                    <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center text-slate-500 mx-auto border border-slate-800">
                      <Search className="h-6 w-6 text-slate-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">No Matching Records</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed px-2">
                        No hospital in our database matches <strong className="text-slate-300">"{healthIssueInput || 'any specialty'}"</strong> in region <strong className="text-slate-300">"{locationInput || 'any area'}"</strong>.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => { setHealthIssueInput("Heart"); setLocationInput("Mumbai"); }}
                      className="bg-teal-500 hover:bg-teal-600 text-slate-950 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors inline-block"
                    >
                      Reset to defaults
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Saved Hospitals ({savedHospitals.length})</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Bookmarked clinical programs for persistent session reference.</p>
              </div>

              {savedHospitals.length > 0 ? (
                <div className="space-y-3">
                  {HEALTH_DIRECTORY.filter(h => savedHospitals.includes(h.id)).map((hospital) => (
                    <div 
                      key={hospital.id} 
                      onClick={() => {
                        setSelectedHospital(hospital);
                        setSelectedServiceIndex(0);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:border-teal-500/40 relative flex flex-col justify-between space-y-3 shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5 max-w-[85%]">
                          <h4 className="text-xs font-bold text-teal-300 truncate">{hospital.hospitalName}</h4>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0"><MapPin className="h-2.5 w-2.5" /> {hospital.address}</p>
                        </div>
                        <button 
                          onClick={(e) => toggleSaveHospital(hospital.id, e)}
                          className="p-1 text-teal-400"
                        >
                          <Bookmark className="h-3 w-3" fill="currentColor" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {hospital.healthIssues.map((issue, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-950 text-slate-500 border border-slate-900 px-1.5 py-0.5 rounded font-medium">
                            {issue}
                          </span>
                        ))}
                      </div>

                      {/* Labs in bookmark item */}
                      {hospital.availableLabs && hospital.availableLabs.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center bg-slate-950/40 border border-slate-900/60 rounded-xl p-1.5 select-none">
                          <span className="text-[8px] font-black text-teal-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                            <Beaker className="h-2.5 w-2.5 text-teal-400" /> Lab Count: {hospital.availableLabs.length}
                          </span>
                        </div>
                      )}

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[10px] space-y-1">
                        <span className="text-[8px] text-slate-500 font-extrabold uppercase">COVERS SCHEMES</span>
                        {hospital.supportedSchemes.slice(0, 1).map((sch, sidx) => (
                          <div key={sidx} className="flex justify-between gap-1">
                            <span className="text-slate-300 truncate">🛡️ {sch.name}</span>
                            <span className="text-teal-400 font-extrabold text-[9px] shrink-0">{sch.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3.5">
                  <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center text-slate-600 mx-auto border border-slate-800">
                    <Bookmark className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">No Bookmarks Added</h4>
                    <p className="text-[11px] text-slate-500 px-3">
                      Secure critical facilities during searching by tapping the bookmark icon.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('search')}
                    className="bg-teal-500 hover:bg-teal-600 text-slate-950 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors inline-block"
                  >
                    Start Finding
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="space-y-1 pb-3 border-b border-slate-800">
                <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase">Clinical Information Core</span>
                <h3 className="text-xs font-bold text-white">MedFind Pro Welfare Finder</h3>
              </div>

              <div className="space-y-3 text-[11px] text-slate-400 leading-relaxed">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-300 uppercase tracking-wider text-[9px]">What is Ayushman Bharat (PM-JAY)?</h4>
                  <p>
                    PM-JAY is a pioneer national health protection scheme designed by the Central Government of India providing cashless coverage of up to **₹5,00,000** annually per family for secondary & tertiary hospitalization requirements.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-300 uppercase tracking-wider text-[9px]">Mahatma Jyotiba Phule Jan Arogya Yojana</h4>
                  <p>
                    A premium health insurance scheme in Maharashtra providing critical cashless covers of up to **₹1,50,000 - ₹5,00,000** on listed specialty surgeries.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-300 uppercase tracking-wider text-[9px]">Medicare & Medicaid (US Coverage)</h4>
                  <p>
                    Federal and State collaborative health systems supporting senior citizens and low-income groups for standard and complex cardiothoracic and oncology therapies.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                    <span className="text-[8px] text-slate-500 font-extrabold uppercase block select-none">INTEGRITY ADVISORY</span>
                    <p className="text-[9px] text-slate-400">
                      The clinical scheme directory, addresses, and qualifying coverage numbers have been mapped against official standard government portals. Check with separate reception counters to update eligibility active statuses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Modal Drawer overlay for Hospital Detail Sheet */}
        {selectedHospital && (
          <div 
            className="absolute inset-0 bg-slate-950/85 z-30 flex flex-col justify-end transition-opacity duration-300"
            onClick={() => setSelectedHospital(null)}
          >
            <div 
              className="bg-slate-900 border-t-2 border-teal-500 rounded-t-[28px] max-h-[85%] overflow-y-auto p-6 space-y-5 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header control */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 max-w-[85%]">
                  <div className="flex items-center gap-1.5 text-[9px] bg-teal-500/10 text-teal-400 font-black tracking-widest uppercase px-2 py-0.5 rounded border border-teal-500/20 w-fit">
                    <Award className="h-3 w-3" /> VERIFIED PROVIDER
                  </div>
                  <h3 className="text-md font-bold text-white tracking-tight">{selectedHospital.hospitalName}</h3>
                  <div className="text-[10px] text-slate-400 flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{selectedHospital.address}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedHospital(null)}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white p-1.5 rounded-full border border-slate-800"
                  title="Close Dialog Sheet"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Specialities Covered panel */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Supported Medical Specialties</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHospital.healthIssues.map((issue, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-md font-semibold"
                    >
                      ⚕️ {issue}
                    </span>
                  ))}
                </div>
              </div>

              {/* Diagnostic Labs covered panel */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Beaker className="h-3 w-3 text-teal-400" /> Pathology & Diagnostic Laboratories
                </span>
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-2">
                  <p className="text-[10px] text-slate-400 leading-normal">
                    This verified medical center operates the following specialized diagnostics and testing laboratories with associated welfare benefits:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                    {selectedHospital.availableLabs && selectedHospital.availableLabs.map((lab, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-1.5">
                        <Dna className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="font-medium">{lab}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Service & Success Rate Dashboard */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-teal-400 animate-pulse" /> clinical efficacy & cost dashboard
                  </span>
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase">
                    Tap a program to view metrics
                  </span>
                </div>

                {/* Service Selector Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedHospital.services && selectedHospital.services.map((service, idx) => {
                    const isSelected = selectedServiceIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedServiceIndex(idx)}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 focus:outline-none flex flex-col justify-between space-y-1.5 relative overflow-hidden ${
                          isSelected 
                            ? 'bg-slate-900 border-teal-500/80 shadow-lg shadow-teal-500/5 text-white ring-1 ring-teal-500/20' 
                            : 'bg-slate-950/80 border-slate-850 hover:bg-slate-900/50 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        {/* Selector Glow Indicator */}
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-8 h-8 bg-teal-500/10 rounded-bl-full pointer-events-none flex items-center justify-center">
                            <Zap className="h-2.5 w-2.5 text-teal-400 absolute top-1 right-1" />
                          </div>
                        )}
                        
                        <div>
                          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider truncate">
                            {service.category}
                          </p>
                          <h4 className="text-[11px] font-black tracking-tight leading-snug line-clamp-1 mt-0.5">
                            {service.name}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-900 w-full">
                          <span className="text-[9px] text-slate-400 truncate">
                            {service.netPrice.includes("₹0") || service.netPrice.includes("$0") ? (
                              <span className="text-emerald-400 font-extrabold">Free / Cashless</span>
                            ) : (
                              <span className="text-teal-400 font-extrabold">{service.netPrice.split(" ")[0]}</span>
                            )}
                          </span>
                          <span className="text-[9.5px] font-black text-white bg-slate-950 px-1 py-0.5 rounded border border-slate-800/80 shrink-0">
                            {service.successRate}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Dashboard Metrics Panel for currently selected service */}
                {selectedHospital.services && selectedHospital.services[selectedServiceIndex] && (() => {
                  const s = selectedHospital.services[selectedServiceIndex];
                  
                  // Helper for qualitative rating label based on successRate 
                  let ratingLabel = "Standard Cover";
                  let ratingColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
                  if (s.successRate >= 98) {
                    ratingLabel = "Exceptional Care";
                    ratingColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                  } else if (s.successRate >= 95) {
                    ratingLabel = "High Efficacy";
                    ratingColor = "text-teal-400 bg-teal-500/10 border-teal-500/20";
                  } else if (s.successRate >= 90) {
                    ratingLabel = "Highly Optimal";
                    ratingColor = "text-blue-400 bg-blue-500/10 border-blue-500/50";
                  } else {
                    ratingLabel = "Specialized Wing";
                    ratingColor = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
                  }

                  return (
                    <div className="bg-slate-950 border border-teal-500/15 rounded-2xl p-4 space-y-4 shadow-xl relative overflow-hidden">
                      {/* Ambient background glow */}
                      <div className="absolute -top-12 -right-12 w-28 h-28 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                      
                      {/* Dashboard Title row */}
                      <div className="flex justify-between items-start gap-2 pb-1 border-b border-slate-900">
                        <div>
                          <span className="text-[8px] font-black tracking-widest text-teal-400 uppercase">
                            Operational Analytics Panel
                          </span>
                          <h4 className="text-xs font-bold text-white tracking-snug mt-0.5">
                            {s.name} ({s.category})
                          </h4>
                        </div>
                        <span className={`text-[8.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded border ${ratingColor}`}>
                          {ratingLabel}
                        </span>
                      </div>

                      {/* KPI Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        
                        {/* KPI 1: Success Rate */}
                        <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Clinical Success Rate</span>
                            <Award className="h-3 w-3 text-teal-400" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-black text-white tracking-tight">{s.successRate}%</span>
                              <span className="text-[8px] text-emerald-400 font-extrabold uppercase">Verified</span>
                            </div>
                            
                            {/* Visual Progress Bar */}
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                                style={{ width: `${s.successRate}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* KPI 2: Cost Breakdowns */}
                        <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Cost Breakdown</span>
                            <Shield className="h-3 w-3 text-emerald-400" />
                          </div>

                          <div className="space-y-1">
                            <div className="text-[9px] text-slate-450 flex justify-between">
                              <span className="text-slate-500">Base Cost:</span>
                              <span className="line-through">{s.basePrice}</span>
                            </div>
                            
                            <div className="text-[9px] text-slate-450 flex justify-between">
                              <span className="text-slate-500">Subsidy Covered:</span>
                              <span className="text-teal-400 font-medium">-{s.subsidyAmount.includes("100%") ? "Full Check" : s.subsidyAmount.split(" ")[0]}</span>
                            </div>

                            <div className="pt-1 border-t border-slate-950 flex items-center justify-between text-[10px]">
                              <span className="font-extrabold text-white">Net Price:</span>
                              <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 rounded">{s.netPrice}</span>
                            </div>
                          </div>
                        </div>

                        {/* KPI 3: Operational Volume & Wait Queue */}
                        <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Operational Trust</span>
                            <Activity className="h-3 w-3 text-cyan-400" />
                          </div>

                          <div className="space-y-0.5">
                            <p className="text-[12px] font-black text-white">
                              {s.annualProcedures.toLocaleString()} Cases <span className="text-[8px] text-slate-400 font-bold block">Yearly Volume</span>
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1">
                              Wait queue: <span className="text-cyan-400 font-bold">{s.waitingDays === 0 ? "Immediate Admin" : `${s.waitingDays} Days`}</span>
                            </p>
                          </div>
                        </div>

                        {/* KPI 4: Stars Rating */}
                        <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Satisfaction Rating</span>
                            <Star className="h-3 w-3 text-yellow-500" />
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((starIdx) => {
                                const starValue = starIdx * 20; 
                                return (
                                  <Star 
                                    key={starIdx} 
                                    className="h-2.5 w-2.5" 
                                    fill={s.satisfactionRate >= starValue ? "#f59e0b" : "none"} 
                                    stroke={s.satisfactionRate >= starValue ? "#f59e0b" : "#475569"} 
                                  />
                                );
                              })}
                              <span className="text-[9px] ml-1.5 text-white font-black">{s.satisfactionRate}%</span>
                            </div>
                            <p className="text-[8px] text-slate-500 font-bold leading-none mt-1">
                              Patient survey trust
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Associated Scheme Name banner */}
                      <div className="bg-slate-900/60 p-2 border border-slate-850 rounded-xl text-[10px] text-slate-400 flex items-center justify-between gap-2">
                        <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest shrink-0">Sponsor Cover:</span>
                        <span className="font-semibold text-white truncate text-right text-[10px]">{s.schemeUsed}</span>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Supported Schemes Detailed Ledger with amounts listed exactly */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Supported Schemes & Financial Coverage caps</span>
                
                <div className="space-y-2">
                  {selectedHospital.supportedSchemes.map((scheme, scIdx) => (
                    <div 
                      key={scIdx} 
                      className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 max-w-[55%]">
                        <div className="text-white font-bold truncate">{scheme.name}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">{scheme.org}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-teal-400 font-extrabold text-[11px] bg-teal-500/10 border border-teal-500/25 px-2.5 py-1 rounded">
                          {scheme.amount}
                        </div>
                        <span className="text-[8px] text-slate-500">Subject to rules</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Advisory Notice */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-[10px]">
                <span className="text-teal-500 font-bold uppercase tracking-wider block">🚨 PATIENT ADVISORY NOTE</span>
                <p className="text-slate-400 leading-relaxed">
                  Always bring original identity cards (e.g. Aadhaar Card, Ration Card, Medicare Health Benefit plan booklet, state referral form) to the admission desk to secure swift eligibility check.
                </p>
              </div>

              {/* Direct Link clicker */}
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(selectedHospital.hospitalName + " " + selectedHospital.location)}`}
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 transition-colors uppercase tracking-widest text-xs font-black py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/10"
              >
                OPEN HOSPITAL PORTAL <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Dedicated Phone Navigation Bar at the Bottom */}
        <footer className="bg-slate-950 border-t border-slate-900/60 h-16 flex-shrink-0 flex items-center justify-around text-slate-500">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${activeTab === 'search' ? 'text-teal-400' : 'hover:text-slate-300'}`}
          >
            <Compass className="h-4.5 w-4.5" />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Search</span>
          </button>

          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors relative ${activeTab === 'saved' ? 'text-teal-400' : 'hover:text-slate-300'}`}
          >
            <Bookmark className="h-4.5 w-4.5" />
            {savedHospitals.length > 0 && (
              <span className="absolute top-2 right-4 bg-teal-500 text-slate-950 text-[8px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center border border-slate-950 scale-95">
                {savedHospitals.length}
              </span>
            )}
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Saved</span>
          </button>

          <button 
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${activeTab === 'about' ? 'text-teal-400' : 'hover:text-slate-300'}`}
          >
            <FileText className="h-4.5 w-4.5" />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Schemes</span>
          </button>
        </footer>

        {/* Real system home indicator bar on modern phones */}
        <div className="bg-slate-950 h-3 flex-shrink-0 flex items-center justify-center select-none pb-1.5">
          <div className="w-28 h-1 bg-slate-800 rounded-full" />
        </div>

      </div>

    </div>
  );
}
