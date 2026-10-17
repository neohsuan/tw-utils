function matches(value: unknown, length: number, pattern: RegExp): value is string {
  return typeof value === 'string' && value.length === length && pattern.test(value);
}

/** Validate an eight-digit business number using the 2023 modulo-5 rule. */
export function isValidBusinessNumber(value: unknown): boolean {
  if (!matches(value, 8, /^[0-9]{8}$/u)) return false;
  const weights = [1, 2, 1, 2, 1, 2, 4, 1] as const;
  const sum = weights.reduce((total, weight, i) => {
    const product = Number(value[i]) * weight;
    return total + Math.floor(product / 10) + product % 10;
  }, 0);
  // For a seventh digit of 7, 28 may contribute either 10 or 1.
  return sum % 5 === 0 || (value[6] === '7' && (sum + 1) % 5 === 0);
}

/** Format only: slash followed by seven characters from 0-9 A-Z . + -. */
export function isValidMobileBarcode(value: unknown): boolean {
  return matches(value, 8, /^\/[0-9A-Z.+-]{7}$/u);
}

/** Format only: two uppercase ASCII letters followed by fourteen digits. */
export function isValidCitizenDigitalCertificate(value: unknown): boolean {
  return matches(value, 16, /^[A-Z]{2}[0-9]{14}$/u);
}

// A-Z, including the nonalphabetical codes for I, O, W, X, Y and Z.
const LETTER_CODES = [
  10, 11, 12, 13, 14, 15, 16, 17, 34, 18, 19, 20, 21,
  22, 35, 23, 24, 25, 26, 27, 28, 29, 32, 30, 31, 33,
] as const;

function letterCode(letter: string): number {
  return LETTER_CODES[letter.charCodeAt(0) - 65]!;
}

function identityChecksum(value: string, oldResident = false): boolean {
  const code = letterCode(value[0]!);
  let sum = Math.floor(code / 10) + (code % 10) * 9;
  for (let i = 1; i < 10; i++) {
    // Old ARC's second letter contributes only its mapped units digit.
    const digit = oldResident && i === 1
      ? letterCode(value[i]!) % 10
      : Number(value[i]);
    sum += digit * (i === 9 ? 1 : 9 - i);
  }
  return sum % 10 === 0;
}

/** National ID: uppercase area letter, gender 1/2, eight digits, checksum. */
export function isValidNationalId(value: unknown): boolean {
  return matches(value, 10, /^[A-Z][12][0-9]{8}$/u) && identityChecksum(value);
}

/** Accept old (letter + A-D + 8 digits) and 2021 (letter + 8/9 + 8 digits) ARC. */
export function isValidResidentCertificate(value: unknown): boolean {
  if (matches(value, 10, /^[A-Z][89][0-9]{8}$/u)) return identityChecksum(value);
  return matches(value, 10, /^[A-Z][A-D][0-9]{8}$/u) && identityChecksum(value, true);
}
