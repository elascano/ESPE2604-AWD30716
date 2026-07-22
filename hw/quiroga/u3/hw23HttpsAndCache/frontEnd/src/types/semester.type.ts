import type { Period } from './period.type';

export interface Semester extends Period {
  type: 'semi-annual';
  semester: 1 | 2;
}
