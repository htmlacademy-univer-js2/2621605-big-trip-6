import { getFormatedDate, getFormatedTime, calculateTimeDuration, formatDateTime } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const createRoutePointTemplate = (point, destination, offerTypes) => {
  const {type, dateFrom, dateTo, basePrice, offers: selectedOffers, isFavourite} = point;

  const formatedDate = getFormatedDate(dateFrom);
  const dateTimeFrom = formatDateTime(dateFrom);
  const dateTimeTo = formatDateTime(dateTo);
  const timeFrom = getFormatedTime(dateFrom);
  const timeTo = getFormatedTime(dateTo);
  const duration = calculateTimeDuration(dateFrom, dateTo);
  const classFavorite = isFavourite ? 'event__favorite-btn--active' : '';

  const listSelectedOffers = offerTypes.filter((offer) => selectedOffers.includes(offer.id));
  const listOffersTemplate = listSelectedOffers.length > 0 ? `
    <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${listSelectedOffers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `).join('')}
      </ul>
  ` : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateTimeFrom}">${formatedDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateTimeFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTimeTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${listOffersTemplate}
        <button class="event__favorite-btn ${classFavorite}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class RoutePointView extends AbstractView{
  #point = null;
  #destinations = null;
  #offers = null;
  #onOpenEditButtonClick = null;

  constructor({point, destinations, offers, onOpenEditButtonClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onOpenEditButtonClick = onOpenEditButtonClick;
    this.#setEventListeners();
  }

  get template() {
    const destination = this.#destinations.find((dest) => dest.id === this.#point.destination);
    const offerTypes = this.#offers[this.#point.type] || [];
    return createRoutePointTemplate(this.#point, destination, offerTypes);
  }

  #setEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#openEditButtonClickHandler);
  }

  #openEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onOpenEditButtonClick();
  };
}
