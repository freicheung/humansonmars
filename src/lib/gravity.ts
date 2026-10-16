import { LB_TO_KG, MARS_SURFACE_GRAVITY, STANDARD_GRAVITY } from './constants';

export type MassUnit = 'kg' | 'lb';

export interface GravityResult {
  massKg: number;
  marsForceN: number;
  earthForceN: number;
  /** What an Earth bathroom scale calibrated for 1 g would read on Mars, in kg. */
  earthScaleEquivalentKg: number;
}

export function parseMass(input: string | number, unit: MassUnit): number {
  const value = typeof input === 'number' ? input : Number(String(input).trim());
  if (String(input).trim() === '' || !Number.isFinite(value) || value <= 0) {
    throw new RangeError('Mass must be a positive number.');
  }
  return unit === 'lb' ? value * LB_TO_KG : value;
}

export function marsGravity(massKg: number): GravityResult {
  if (!Number.isFinite(massKg) || massKg <= 0) throw new RangeError('Mass must be a positive number.');
  const marsForceN = massKg * MARS_SURFACE_GRAVITY;
  return {
    massKg,
    marsForceN,
    earthForceN: massKg * STANDARD_GRAVITY,
    earthScaleEquivalentKg: marsForceN / STANDARD_GRAVITY,
  };
}
