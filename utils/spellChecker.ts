
/**
 * Tibetan Orthographic Spell Checker
 * Validates syllables (tsheg-bar) based on classical Sum-cu-pa (སུམ་ཅུ་པ) 
 * and Rtags-kyi-'jug-pa (རྟགས་ཀྱི་འཇུག་པ) rules.
 */

const PREFIXES = ['ག', 'ད', 'བ', 'མ', 'འ'];
const SUFFIXES = ['ག', 'ང', 'ད', 'ན', 'བ', 'མ', 'འ', 'ར', 'ལ', 'ས'];
const VOWELS = ['ི', 'ུ', 'ེ', 'ོ']; 

// Subjoined range in Unicode (0x0F90 to 0x0FBC)
const IS_SUBJOINED = (char: string) => {
  const code = char.charCodeAt(0);
  return code >= 0x0F90 && code <= 0x0FBC;
};

// Particles that are often joined to the preceding syllable
const JOINED_PARTICLES = [
  'འི་', 'འོ་', 'འང་', 'འམ་', 'འས་', 'འི', 'འོ'
];

/**
 * Prefix compatibility (Sum-cu-pa rules)
 * Maps which prefixes can be used with which root consonants.
 */
const PREFIX_COMPATIBILITY: Record<string, string[]> = {
  'ག': ['ཅ', 'ཉ', 'ཏ', 'ད', 'ན', 'ཙ', 'ཞ', 'ཟ', 'ཡ', 'ཤ', 'ས'],
  'ད': ['ཀ', 'ག', 'ང', 'པ', 'བ', 'མ'],
  'བ': ['ཀ', 'ག', 'ཅ', 'ཏ', 'ད', 'ཙ', 'ཞ', 'ཟ', 'ཤ', 'ས', 'ར', 'ལ', 'ས'], // Allows r, l, s for stacks
  'མ': ['ཁ', 'ག', 'ང', 'ཆ', 'ཇ', 'ཉ', 'ཐ', 'ད', 'ན', 'ཚ', 'ཛ'],
  'འ': ['ཁ', 'ག', 'ཆ', 'ཇ', 'ཐ', 'ད', 'ཕ', 'བ', 'ཚ', 'ཛ'],
};

/**
 * Yang-'jug (Post-suffixes) rules
 * Only 's' and 'd' (archaic) are allowed as post-suffixes.
 */
const YANG_JUG_ALLOWED: Record<string, string[]> = {
  'ས': ['ག', 'ང', 'བ', 'མ'],
  'ད': ['ན', 'ར', 'ལ'] // Archaic da-drag
};

export interface SpellResult {
  isValid: boolean;
  errors: string[];
  invalidSyllables: string[];
}

export function checkTibetanSpelling(text: string): SpellResult {
  if (!text) return { isValid: true, errors: [], invalidSyllables: [] };

  // Split by common delimiters: tsheg (་), shad (།), or whitespace
  const syllables = text.split(/[་།\s\n\t]+/).filter(s => s.length > 0);
  const invalidSyllables: string[] = [];
  const errors: string[] = [];

  for (const syl of syllables) {
    const errorMsg = validateSyllable(syl);
    if (errorMsg) {
      invalidSyllables.push(syl);
      if (!errors.includes(errorMsg)) errors.push(errorMsg);
    }
  }

  return {
    isValid: invalidSyllables.length === 0,
    errors,
    invalidSyllables
  };
}

/**
 * Core validation logic for a single Tibetan syllable.
 */
