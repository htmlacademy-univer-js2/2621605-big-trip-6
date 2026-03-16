import { filter } from '../filter-const.js';

const generateFilters = (points) => Object.entries(filter).map(([filterType, filterPatternByType]) => ({
  type: filterType,
  count: filterPatternByType(points).length
}));

export {generateFilters};
