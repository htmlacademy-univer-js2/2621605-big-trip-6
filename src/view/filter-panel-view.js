import {capitalizeFirstLetter} from '../utils/general-utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const generateFilterButton = (filters, currentFilterType) => filters.map((filter) => (`
  <div class="trip-filters__filter">
    <input
      id="filter-${filter.type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${filter.type}"
      ${filter.type === currentFilterType ? 'checked' : ''}
      ${filter.points.length === 0 ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${filter.type}">${capitalizeFirstLetter(filter.type)}</label>
  </div>
`)).join('');

const createFilterPanelTemplate = (filters, currentFilterType) => `
  <div class="trip-main__trip-controls  trip-controls">
    <div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${generateFilterButton(filters, currentFilterType)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>
  </div>
`;

export default class FilterPanelView extends AbstractView {
  #filters = null;
  #handleFilterChange = null;
  #currentFilterType = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterPanelTemplate(this.#filters, this.#currentFilterType);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.name !== 'trip-filter') {
      return;
    }

    this.#handleFilterChange(evt.target.value);
  };
}
