import { EMPTY_POINTS_LIST } from '../filter-const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createEmptyPointsListTemplate = (filterType) => `
  <p class="trip-events__msg">${EMPTY_POINTS_LIST[filterType.toUpperCase()]}</p>
`;

export default class EmptyPointsListView extends AbstractView {
  #filterType = null;
  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointsListTemplate(this.#filterType);
  }
}
