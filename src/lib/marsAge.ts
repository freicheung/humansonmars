import { MARS_YEAR_EARTH_DAYS, SOL_SECONDS } from './constants';

const DAY_MS = 86400000;

export interface MarsAgeResult {
  earthDays: number;
  marsYears: number;
  sols: number;
  /** Completed Mars years. */
  marsAgeWhole: number;
  nextMarsBirthday: Date;
}

export function parseBirthDate(input: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) throw new RangeError('Use the format YYYY-MM-DD.');
  const d = new Date(`${input}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== input) throw new RangeError('Not a valid date.');
  return d;
}

export function marsAge(birth: Date, now: Date): MarsAgeResult {
  const ms = now.getTime() - birth.getTime();
  if (ms < 0) throw new RangeError('Birth date is in the future.');
  const earthDays = ms / DAY_MS;
  const marsYears = earthDays / MARS_YEAR_EARTH_DAYS;
  const marsAgeWhole = Math.floor(marsYears);
  const nextMarsBirthday = new Date(birth.getTime() + (marsAgeWhole + 1) * MARS_YEAR_EARTH_DAYS * DAY_MS);
  return { earthDays, marsYears, sols: (ms / 1000) / SOL_SECONDS, marsAgeWhole, nextMarsBirthday };
}
