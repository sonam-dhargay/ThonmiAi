
import { ewtsToUnicode } from './wylie';

/**
 * Tibetan Orthographic Spell Checker
 * Validates syllables (tsheg-bar) based on classical Sum-cu-pa (སུམ་ཅུ་པ) 
 * and Rtags-kyi-'jug-pa (རྟགས་ཀྱི་འཇུག་པ) rules.
 */

const PREFIXES = ['ག', 'ད', 'བ', 'མ', 'འ'];
const SUFFIXES = ['ག', 'ང', 'ད', 'ན', 'བ', 'མ', 'འ', 'ར', 'ལ', 'ས'];
const VOWELS = ['ི', 'ུ', 'ེ', 'ོ']; 

const IS_SUBJOINED = (char: string) => {
  const code = char.charCodeAt(0);
  return code >= 0x0F90 && code <= 0x0FBC;
};

const JOINED_PARTICLES = [
  'འི་', 'འོ་', 'འང་', 'འམ་', 'འས་', 'འི', 'འོ'
];

const PREFIX_COMPATIBILITY: Record<string, string[]> = {
  'ག': ['ཅ', 'ཉ', 'ཏ', 'ད', 'ན', 'ཙ', 'ཞ', 'ཟ', 'ཡ', 'ཤ', 'ས'],
  'ད': ['ཀ', 'ག', 'ང', 'པ', 'བ', 'མ'],
  'བ': ['ཀ', 'ག', 'ཅ', 'ཏ', 'ད', 'ཙ', 'ཞ', 'ཟ', 'ཤ', 'ས', 'ར', 'ལ', 'ས'],
  'མ': ['ཁ', 'ག', 'ང', 'ཆ', 'ཇ', 'ཉ', 'ཐ', 'ད', 'ན', 'ཚ', 'ཛ'],
  'འ': ['ཁ', 'ག', 'ཆ', 'ཇ', 'ཐ', 'ད', 'ཕ', 'བ', 'ཚ', 'ཛ'],
};

const YANG_JUG_ALLOWED: Record<string, string[]> = {
  'ས': ['ག', 'ང', 'བ', 'མ'],
  'ད': ['ན', 'ར', 'ལ']
};

export interface SpellResult {
  isValid: boolean;
  errors: string[];
  invalidSyllables: string[];
  suggestions: Record<string, string[]>;
}

export function checkTibetanSpelling(text: string): SpellResult {
  if (!text) return { isValid: true, errors: [], invalidSyllables: [], suggestions: {} };

  const syllables = text.split(/[་།\s\n\t]+/).filter(s => s.length > 0);
  const invalidSyllables: string[] = [];
  const errors: string[] = [];
  const suggestions: Record<string, string[]> = {};

  for (const syl of syllables) {
    let targetSyl = syl;
    const isEwts = /[a-zA-Z]/.test(syl);
    
    if (isEwts) {
      targetSyl = ewtsToUnicode(syl);
      if (targetSyl.endsWith('་')) {
        targetSyl = targetSyl.slice(0, -1);
      }
    }

    const check = validateSyllableWithSuggestions(targetSyl);
    if (check.error) {
      invalidSyllables.push(syl);
      if (!errors.includes(check.error)) errors.push(check.error);
      if (check.suggestions.length > 0) {
        suggestions[syl] = check.suggestions;
      }
    }
  }

  return {
    isValid: invalidSyllables.length === 0,
    errors,
    invalidSyllables,
    suggestions
  };
}

