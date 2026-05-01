import { createPoint } from '../mocks/points-mock.js';
import { createDestinations } from '../mocks/destinations-mock.js';
import { createOffers } from '../mocks/offers-mock.js';
import Observable from '../framework/observable.js';
import { getRandomInteger } from '../utils/general-utils.js';
import { UpdateType } from '../consts.js';

const POINTS_COUNT = getRandomInteger(0, 5);

export default class PointsModel extends Observable{
  #destinations = createDestinations();
  #offers = createOffers();
  #points = Array.from({length: POINTS_COUNT}, () => createPoint(this.#destinations, this.#offers));
  #pointsApiService = null;
  #isLoadingError = false;

  constructor ({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get isLoadingError() {
    return this.#isLoadingError;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      const offers = await this.#pointsApiService.offers;
      const destinations = await this.#pointsApiService.destinations;

      this.#points = points.map(this.#adaptToClient);
      this.#offers = this.#adaptOffersToClient(offers);
      this.#destinations = destinations;

      this.#isLoadingError = false;

    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
      this.#isLoadingError = true;
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  async deletePoint(updateType, update) {
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

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptOffersToClient(offers) {
    const adaptedOffers = {};

    offers.forEach((offer) => {
      adaptedOffers[offer.type] = offer.offers;
    });

    return adaptedOffers;
  }
}
