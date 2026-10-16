import { SPEED_OF_LIGHT_KM_S } from './constants';

export interface DelayResult {
  distanceKm: number;
  oneWaySeconds: number;
  roundTripSeconds: number;
}

/** Light travel time only: excludes queuing, encoding and relays on Earth. */
export function lightDelay(distanceKm: number): DelayResult {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) throw new RangeError('Distance must be positive.');
  const oneWaySeconds = distanceKm / SPEED_OF_LIGHT_KM_S;
  return { distanceKm, oneWaySeconds, roundTripSeconds: oneWaySeconds * 2 };
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return m === 0 ? `${rest} s` : `${m} min ${String(rest).padStart(2, '0')} s`;
}
