import { isFuturePoint, isActualPoint, isExpiredPoint } from './utils/point-utils.js';

const FilterPoint = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FilterPoint.EVERYTHING]: (points) => points,
  [FilterPoint.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FilterPoint.PRESENT]: (points) => points.filter((point) => isActualPoint(point)),
  [FilterPoint.PAST]: (points) => points.filter((point) => isExpiredPoint(point))
};

export { FilterPoint, filter};
