// ===== CRACK CODE — CIPHER ENGINE =====
// All encoding/decoding algorithms in one place

export type CipherType =
  | 'base64' | 'binary' | 'hex' | 'morse' | 'caesar'
  | 'rot13' | 'vigenere' | 'reverse' | 'leetspeak' | 'unicode'
  | 'emoji' | 'invisible' | 'matrix' | 'glitch' | 'alien';

export interface CipherInfo {
  id: CipherType;
  name: string;
  description: string;
  icon: string;
  category: 'classic' | 'modern' | 'creative' | 'advanced';
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export const CIPHERS: CipherInfo[] = [
  { id: 'base64', name: 'Base64', description: 'Standard Base64 encoding used across the web', icon: '🔤', category: 'modern', difficulty: 1 },
  { id: 'binary', name: 'Binary', description: 'Convert text to 1s and 0s — the language of machines', icon: '💻', category: 'classic', difficulty: 1 },
  { id: 'hex', name: 'Hexadecimal', description: 'Encode into hex representation', icon: '🔢', category: 'classic', difficulty: 2 },
  { id: 'morse', name: 'Morse Code', description: 'Dots and dashes — the original encryption', icon: '📡', category: 'classic', difficulty: 2 },
  { id: 'caesar', name: 'Caesar Cipher', description: 'Shift each letter by a fixed number', icon: '🏛️', category: 'classic', difficulty: 2 },
  { id: 'rot13', name: 'ROT13', description: 'Rotate each letter 13 places', icon: '🔄', category: 'classic', difficulty: 1 },
  { id: 'vigenere', name: 'Vigenère', description: 'Polyalphabetic cipher with a keyword', icon: '🗝️', category: 'advanced', difficulty: 4 },
  { id: 'reverse', name: 'Reverse', description: 'Mirror your text backwards', icon: '🪞', category: 'creative', difficulty: 1 },
  { id: 'leetspeak', name: 'L33tsp34k', description: 'H4ck3r-style text transformation', icon: '😎', category: 'creative', difficulty: 1 },
  { id: 'unicode', name: 'Unicode Shift', description: 'Transform into fancy unicode characters', icon: '✨', category: 'creative', difficulty: 2 },
  { id: 'emoji', name: 'Emoji Code', description: 'Encode text into emoji sequences', icon: '🎭', category: 'creative', difficulty: 2 },
  { id: 'invisible', name: 'Invisible Text', description: 'Hide messages in zero-width characters', icon: '👻', category: 'advanced', difficulty: 3 },
  { id: 'matrix', name: 'Matrix Code', description: 'Encode into Matrix-style symbols', icon: '🟢', category: 'creative', difficulty: 2 },
  { id: 'glitch', name: 'Glitch Text', description: 'Corrupt your text with zalgo effects', icon: '⚡', category: 'creative', difficulty: 2 },
  { id: 'alien', name: 'Alien Language', description: 'Mysterious extraterrestrial encoding', icon: '👽', category: 'creative', difficulty: 3 },
];

// ===== MORSE CODE MAP =====
const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/', '.': '.-.-.-', ',': '--..--',
  '?': '..--..', '!': '-.-.--', "'": '.----.', '"': '.-..-.', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
  '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '@': '.--.-.',
};
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

// ===== EMOJI MAP =====
const EMOJI_MAP: Record<string, string> = {
  'A': '🅰️', 'B': '🅱️', 'C': '©️', 'D': '🇩', 'E': '📧', 'F': '🎏',
  'G': '🌀', 'H': '♓', 'I': 'ℹ️', 'J': '🎷', 'K': '🎋', 'L': '🕒',
  'M': 'Ⓜ️', 'N': '♑', 'O': '⭕', 'P': '🅿️', 'Q': '🔍', 'R': '®️',
  'S': '💲', 'T': '✝️', 'U': '⛎', 'V': '♈', 'W': '〰️', 'X': '❌',
  'Y': '💴', 'Z': '💤', ' ': '⬜', '0': '0️⃣', '1': '1️⃣', '2': '2️⃣',
  '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣',
  '9': '9️⃣', '.': '🔸', '!': '❗', '?': '❓', ',': '🔹',
};
const REVERSE_EMOJI = Object.fromEntries(Object.entries(EMOJI_MAP).map(([k, v]) => [v, k]));

// ===== LEET MAP =====
const LEET_MAP: Record<string, string> = {
  'A': '4', 'B': '8', 'C': '(', 'D': '|)', 'E': '3', 'F': '|=',
  'G': '6', 'H': '#', 'I': '!', 'J': '_|', 'K': '|<', 'L': '1',
  'M': '|V|', 'N': '/\\/', 'O': '0', 'P': '|*', 'Q': '(,)', 'R': '|2',
  'S': '5', 'T': '7', 'U': '|_|', 'V': '\\/', 'W': '\\/\\/', 'X': '><',
  'Y': '`/', 'Z': '2',
};

