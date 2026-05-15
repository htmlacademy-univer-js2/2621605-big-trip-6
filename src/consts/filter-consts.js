import { isFuturePoint, isActualPoint, isExpiredPoint } from '../utils/point-utils.js';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const EMPTY_POINTS_LIST = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isActualPoint(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isExpiredPoint(point))
};

export { FilterType, EMPTY_POINTS_LIST, filter};
