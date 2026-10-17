const YEAR_OFFSET = 1911;

function assertYear(year: number, min: number, max: number): void {
  if (typeof year !== 'number') throw new TypeError('Year must be a number');
  if (!Number.isInteger(year) || year < min || year > max) {
    throw new RangeError(`Year must be an integer between ${min} and ${max}`);
  }
}

/** Convert a ROC year (1–8088) to a Gregorian year (1912–9999). */
export function rocToGregorianYear(year: number): number {
  assertYear(year, 1, 8088);
  return year + YEAR_OFFSET;
}

/** Convert a Gregorian year (1912–9999) to a ROC year (1–8088). */
export function gregorianToRocYear(year: number): number {
  assertYear(year, 1912, 9999);
  return year - YEAR_OFFSET;
}

function convertDate(value: string, fromRoc: boolean): string {
  if (typeof value !== 'string') throw new TypeError('Date must be a string');
  const pattern = fromRoc
    ? /^([0-9]{1,4})([/\-])([0-9]{1,2})\2([0-9]{1,2})$/u
    : /^([0-9]{4})([/\-])([0-9]{1,2})\2([0-9]{1,2})$/u;
  const match = pattern.exec(value);
  if (!match || match[0] !== value) throw new RangeError('Expected year/month/day or year-month-day');
  const year = Number(match[1]);
  const month = Number(match[3]);
  const day = Number(match[4]);
  const outputYear = fromRoc ? rocToGregorianYear(year) : gregorianToRocYear(year);
  const gregorianYear = fromRoc ? outputYear : year;
  const leap = gregorianYear % 4 === 0 && (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0);
  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]!) {
    throw new RangeError('Invalid calendar date');
  }
  const separator = match[2]!;
  return [String(outputYear), String(month).padStart(2, '0'), String(day).padStart(2, '0')].join(separator);
}

/** Convert ROC dates to Gregorian dates; preserve separator and pad month/day. */
export function rocToGregorianDate(value: string): string {
  return convertDate(value, true);
}

/** Convert Gregorian dates to ROC dates; preserve separator and pad month/day. */
export function gregorianToRocDate(value: string): string {
  return convertDate(value, false);
}
