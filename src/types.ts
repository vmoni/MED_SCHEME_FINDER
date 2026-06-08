export interface SchemeInfo {
  name: string;
  amount: string;
  org: string;
}

export interface ServiceMetric {
  name: string;
  category: string;
  successRate: number;
  basePrice: string;
  subsidyAmount: string;
  netPrice: string;
  annualProcedures: number;
  waitingDays: number;
  satisfactionRate: number;
  schemeUsed: string;
}

export interface HospitalRecord {
  id: string;
  hospitalName: string;
  address: string;
  location: string;
  healthIssues: string[];
  supportedSchemes: SchemeInfo[];
  availableLabs: string[];
  services: ServiceMetric[];
  contact?: string;
  accreditation?: string;
}

export interface DemographicProfile {
  age: string;
  gender: string;
  income: string;
  state: string;
  bplStatus: boolean;
  disabilityStatus: boolean;
}

export interface IntentExtraction {
  disease: string;
  location: string;
  treatmentType: string;
  financialRequirement: string;
  searchQuery: string;
  isOfflineFallback?: boolean;
}

export interface RagSchemeResults {
  success: boolean;
  answer: string;
  sources: Array<{ title: string; url: string }>;
  confidence: string;
  isOfflineFallback?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Array<{ title: string; url: string }>;
  isOfflineFallback?: boolean;
}
