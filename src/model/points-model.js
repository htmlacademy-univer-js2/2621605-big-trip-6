import { createPoint } from '../mocks/points-mock.js';
import { createDestinations } from '../mocks/destinations-mock.js';
import { createOffers } from '../mocks/offers-mock.js';
import Observable from '../framework/observable.js';
import { getRandomInteger } from '../utils/general-utils.js';

const POINTS_COUNT = getRandomInteger(0, 5);

export default class PointsModel extends Observable{
  #destinations = createDestinations();
  #offers = createOffers();
  #points = Array.from({length: POINTS_COUNT}, () => createPoint(this.#destinations, this.#offers));

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
