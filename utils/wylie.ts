
/**
 * EWTS (Extended Wylie Transliteration Scheme) to Unicode Tibetan Converter
 * Optimized for complex stacks and prefix-root-suffix identification.
 */

const CONSONANTS: Record<string, string> = {
  'k': '\u0F40', 'kh': '\u0F41', 'g': '\u0F42', 'ng': '\u0F44',
  'c': '\u0F45', 'ch': '\u0F46', 'j': '\u0F47', 'ny': '\u0F49',
  't': '\u0F4F', 'th': '\u0F50', 'd': '\u0F51', 'n': '\u0F53',
  'p': '\u0F54', 'ph': '\u0F55', 'b': '\u0F56', 'm': '\u0F58',
  'ts': '\u0F59', 'tsh': '\u0F5A', 'dz': '\u0F5B', 'w': '\u0F5D',
  'zh': '\u0F5E', 'z': '\u0F5F', "'": '\u0F60', 'y': '\u0F61',
  'r': '\u0F62', 'l': '\u0F63', 'sh': '\u0F64', 's': '\u0F66',
  'h': '\u0F67',
  // Sanskrit / Fixed
  'T': '\u0F4A', 'Th': '\u0F4B', 'D': '\u0F4C', 'N': '\u0F4E', 'Sh': '\u0F65',
  'D+h': '\u0F4D', 'g+h': '\u0F43', 'd+h': '\u0F52', 'b+h': '\u0F57', 'dz+h': '\u0F5C'
};

const SUBJOINED: Record<string, string> = {
  'k': '\u0F90', 'kh': '\u0F91', 'g': '\u0F92', 'ng': '\u0F94',
  'c': '\u0F95', 'ch': '\u0F96', 'j': '\u0F97', 'ny': '\u0F99',
  't': '\u0F9F', 'th': '\u0FA0', 'd': '\u0FA1', 'n': '\u0FA3',
  'p': '\u0FA4', 'ph': '\u0FA5', 'b': '\u0FA6', 'm': '\u0FA8',
  'ts': '\u0FA9', 'tsh': '\u0FAA', 'dz': '\u0FAB', 'w': '\u0FAD',
  'zh': '\u0FAE', 'z': '\u0FAF', "'": '\u0FB0', 'y': '\u0FB1',
  'r': '\u0FB2', 'l': '\u0FB3', 'sh': '\u0FB4', 's': '\u0FB6',
  'h': '\u0FB7',
  'T': '\u0F9A', 'Th': '\u0F9B', 'D': '\u0F9C', 'N': '\u0F9E', 'Sh': '\u0FA5',
  'W': '\u0FAD', 'Y': '\u0FB1', 'R': '\u0FB2'
};

const VOWELS: Record<string, string> = {
  'a': '', 'i': '\u0F72', 'u': '\u0F74', 'e': '\u0F7A', 'o': '\u0F7C',
  'A': '\u0F71', 'I': '\u0F71\u0F72', 'U': '\u0F71\u0F74'
};

const SPECIAL: Record<string, string> = {
  'M': '\u0F7E', 'H': '\u0F7F', '~': '\u0F83', 'R': '\u0F6A'
};

const PUNCT: Record<string, string> = {
  ' ': '\u0F0B', '.': '\u0F0B', '/': '\u0F0D', '//': '\u0F0E', ';': '\u0F0B',
  ':': '\u0F14', '*': '\u0F11', '\n': '\n'
};

const PREFIXES = ['g', 'd', 'b', 'm', "'"];
const SUPERSCRIPTS = ['r', 'l', 's'];
const SUBSCRIPTS = ['y', 'r', 'l', 'w'];

function tokenize(text: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const keys = [
    ...Object.keys(CONSONANTS), ...Object.keys(VOWELS), ...Object.keys(SPECIAL),
    ...Object.keys(PUNCT), '//', '+', '.', '\\', '[', ']'
  ].sort((a, b) => b.length - a.length);

  while (i < text.length) {
    let match = "";
    for (const k of keys) { if (text.startsWith(k, i)) { match = k; break; } }
    if (match) { tokens.push(match); i += match.length; }
    else { tokens.push(text[i]); i++; }
  }
  return tokens;
}

