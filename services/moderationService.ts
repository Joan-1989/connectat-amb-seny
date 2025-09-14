// services/moderationService.ts
import type { ChatMessage } from '../types';

/**
 * Regles senzilles de moderació al client.
 * (Recomanat reforçar al backend si més endavant poses un proxy.)
 */
const PROFANITY = [
  'fuck','shit','bitch','cunt','asshole','bastard',
  'gilipolles','imbècil','idiota','cabron','merda'
].map(w => w.toLowerCase());

const SELF_HARM = [
  'vull morir','em vull morir','suïcidar','suicidar','em faré mal',
  'autolesió','autolesionar','matar-me','treure’m la vida'
];

const SEXUAL_MINORS = [
  'sexe amb menor','nuesa menor','pornografia infantil'
];

const VIOLENCE = ['matar','violència extrema','amenacar','amenaçar','violació'];

const PII_REGEX = [
  /\b[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g,             // email
  /\b(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}\b/g, // telèfon
  /\b\d{1,4}\s+\w+(\s+\w+){1,3}\b/g                    // adreça simple (heurística)
];

export type ModerationResult = {
  allowed: boolean;
  categories: string[];
  cleaned: string;
  message?: string;  // missatge d’error per mostrar a UI
};

export function maskPII(text: string): string {
  let out = text;
  for (const rx of PII_REGEX) {
    out = out.replace(rx, '[info-privada]');
  }
  return out;
}

export function moderateText(input: string): ModerationResult {
  const text = input.trim();
  if (!text) return { allowed: true, categories: [], cleaned: text };

  const lower = text.toLowerCase();
  const categories: string[] = [];

  if (PROFANITY.some(w => lower.includes(w))) categories.push('insults');
  if (SELF_HARM.some(w => lower.includes(w))) categories.push('autolesió');
  if (SEXUAL_MINORS.some(w => lower.includes(w))) categories.push('sexual-menors');
  if (VIOLENCE.some(w => lower.includes(w))) categories.push('violència');

  if (categories.includes('sexual-menors')) {
    return {
      allowed: false,
      categories,
      cleaned: '',
      message: 'Aquest contingut no es pot tractar. Si necessites ajuda, parla amb un adult de confiança o un servei professional.'
    };
  }
  if (categories.includes('autolesió')) {
    return {
      allowed: false,
      categories,
      cleaned: '',
      message: 'Sento que t’estiguis sentint així. Si tú o algú està en perill, truca al 112. També pots parlar amb un adult de confiança o un professional.'
    };
  }

  return { allowed: true, categories, cleaned: maskPII(text) };
}

export function moderateHistory(history: ChatMessage[]): ChatMessage[] {
  return history.map(m => ({
    role: m.role,
    parts: [{ text: maskPII(m.parts?.[0]?.text ?? '') }]
  }));
}
