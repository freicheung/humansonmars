import { AU_KM } from './constants';

// Keplerian elements and rates from JPL "Approximate Positions of the Planets",
// Table 1 (valid 1800–2050). Values: [a (AU), e, I, L, long. perihelion, long. node] in degrees,
// then the rate of each per Julian century.
type Elements = [number, number, number, number, number, number];
const EARTH: [Elements, Elements] = [
  [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
  [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
];
const MARS: [Elements, Elements] = [
  [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
  [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
];

const RAD = Math.PI / 180;

export function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function heliocentric([base, rate]: [Elements, Elements], T: number): [number, number, number] {
  const [a, e, I, L, varpi, node] = base.map((v, i) => v + rate[i] * T);
  const omega = varpi - node;
  let M = ((L - varpi) % 360 + 540) % 360 - 180; // −180..180
  const Mr = M * RAD;
  let E = Mr + e * Math.sin(Mr);
  for (let i = 0; i < 10; i++) {
    const dE = (E - e * Math.sin(E) - Mr) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const [cw, sw, cO, sO, cI, sI] = [Math.cos(omega * RAD), Math.sin(omega * RAD), Math.cos(node * RAD), Math.sin(node * RAD), Math.cos(I * RAD), Math.sin(I * RAD)];
  return [
    (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
    sw * sI * xp + cw * sI * yp,
  ];
}

/** Approximate Earth–Mars distance in km (accuracy on the order of 0.1%). */
export function earthMarsDistanceKm(date: Date): number {
  const T = (julianDate(date) - 2451545.0) / 36525;
  const m = heliocentric(MARS, T);
  const e = heliocentric(EARTH, T);
  return Math.hypot(m[0] - e[0], m[1] - e[1], m[2] - e[2]) * AU_KM;
}

export const EPHEMERIS_VALID_FROM = new Date('1800-01-01T00:00:00Z');
export const EPHEMERIS_VALID_TO = new Date('2050-12-31T00:00:00Z');
