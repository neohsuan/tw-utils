import { describe, expect, it } from 'vitest';
import { rocToGregorianYear, gregorianToRocYear, rocToGregorianDate, gregorianToRocDate } from '../src/index.js';

describe('year conversion', () => {
  it.each([[1, 1912], [89, 2000], [113, 2024], [8088, 9999]])('converts %i <-> %i', (roc, gregorian) => {
    expect(rocToGregorianYear(roc)).toBe(gregorian);
    expect(gregorianToRocYear(gregorian)).toBe(roc);
  });
  it.each([0, -1, 8089, 1.5, NaN, Infinity, -Infinity])('rejects ROC year %s', (year) => {
    expect(() => rocToGregorianYear(year)).toThrow(RangeError);
  });
  it.each([0, 1911, 10000, 2024.5, NaN, Infinity])('rejects Gregorian year %s', (year) => {
    expect(() => gregorianToRocYear(year)).toThrow(RangeError);
  });
  it('does not coerce strings', () => {
    // @ts-expect-error Runtime callers may bypass TypeScript.
    expect(() => rocToGregorianYear('113')).toThrow(TypeError);
    // @ts-expect-error Runtime callers may bypass TypeScript.
    expect(() => gregorianToRocYear(null)).toThrow(TypeError);
  });
});

describe('calendar date conversion', () => {
  it.each([
    ['113/01/05', '2024/01/05'], ['113-02-29', '2024-02-29'],
    ['89/02/29', '2000/02/29'], ['1/01/01', '1912/01/01'],
    ['8088/12/31', '9999/12/31'], ['189/03/01', '2100/03/01'],
  ])('round trips %s <-> %s', (roc, gregorian) => {
    expect(rocToGregorianDate(roc)).toBe(gregorian);
    expect(gregorianToRocDate(gregorian)).toBe(roc);
  });
  it('normalizes month/day and leading year zeros', () => {
    expect(rocToGregorianDate('0113/1/5')).toBe('2024/01/05');
    expect(gregorianToRocDate('2024-1-5')).toBe('113-01-05');
  });
  it.each([
    '112/02/29', '189/02/29', '113/04/31', '113/00/01', '113/13/01',
    '113/01/00', '113/01/32', '0/01/01', '8089/01/01', '113/1-5',
    '113.01.05', '113/01/05\n', ' 113/01/05', '113/01/05 ', '113/01/05T00:00:00',
    '１１３/01/05', '113', '',
  ])('rejects invalid ROC date %j', (value) => expect(() => rocToGregorianDate(value)).toThrow(RangeError));
  it.each(['2023/02/29', '2100/02/29', '1911/12/31', '10000/01/01', '24/01/05', '2024/04/31', '2024/1-5', '2024/01/05\n'])(
    'rejects invalid Gregorian date %j', (value) => expect(() => gregorianToRocDate(value)).toThrow(RangeError),
  );
  it('rejects nonstrings without coercion', () => {
    // @ts-expect-error Runtime callers may bypass TypeScript.
    expect(() => rocToGregorianDate(null)).toThrow(TypeError);
    // @ts-expect-error Runtime callers may bypass TypeScript.
    expect(() => gregorianToRocDate(20240105)).toThrow(TypeError);
  });
});
