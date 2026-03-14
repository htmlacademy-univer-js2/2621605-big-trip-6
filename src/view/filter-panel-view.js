import {capitalizeFirstLetter} from '../utils.js';
import {FILTER_TYPES} from '../data.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterPanelItemTemplate = (type) => {
  const capitalizedType = capitalizeFirstLetter(type);

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}">
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizedType}</label>
    </div>
  `;
};

const createFilterPanelTemplate = () => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${FILTER_TYPES.map((type) => createFilterPanelItemTemplate(type)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
`;

export default class FilterPanelView extends AbstractView {
  get template() {
    return createFilterPanelTemplate();
  }
}
