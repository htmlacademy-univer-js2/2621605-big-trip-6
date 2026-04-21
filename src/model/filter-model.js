import Observable from '../framework/observable.js';
import { FilterPoint } from '../filter-const.js';

export default class FilterModel extends Observable {
  #filter = FilterPoint.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
