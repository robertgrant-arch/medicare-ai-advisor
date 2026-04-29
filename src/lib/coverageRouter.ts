// Coverage workflow router (PR 1, additive). Pure functions, no side effects.
// Determines the next conversational step after a ZIP is captured.

import type { CoverageChoice, CoveragePreferences } from '@/types/coverage';

export interface CoverageStepHint {
  step: 'choose' | 'doctors' | 'medications' | 'budget' | 'plans';
  prompt: string;
  chips: string[];
}

export const COVERAGE_FLAG_ENV = 'NEXT_PUBLIC_COVERAGE_CHIPS';

export function isCoverageEnabled(): boolean {
  if (typeof process === 'undefined') return false;
  return process.env.NEXT_PUBLIC_COVERAGE_CHIPS === '1';
}

export function nextStepAfterZip(): CoverageStepHint {
  return {
    step: 'choose',
    prompt:
      "Got it. What do you want to check first? I can verify your doctors are in-network, check that your prescriptions are covered, do both, or just show plans first.",
    chips: ['My doctors', 'My prescriptions', 'Both', 'Just show plans first'],
  };
}

export function parseCoverageChoice(text: string): CoverageChoice | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  if (/(^|\b)(my )?doctors?\b/.test(t)) return 'doctors';
  if (/(^|\b)(my )?(prescriptions?|medications?|drugs?|rx)\b/.test(t)) return 'medications';
  if (/\bboth\b/.test(t)) return 'both';
  if (/plans?\s*first|just\s*show\s*plans?/.test(t)) return 'plans_first';
  return null;
}

export function nextStepForChoice(choice: CoverageChoice): CoverageStepHint {
  switch (choice) {
    case 'doctors':
      return {
        step: 'doctors',
        prompt:
          "Great. Tell me the name of a doctor you want to keep, and I'll find them. You can add more after each one.",
        chips: ['Add another doctor', "I'm done with doctors", 'Skip this'],
      };
    case 'medications':
      return {
        step: 'medications',
        prompt:
          "Got it. What's the name of a prescription you take? I'll look it up and confirm strength and form.",
        chips: ['Add another prescription', "I'm done with prescriptions", 'Skip this'],
      };
    case 'both':
      return {
        step: 'doctors',
        prompt:
          "Perfect. Let's start with your doctors, then we'll do prescriptions. What's the name of a doctor you want to keep?",
        chips: ['Add another doctor', "Done with doctors, do prescriptions", 'Skip doctors'],
      };
    case 'plans_first':
      return {
        step: 'plans',
        prompt:
          "Sure. I'll show plans available in your ZIP first. We can verify doctors and prescriptions on any plan you like.",
        chips: ['Show plans', 'Actually, check my doctors first', 'Check my prescriptions first'],
      };
  }
}

export function summarizePreferences(p: Partial<CoveragePreferences>): string {
  const parts: string[] = [];
  if (p.doctors?.length) parts.push(`${p.doctors.length} doctor(s)`);
  if (p.medications?.length) parts.push(`${p.medications.length} prescription(s)`);
  if (p.pharmacy) parts.push(`pharmacy: ${p.pharmacy}`);
  return parts.join(', ');
}
