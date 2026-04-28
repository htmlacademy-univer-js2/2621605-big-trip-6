import { isFuturePoint, isActualPoint, isExpiredPoint } from './utils/point-utils.js';

const FilterPoint = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

const EMPTY_POINTS_LIST = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
};

const filter = {
  [FilterPoint.EVERYTHING]: (points) => points,
  [FilterPoint.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FilterPoint.PRESENT]: (points) => points.filter((point) => isActualPoint(point)),
  [FilterPoint.PAST]: (points) => points.filter((point) => isExpiredPoint(point))
};

export { FilterPoint, EMPTY_POINTS_LIST, filter};
