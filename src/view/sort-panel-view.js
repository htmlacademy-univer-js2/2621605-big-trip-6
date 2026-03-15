import {capitalizeFirstLetter} from '../utils.js';
import {SORTING_TYPES} from '../data.js';
import AbstractView from '../framework/view/abstract-view.js';

const createSortPanelItemTemplate = (type) => {
  const capitalizedType = capitalizeFirstLetter(type);

  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" checked>
      <label class="trip-sort__btn" for="sort-${type}">${capitalizedType}</label>
    </div>
  `;
};

const createSortPanelTemplate = () => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SORTING_TYPES.map((type) => createSortPanelItemTemplate(type)).join('')}
    </form>
`;

export default class SortPanelView extends AbstractView {
  get template() {
    return createSortPanelTemplate();
  }
}
