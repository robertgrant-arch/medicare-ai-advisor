// Additive types for coverage workflow (PR 1, gated by NEXT_PUBLIC_COVERAGE_CHIPS)

export type CoverageConfidence =
  | 'in_network'
  | 'likely'
  | 'needs_verification'
  | 'not_found';

export interface Provider {
  id: string;
  name: string;
  specialty?: string;
  facility?: string;
  address?: string;
  distanceMiles?: number;
  npi?: string;
}

export interface Medication {
  id: string;
  name: string;
  rxcui?: string;
  strength?: string;
  form?: string;
  frequency?: string;
  pharmacy?: string;
  isGeneric?: boolean;
}

export interface CoveragePreferences {
  doctors: Provider[];
  medications: Medication[];
  pharmacy?: string;
  prioritizes?: Array<'doctors' | 'medications' | 'cost' | 'extras'>;
}

export interface CoverageResult {
  planId: string;
  providerMatches: Array<{ providerId: string; confidence: CoverageConfidence; note?: string }>;
  medicationMatches: Array<{ medicationId: string; tier?: number; confidence: CoverageConfidence; note?: string }>;
}

export type CoverageChoice = 'doctors' | 'medications' | 'both' | 'plans_first';