// ===== ALIEN MAP =====
const ALIEN_MAP: Record<string, string> = {
  'A': 'ᗩ', 'B': 'ᗷ', 'C': 'ᑕ', 'D': 'ᗪ', 'E': 'ᗴ', 'F': 'ᖴ',
  'G': 'Ǥ', 'H': 'ᕼ', 'I': 'Ꭵ', 'J': 'ᒎ', 'K': 'Ꮶ', 'L': 'ᒪ',
  'M': 'ᗰ', 'N': 'ᑎ', 'O': 'ᗝ', 'P': 'ᑭ', 'Q': 'Ꭴ', 'R': 'ᖇ',
  'S': 'Ꮥ', 'T': 'Ꮦ', 'U': 'ᑌ', 'V': 'ᐯ', 'W': 'ᗯ', 'X': '᙭',
  'Y': 'Ꭹ', 'Z': 'Ꮓ',
};
const REVERSE_ALIEN = Object.fromEntries(Object.entries(ALIEN_MAP).map(([k, v]) => [v, k]));

// ===== MATRIX SYMBOLS =====
const MATRIX_CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';

// ===== UNICODE FANCY MAP (Mathematical Sans-Serif Bold) =====
function unicodeShift(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + (code - 65)); // A-Z
  if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + (code - 97)); // a-z
  if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + (code - 48)); // 0-9
  return char;
}

// ===== GLITCH/ZALGO =====
const ZALGO_UP = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b'];
const ZALGO_MID = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', '\u0337'];
const ZALGO_DOWN = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'];

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== INVISIBLE TEXT (Zero-Width Encoding) =====
const ZW_SPACE = '\u200B';  // zero-width space = 0
const ZW_JOINER = '\u200D'; // zero-width joiner = 1
const ZW_SEP = '\u2060';    // word joiner = separator

// ===== ENCODE FUNCTIONS =====
export function encode(text: string, cipher: CipherType, options?: { shift?: number; key?: string }): string {
  try {
    switch (cipher) {
      case 'base64':
        return btoa(unescape(encodeURIComponent(text)));
      case 'binary':
        return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      case 'hex':
        return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
      case 'morse':
        return text.toUpperCase().split('').map(c => MORSE_MAP[c] || c).join(' ');
      case 'caesar': {
        const shift = options?.shift ?? 3;
        return text.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26) + 65);
          if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26) + 97);
          return c;
        }).join('');
      }
      case 'rot13':
        return text.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + 13) % 26) + 65);
          if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + 13) % 26) + 97);
          return c;
        }).join('');
      case 'vigenere': {
        const key = (options?.key || 'SECRET').toUpperCase();
        let ki = 0;
        return text.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            const shift = key.charCodeAt(ki % key.length) - 65;
            ki++;
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
          }
          if (code >= 97 && code <= 122) {
            const shift = key.charCodeAt(ki % key.length) - 65;
            ki++;
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
          }
          return c;
        }).join('');
      }
      case 'reverse':
        return text.split('').reverse().join('');
      case 'leetspeak':
        return text.toUpperCase().split('').map(c => LEET_MAP[c] || c).join('');
      case 'unicode':
        return text.split('').map(c => unicodeShift(c)).join('');
      case 'emoji':
        return text.toUpperCase().split('').map(c => EMOJI_MAP[c] || c).join('');
      case 'invisible': {
        const binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
        return binary.split('').map(b => b === '0' ? ZW_SPACE : ZW_JOINER).join('') + ZW_SEP;
      }
      case 'matrix':
        return text.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 32 && code < 127) return MATRIX_CHARS[code % MATRIX_CHARS.length];
          return c;
        }).join('');
      case 'glitch':
        return text.split('').map(c => {
          let result = c;
          for (let i = 0; i < 3; i++) result += randFrom(ZALGO_UP);
          for (let i = 0; i < 2; i++) result += randFrom(ZALGO_MID);
          for (let i = 0; i < 3; i++) result += randFrom(ZALGO_DOWN);
          return result;
        }).join('');
      case 'alien':
        return text.toUpperCase().split('').map(c => ALIEN_MAP[c] || c).join('');
      default:
        return text;
    }
  } catch {
    return '[Encoding error]';
  }
}