export function ewtsToUnicode(text: string): string {
  if (!text) return "";
  const tokens = tokenize(text);
  let result = "";
  let i = 0;

  while (i < tokens.length) {
    let token = tokens[i];

    if (PUNCT[token]) {
      result += PUNCT[token];
      i++;
      continue;
    }

    if (VOWELS[token] !== undefined) {
      result += '\u0F68' + VOWELS[token];
      i++;
      continue;
    }

    const cluster: string[] = [];
    let vowel: string | null = null;
    
    while (i < tokens.length) {
      const t = tokens[i];
      if (VOWELS[t] !== undefined) {
        vowel = VOWELS[t];
        i++;
        break;
      }
      if (CONSONANTS[t] || SPECIAL[t] || t === '+') {
        if (t === '+') {
          i++;
          if (i < tokens.length) cluster.push('+' + tokens[i]);
        } else {
          cluster.push(t);
        }
        i++;
      } else break;
    }

    if (cluster.length > 0) {
      let rootIdx = 0;
      let suffixIdx = cluster.length;

      // Identify root position
      if (cluster.length >= 2) {
        const c1 = cluster[0];
        const c2 = cluster[1];
        const c3 = cluster[2];
        
        if (PREFIXES.includes(c1)) {
          // If 1st is prefix, is 2nd a super or root?
          const c2CanBeSub = SUBSCRIPTS.includes(c2);
          const c3IsSub = c3 && SUBSCRIPTS.includes(c3);
          
          // Case for 'brny' or 'bsny':
          // c1=b, c2=r/s, c3=ny. 
          // Even if 'r' is in SUBSCRIPTS, if followed by 'ny' (root), it's a superscript.
          if (cluster.length >= 3 && SUPERSCRIPTS.includes(c2) && !c3IsSub) {
            rootIdx = 1; // b is prefix, stack starts at s/r
          } else if (!c2CanBeSub || (c2 === 'r' && cluster.length > 2)) {
             // In EWTS, r as 2nd char in cluster of 3+ is often super
             rootIdx = 1; 
          }
        }
      }

      // Identify suffix
      if (vowel === null && cluster.length > 2) {
        // e.g., 'bsnyn' -> cluster is [b, s, ny, n]. length 4. 
        // Heuristic: if no vowel and 3+ chars, last one is suffix.
        if (cluster.length >= 4) {
          suffixIdx = cluster.length - 1;
        } else if (cluster.length === 3) {
          // Check if it's prefix + root + suffix (like 'bka')
          // Or prefix + super + root (like 'bsny' - wait, without vowel?)
          if (rootIdx === 1) suffixIdx = 2;
        }
      }

      // Render
      for (let j = 0; j < cluster.length; j++) {
        let char = cluster[j];
        const isManual = char.startsWith('+');
        if (isManual) char = char.substring(1);

        const isSubjoined = isManual || (j > rootIdx && j < suffixIdx);
        
        if (isSubjoined) {
          result += SUBJOINED[char] || CONSONANTS[char] || char;
        } else {
          result += CONSONANTS[char] || SPECIAL[char] || char;
        }
      }
      
      if (vowel !== null) result += vowel;
    } else if (i < tokens.length) {
      result += tokens[i];
      i++;
    }
  }

  return result;
}

export const TIBETAN_VIRTUAL_KEYS = [
  ['ཀ', 'ཁ', 'ག', 'ང', 'ཅ', 'ཆ', 'ཇ', 'ཉ', 'ཏ', 'ཐ'],
  ['ད', 'ན', 'པ', 'ཕ', 'བ', 'མ', 'ཙ', 'ཚ', 'ཛ', 'ཝ'],
  ['ཞ', 'ཟ', 'འ', 'ཡ', 'ར', 'ལ', 'ཤ', 'ས', 'ཧ', 'ཨ'],
  ['ི', 'ུ', 'ེ', 'ོ', '྄', '་', '།', 'ྂ', 'ྃ', 'ཿ']
];

export const TIBETAN_SUBJOINED_KEYS = [
  ['ྐ', 'ྑ', 'ྒ', 'ྔ', 'ྕ', 'ྖ', 'ྗ', 'ྙ', 'ྟ', 'ྠ'],
  ['ྡ', 'ྣ', 'ྤ', 'ྥ', 'ྦ', 'ྨ', 'ྩ', 'ྪ', 'ྫ', 'ྭ'],
  ['ྮ', 'ྯ', 'ྰ', 'ྱ', 'ྲ', 'ླ', 'ྴ', 'ྶ', 'ྷ', 'ཨ'],
  ['ི', 'ུ', 'ེ', 'ོ', '྄', '་', '།', 'ྂ', 'ྃ', 'ཿ']
];

export const ENGLISH_VIRTUAL_KEYS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', '.', ',', '?']
];
