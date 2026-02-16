import {createElement} from '../render.js';
import {capitalizeFirstLetter} from '../utils.js';

const SORTING_TYPES = ['day', 'event', 'time', 'price', 'offer'];

const createSortPanelItemTemplate = (type) => {
  const capitalizedType = capitalizeFirstLetter(type);

  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}">
      <label class="trip-sort__btn" for="sort-${type}">${capitalizedType}</label>
    </div>
  `;
};

const createSortPanelTemplate = () => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SORTING_TYPES.map((type) => createSortPanelItemTemplate(type)).join('')}
    </form>
`;

export default class SortPanelView {
  getTemplate() {
    return createSortPanelTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