// ===== DECODE FUNCTIONS =====
export function decode(text: string, cipher: CipherType, options?: { shift?: number; key?: string }): string {
  try {
    switch (cipher) {
      case 'base64':
        return decodeURIComponent(escape(atob(text.trim())));
      case 'binary':
        return text.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
      case 'hex':
        return text.trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join('');
      case 'morse':
        return text.trim().split(' ').map(m => REVERSE_MORSE[m] || m).join('');
      case 'caesar': {
        const shift = options?.shift ?? 3;
        return encode(text, 'caesar', { shift: 26 - (shift % 26) });
      }
      case 'rot13':
        return encode(text, 'rot13');
      case 'vigenere': {
        const key = (options?.key || 'SECRET').toUpperCase();
        let ki = 0;
        return text.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            const shift = key.charCodeAt(ki % key.length) - 65;
            ki++;
            return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
          }
          if (code >= 97 && code <= 122) {
            const shift = key.charCodeAt(ki % key.length) - 65;
            ki++;
            return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
          }
          return c;
        }).join('');
      }
      case 'reverse':
        return text.split('').reverse().join('');
      case 'leetspeak': {
        const reverseLeet = Object.fromEntries(Object.entries(LEET_MAP).map(([k, v]) => [v, k]));
        let result = '';
        let i = 0;
        while (i < text.length) {
          let found = false;
          for (let len = 4; len >= 1; len--) {
            const sub = text.substring(i, i + len);
            if (reverseLeet[sub]) {
              result += reverseLeet[sub];
              i += len;
              found = true;
              break;
            }
          }
          if (!found) { result += text[i]; i++; }
        }
        return result;
      }
      case 'emoji':
        return [...text].reduce((acc, char, idx) => {
          // Handle multi-codepoint emoji
          const combined = acc.pending + char;
          if (REVERSE_EMOJI[combined]) {
            return { result: acc.result + REVERSE_EMOJI[combined], pending: '' };
          }
          if (REVERSE_EMOJI[acc.pending]) {
            return { result: acc.result + REVERSE_EMOJI[acc.pending], pending: char };
          }
          if (acc.pending && !REVERSE_EMOJI[combined]) {
            return { result: acc.result + acc.pending, pending: char };
          }
          return { ...acc, pending: combined };
        }, { result: '', pending: '' } as { result: string; pending: string }).result;
      case 'invisible': {
        const filtered = text.split('').filter(c => c === ZW_SPACE || c === ZW_JOINER);
        const binary = filtered.map(c => c === ZW_SPACE ? '0' : '1').join('');
        let result = '';
        for (let i = 0; i < binary.length; i += 8) {
          const byte = binary.substring(i, i + 8);
          if (byte.length === 8) result += String.fromCharCode(parseInt(byte, 2));
        }
        return result;
      }
      case 'unicode':
        return text.split('').map(c => {
          const cp = c.codePointAt(0) || 0;
          if (cp >= 0x1D5D4 && cp <= 0x1D5ED) return String.fromCharCode(65 + (cp - 0x1D5D4));
          if (cp >= 0x1D5EE && cp <= 0x1D607) return String.fromCharCode(97 + (cp - 0x1D5EE));
          if (cp >= 0x1D7EC && cp <= 0x1D7F5) return String.fromCharCode(48 + (cp - 0x1D7EC));
          return c;
        }).join('');
      case 'alien':
        return text.split('').map(c => REVERSE_ALIEN[c] || c).join('');
      case 'matrix':
        return '[Matrix decode requires original mapping]';
      case 'glitch':
        return text.replace(/[\u0300-\u036f\u0489]/g, '');
      default:
        return text;
    }
  } catch {
    return '[Decoding error]';
  }
}

// ===== AUTO-DETECT =====
export function detectCipher(text: string): CipherType | null {
  const trimmed = text.trim();
  // Check base64
  if (/^[A-Za-z0-9+/]+=*$/.test(trimmed) && trimmed.length > 3) {
    try { atob(trimmed); return 'base64'; } catch { /* not base64 */ }
  }
  // Check binary
  if (/^[01]{8}(\s[01]{8})*$/.test(trimmed)) return 'binary';
  // Check hex
  if (/^[0-9a-fA-F]{2}(\s[0-9a-fA-F]{2})*$/.test(trimmed)) return 'hex';
  // Check morse
  if (/^[.\-/\s]+$/.test(trimmed) && trimmed.includes('.')) return 'morse';
  // Check invisible
  if (trimmed.includes(ZW_SPACE) || trimmed.includes(ZW_JOINER)) return 'invisible';
  // Check emoji-heavy
  const emojiCount = [...trimmed].filter(c => c.codePointAt(0)! > 255).length;
  if (emojiCount > trimmed.length * 0.5) return 'emoji';
  // Check alien
  const alienChars = Object.values(ALIEN_MAP);
  const alienCount = [...trimmed].filter(c => alienChars.includes(c)).length;
  if (alienCount > trimmed.length * 0.5) return 'alien';
  return null;
}

// ===== ENCRYPTION STRENGTH =====
export function getStrength(text: string): { score: number; label: string; color: string } {
  if (!text) return { score: 0, label: 'None', color: '#666' };
  const len = text.length;
  const uniqueChars = new Set(text).size;
  const entropy = uniqueChars / Math.max(len, 1);
  const hasSpecial = /[^a-zA-Z0-9\s]/.test(text);
  const hasMixed = /[a-z]/.test(text) && /[A-Z]/.test(text);

  let score = Math.min(100, Math.round(
    (len > 20 ? 25 : len * 1.25) +
    (entropy * 30) +
    (hasSpecial ? 20 : 0) +
    (hasMixed ? 10 : 0) +
    (uniqueChars > 15 ? 15 : uniqueChars)
  ));

  if (score < 25) return { score, label: 'Weak', color: '#ff3366' };
  if (score < 50) return { score, label: 'Fair', color: '#ffaa00' };
  if (score < 75) return { score, label: 'Good', color: '#00ccff' };
  return { score, label: 'Strong', color: '#00ff88' };
}