function validateSyllable(syl: string): string | null {
  // 1. Skip if purely non-Tibetan
  if (!/[\u0F00-\u0FFF]/.test(syl)) return null;

  // 2. Handle joined particles (e.g. མིའི་)
  for (const p of JOINED_PARTICLES) {
    if (syl.endsWith(p)) {
      const stem = syl.slice(0, -p.length);
      if (stem.length === 0) return null; // Particle alone is valid contextually
      return validateSyllable(stem);
    }
  }

  const chars = Array.from(syl);

  // 3. Vowel Count Validation
  const vowelCount = chars.filter(c => VOWELS.includes(c)).length;
  if (vowelCount > 1) return "དབྱངས་གཅིག་ལས་མང་བ་བརྩེགས་མི་ཆོག";

  // 4. Structural Parsing
  // We try to identify the root by looking for a stack or a vowel.
  const components = parseStructure(chars);
  if (!components) return "ཡི་གེའི་སྒྲོམ་གཞི་མ་དག་པ།";

  const { prefix, rootHead, suffixes } = components;

  // 5. Check if it's a Sanskrit stack (Mantras often violate Tibetan rules)
  const isSanskrit = rootHead && rootHead.length > 2; // Heuristic: complex stacks
  if (isSanskrit) return null; // Allow Sanskrit without further checking

  // 6. Prefix Validation
  if (prefix) {
    if (!PREFIXES.includes(prefix)) return `སྔོན་འཇུག་'${prefix}'མ་དག་པ།`;
    const allowedRoots = PREFIX_COMPATIBILITY[prefix];
    if (allowedRoots && !allowedRoots.includes(rootHead[0])) {
      return `སྔོན་འཇུག་'${prefix}'དང་མིང་གཞི་'${rootHead[0]}'མི་མཐུན།`;
    }
  }

  // 7. Suffix Validation
  if (suffixes.length > 0) {
    const mainSuffix = suffixes[0];
    if (!SUFFIXES.includes(mainSuffix)) return `རྗེས་འཇུག་'${mainSuffix}'མ་དག་པ།`;

    // 8. Post-suffix Validation
    if (suffixes.length > 1) {
      const yangJug = suffixes[1];
      const allowedStems = YANG_JUG_ALLOWED[yangJug];
      if (!allowedStems || !allowedStems.includes(mainSuffix)) {
        return `ཡང་འཇུག་'${yangJug}'དེ་རྗེས་འཇུག་'${mainSuffix}'ཀྱི་རྗེས་སུ་སྦྱོར་མི་ཆོག`;
      }
    }
    if (suffixes.length > 2) return "རྗེས་འཇུག་གསུམ་པ་མི་ཆོག";
  }

  return null;
}

interface ParsedSyllable {
  prefix: string | null;
  rootHead: string[];
  suffixes: string[];
}

/**
 * Intelligent parser that identifies the Ming-gzhi (root) of a syllable.
 */
function parseStructure(chars: string[]): ParsedSyllable | null {
  // Identify the core of the syllable: the root head is either:
  // - The consonant before a vowel
  // - The consonant that has subjoineds
  // - The "main" consonant in a plain sequence

  let rootHeadIdx = -1;
  for (let i = 0; i < chars.length; i++) {
    const next = chars[i + 1];
    if (VOWELS.includes(chars[i])) {
      // Current is a vowel, root head must have been before it
      // However, rootHeadIdx might already be set if there were subjoineds
      if (rootHeadIdx === -1) rootHeadIdx = i - 1;
      break;
    }
    if (next && IS_SUBJOINED(next)) {
      // Next is subjoined, current is the head of the stack
      rootHeadIdx = i;
      break;
    }
  }

  // If no vowel or subjoined, root head is positionally determined
  if (rootHeadIdx === -1) {
    const len = chars.length;
    if (len === 1) return { prefix: null, rootHead: [chars[0]], suffixes: [] };
    if (len === 2) {
      // 2 chars: Root + Suffix (e.g. གང) or Prefix + Root (e.g. དཀ)
      // Usually Root+Suffix is safer to assume unless the first char is a strict prefix.
      return { prefix: null, rootHead: [chars[0]], suffixes: [chars[1]] };
    }
    if (len === 3) {
      // 3 chars: Prefix + Root + Suffix (e.g. བཀའ) or Root + Suffix1 + Suffix2 (e.g. གངས་)
      if (PREFIXES.includes(chars[0])) return { prefix: chars[0], rootHead: [chars[1]], suffixes: [chars[2]] };
      return { prefix: null, rootHead: [chars[0]], suffixes: [chars[1], chars[2]] };
    }
    if (len === 4) {
      // 4 chars: Prefix + Root + Suffix1 + Suffix2 (e.g. བསྟནས་)
      return { prefix: chars[0], rootHead: [chars[1]], suffixes: [chars[2], chars[3]] };
    }
    return null;
  }

  // Extract components based on identified rootHeadIdx
  const prefix = rootHeadIdx > 0 ? chars[rootHeadIdx - 1] : null;
  const rootStack = [chars[rootHeadIdx]];
  let k = rootHeadIdx + 1;
  while (k < chars.length && IS_SUBJOINED(chars[k])) {
    rootStack.push(chars[k]);
    k++;
  }
  if (k < chars.length && VOWELS.includes(chars[k])) {
    k++;
  }
  const suffixes = chars.slice(k);

  return { prefix, rootHead: rootStack, suffixes };
}
