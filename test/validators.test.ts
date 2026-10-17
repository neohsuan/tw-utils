import { describe, expect, it } from 'vitest';
import {
  isValidBusinessNumber, isValidMobileBarcode, isValidCitizenDigitalCertificate,
  isValidNationalId, isValidResidentCertificate,
} from '../src/index.js';

describe('business numbers (2023)', () => {
  it.each(['04595257', '04595252', '24536806', '10458575', '10458574'])(
    'accepts %s including modulo-5 and seventh-digit-7 cases', (value) => {
      expect(isValidBusinessNumber(value)).toBe(true);
    },
  );
  it.each(['04595253', '10458573', '12345678', '2453680', '245368066', '２４５３６８０６'])(
    'rejects %s', (value) => expect(isValidBusinessNumber(value)).toBe(false),
  );
});

describe('invoice carrier formats', () => {
  it.each(['/ABC1234', '/0AZ.+-9', '/.......', '/+++++++', '/-------'])(
    'accepts mobile barcode %s', (value) => expect(isValidMobileBarcode(value)).toBe(true),
  );
  it.each(['ABC1234', '/abc1234', '/ABC123', '/ABC12345', '/ABC_123', '/ABC/123', '/１２３４５６７'])(
    'rejects mobile barcode %s', (value) => expect(isValidMobileBarcode(value)).toBe(false),
  );
  it.each(['AB12345678901234', 'ZZ00000000000000'])(
    'accepts citizen certificate %s', (value) => expect(isValidCitizenDigitalCertificate(value)).toBe(true),
  );
  it.each(['ab12345678901234', 'A123456789012345', 'ABC1234567890123', 'AB1234567890123', 'AB123456789012345'])(
    'rejects citizen certificate %s', (value) => expect(isValidCitizenDigitalCertificate(value)).toBe(false),
  );
});

const nationalIds = [
  'A123456789', 'B123456780', 'C123456781', 'D123456782', 'E123456783',
  'F123456784', 'G123456785', 'H123456786', 'I123456781', 'J123456787',
  'K123456788', 'L123456788', 'M123456789', 'N123456780', 'O123456782',
  'P123456781', 'Q123456782', 'R123456783', 'S123456784', 'T123456785',
  'U123456786', 'V123456787', 'W123456789', 'X123456787', 'Y123456788', 'Z123456780',
  'B120667503', 'A223456781',
];

const residentIds = [
  'AA12345675', 'AB12345677', 'AC12345679', 'AD12345671',
  'A812345671', 'A912345673', 'I812345673', 'O912345676', 'W812345671', 'Z912345674',
];

describe('national IDs', () => {
  it.each(nationalIds)('validates area/gender/checksum for %s', (value) => {
    expect(isValidNationalId(value)).toBe(true);
    expect(isValidResidentCertificate(value)).toBe(false);
    const corrupted = value.slice(0, -1) + ((Number(value.at(-1)) + 1) % 10);
    expect(isValidNationalId(corrupted)).toBe(false);
  });
  it.each(['A323456787', 'A000000000', 'a123456789', 'AA12345675', '1123456789', 'A12345678'])(
    'rejects wrong national ID format %s', (value) => expect(isValidNationalId(value)).toBe(false),
  );
});

describe('old and new resident certificates', () => {
  it.each(residentIds)('validates %s and rejects an altered checksum', (value) => {
    expect(isValidResidentCertificate(value)).toBe(true);
    expect(isValidNationalId(value)).toBe(false);
    const corrupted = value.slice(0, -1) + ((Number(value.at(-1)) + 1) % 10);
    expect(isValidResidentCertificate(corrupted)).toBe(false);
  });
  it.each(['AE12345673', 'AZ12345679', 'Aa12345675', 'a812345671', 'A712345679', 'A81234567', 'A8123456711'])(
    'rejects wrong resident format %s', (value) => expect(isValidResidentCertificate(value)).toBe(false),
  );
});

describe('strict, nonthrowing validators', () => {
  const validators = [isValidBusinessNumber, isValidMobileBarcode,
    isValidCitizenDigitalCertificate, isValidNationalId, isValidResidentCertificate];
  it.each([undefined, null, 12345678, true, {}, [], new String('A123456789'), ''])(
    'rejects nonstring/empty input %j', (value) => {
      for (const validate of validators) expect(validate(value)).toBe(false);
    },
  );
  it('rejects surrounding whitespace, newlines and trailing data', () => {
    const validInputs = ['04595252', '/ABC1234', 'AB12345678901234', 'A123456789', 'AB12345677'];
    validators.forEach((validate, i) => {
      const valid = validInputs[i]!;
      for (const value of [` ${valid}`, `${valid} `, `${valid}\n`, `${valid}\r\n`, `${valid}x`]) {
        expect(validate(value)).toBe(false);
      }
    });
  });
});
