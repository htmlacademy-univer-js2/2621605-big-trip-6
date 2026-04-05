import { capitalizeFirstLetter } from '../utils/general-utils.js';
import { SORTING_TYPES } from '../data.js';
import AbstractView from '../framework/view/abstract-view.js';

const sortingTypesArray = Object.values(SORTING_TYPES);

const createSortPanelItemTemplate = (type, isActive = false) => {
  const capitalizedType = capitalizeFirstLetter(type);
  const checkedAttribute = isActive ? 'checked' : '';

  return `
    <div class="trip-sort__item trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input visually-hidden" type="radio"
        name="trip-sort" value="sort-${type}" ${checkedAttribute} data-sort-type="${type}">
      <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${capitalizedType}</label>
    </div>
  `;
};

const createSortPanelTemplate = (activeSortType) => `
  <form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${sortingTypesArray.map((type) => createSortPanelItemTemplate(type, type === activeSortType)).join('')}
  </form>
`;

export default class SortPanelView extends AbstractView {
  #handleSortChange = null;
  #activeSortType = null;

  constructor({ onSortChange, activeSortType = SORTING_TYPES.DAY }) {
    super();
    this.#handleSortChange = onSortChange;
    this.#activeSortType = activeSortType;
    this.element.addEventListener('click', this.#sortChangeHandler);
  }

  get template() {
    return createSortPanelTemplate(this.#activeSortType);
  }

  #sortChangeHandler = (evt) => {
    const sortItem = evt.target.closest('.trip-sort__item');
    const input = sortItem.querySelector('input[name="trip-sort"]');
    const sortType = input.dataset.sortType;

    document.querySelectorAll('input[name="trip-sort"]').forEach((inputElement) => {
      inputElement.checked = false;
      inputElement.removeAttribute('checked');
    });

    input.checked = true;
    input.setAttribute('checked', '');

    this.#handleSortChange(sortType);
  };
}
