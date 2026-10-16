import { describe, expect, it } from 'vitest';
import { marsGravity, parseMass } from '../src/lib/gravity';
import { lightDelay, formatDuration } from '../src/lib/delay';
import { earthMarsDistanceKm } from '../src/lib/ephemeris';
import { marsAge, parseBirthDate } from '../src/lib/marsAge';

describe('gravity', () => {
  it('matches the plan acceptance example: 70 kg', () => {
    const r = marsGravity(70);
    expect(r.marsForceN).toBeCloseTo(259.7, 1);
    expect(r.earthScaleEquivalentKg).toBeCloseTo(26.48, 2);
    expect(r.massKg).toBe(70);
  });
  it('converts pounds', () => {
    expect(parseMass('154.32', 'lb')).toBeCloseTo(70, 2);
  });
  it('rejects bad input', () => {
    for (const bad of ['', 'abc', '-5', '0']) expect(() => parseMass(bad, 'kg')).toThrow();
  });
});

describe('light delay', () => {
  it('matches the plan acceptance example: 100 million km', () => {
    const r = lightDelay(100e6);
    expect(r.oneWaySeconds).toBeCloseTo(333.56, 2);
    expect(r.roundTripSeconds).toBeCloseTo(667.13, 2);
  });
  it('formats durations', () => {
    expect(formatDuration(333.56)).toBe('5 min 34 s');
    expect(formatDuration(42)).toBe('42 s');
  });
});

describe('Earth–Mars distance', () => {
  // Published closest approaches (NASA/JPL): 2020-10-06 ≈ 62.07 million km, 2025-01-12 ≈ 96.08 million km.
  it.each([
    ['2020-10-06T14:00:00Z', 62.07e6],
    ['2025-01-12T12:00:00Z', 96.08e6],
  ])('%s', (iso, km) => {
    expect(Math.abs(earthMarsDistanceKm(new Date(iso)) - km) / km).toBeLessThan(0.005);
  });
  it('stays within the physical range', () => {
    for (let y = 2000; y < 2050; y += 0.37) {
      const d = earthMarsDistanceKm(new Date(Date.UTC(Math.floor(y), Math.round((y % 1) * 11), 1)));
      expect(d).toBeGreaterThan(54e6);
      expect(d).toBeLessThan(402e6);
    }
  });
});

describe('Mars age', () => {
  it('computes completed Mars years and the next Mars birthday', () => {
    const r = marsAge(parseBirthDate('2000-01-01'), new Date('2026-10-16T00:00:00Z'));
    expect(r.marsAgeWhole).toBe(14);
    expect(r.marsYears).toBeCloseTo(9785 / 686.971, 3);
    expect(r.nextMarsBirthday.getTime()).toBeGreaterThan(new Date('2026-10-16').getTime());
  });
  it('rejects invalid and future dates', () => {
    expect(() => parseBirthDate('2001-02-30')).toThrow();
    expect(() => parseBirthDate('01/02/2001')).toThrow();
    expect(() => marsAge(parseBirthDate('2030-01-01'), new Date('2026-10-16'))).toThrow();
  });
});