function validateSyllableWithSuggestions(syl: string): { error: string | null; suggestions: string[] } {
  if (!/[\u0F00-\u0FFF]/.test(syl)) return { error: null, suggestions: [] };

  for (const p of JOINED_PARTICLES) {
    if (syl.endsWith(p)) {
      const stem = syl.slice(0, -p.length);
      if (stem.length === 0) return { error: null, suggestions: [] };
      return validateSyllableWithSuggestions(stem);
    }
  }

  const chars = Array.from(syl);
  const vowelCount = chars.filter(c => VOWELS.includes(c)).length;
  if (vowelCount > 1) return { error: "དབྱངས་གཅིག་ལས་མང་བ་བརྩེགས་མི་ཆོག", suggestions: [] };

  const components = parseStructure(chars);
  if (!components) return { error: "ཡི་གེའི་སྒྲོམ་གཞི་མ་དག་པ།", suggestions: [] };

  const { prefix, rootHead, suffixes } = components;
  const isSanskrit = rootHead && rootHead.length > 2;
  if (isSanskrit) return { error: null, suggestions: [] };

  if (prefix) {
    if (!PREFIXES.includes(prefix)) {
      return { 
        error: `སྔོན་འཇུག་'${prefix}'མ་དག་པ།`, 
        suggestions: [syl.substring(1)] // Suggest removing the invalid prefix
      };
    }
    
    const allowedRoots = PREFIX_COMPATIBILITY[prefix];
    if (allowedRoots && !allowedRoots.includes(rootHead[0])) {
      const alternativePrefixes = Object.entries(PREFIX_COMPATIBILITY)
        .filter(([_, roots]) => roots.includes(rootHead[0]))
        .map(([p, _]) => p);
      
      const suggestedSyllables = alternativePrefixes.map(p => {
        const remaining = Array.from(syl);
        remaining[0] = p;
        return remaining.join('');
      });
      
      return { 
        error: `སྔོན་འཇུག་'${prefix}'དང་མིང་གཞི་'${rootHead[0]}'མི་མཐུན།`, 
        suggestions: [...suggestedSyllables, syl.substring(1)]
      };
    }
  }

  if (suffixes.length > 0) {
    const mainSuffix = suffixes[0];
    if (!SUFFIXES.includes(mainSuffix)) {
      return { error: `རྗེས་འཇུག་'${mainSuffix}'མ་དག་པ།`, suggestions: [] };
    }

    if (suffixes.length > 1) {
      const yangJug = suffixes[1];
      const allowedStems = YANG_JUG_ALLOWED[yangJug];
      if (!allowedStems || !allowedStems.includes(mainSuffix)) {
        return { 
          error: `ཡང་འཇུག་'${yangJug}'དེ་རྗེས་འཇུག་'${mainSuffix}'ཀྱི་རྗེས་སུ་སྦྱོར་མི་ཆོག`, 
          suggestions: [syl.slice(0, -1)] // Suggest removing the invalid post-suffix
        };
      }
    }
    if (suffixes.length > 2) return { error: "རྗེས་འཇུག་གསུམ་པ་མི་ཆོག", suggestions: [syl.slice(0, 2)] };
  }

  return { error: null, suggestions: [] };
}

interface ParsedSyllable {
  prefix: string | null;
  rootHead: string[];
  suffixes: string[];
}

function parseStructure(chars: string[]): ParsedSyllable | null {
  let rootHeadIdx = -1;
  for (let i = 0; i < chars.length; i++) {
    const next = chars[i + 1];
    if (VOWELS.includes(chars[i])) {
      if (rootHeadIdx === -1) rootHeadIdx = i - 1;
      break;
    }
    if (next && IS_SUBJOINED(next)) {
      rootHeadIdx = i;
      break;
    }
  }

  if (rootHeadIdx === -1) {
    const len = chars.length;
    if (len === 1) return { prefix: null, rootHead: [chars[0]], suffixes: [] };
    if (len === 2) {
      return { prefix: null, rootHead: [chars[0]], suffixes: [chars[1]] };
    }
    if (len === 3) {
      if (PREFIXES.includes(chars[0])) return { prefix: chars[0], rootHead: [chars[1]], suffixes: [chars[2]] };
      return { prefix: null, rootHead: [chars[0]], suffixes: [chars[1], chars[2]] };
    }
    if (len === 4) {
      return { prefix: chars[0], rootHead: [chars[1]], suffixes: [chars[2], chars[3]] };
    }
    return null;
  }

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
