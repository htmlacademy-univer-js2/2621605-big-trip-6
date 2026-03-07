import {createElement} from '../render.js';
import {capitalizeFirstLetter, getFormatedDate, getFormatedTime} from '../utils.js';
import { EVENT_TYPES } from '../data.js';

const createEditFormTemplate = (point = {}, destinations = [], offers = {}) => {
  const {
    type = EVENT_TYPES[0],
    destination: destinationId = '',
    dateFrom = new Date(),
    dateTo = new Date(),
    basePrice = 0,
    offers: selectedOffers = []
  } = point;

  const destination = destinations.find((place) => place.id === destinationId) || destinations[0]
  || {name: '', description: '', pictures: []};
  const offerTypes = offers[type] || [];
  const listSelectedOffers = offerTypes.filter((offer) => selectedOffers.includes(offer.id));

  const formatedDate = getFormatedDate(dateFrom);
  const timeFrom = getFormatedTime(dateFrom);
  const timeTo = getFormatedTime(dateTo);


  const eventTypesTemplate = EVENT_TYPES.map((eventType) =>
    `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalizeFirstLetter(eventType)}</label>
    </div>
  `).join('');

  const destinationsTemplate = destinations.map((place) => `
    <option value="${place.name}"></option>
  `).join('');

  const offersTemplate = offerTypes.length > 0 ? `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offerTypes.map((offer) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox"
            name="event-offer-${offer.id}" value="${offer.id}"
            ${listSelectedOffers.some((chosen) => chosen.id === offer.id) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `).join('')}
      </div>
    </section>
  ` : '';

  const destinationDescriptionTemplate = destination.description ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.</p>
      ${destination.pictures.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-gallery">
            ${destination.pictures.map((picture) => `
              <img class="event__photo" src="${picture.src}" alt="${picture.description}">
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  ` : '';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                  ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatedDate} ${timeFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatedDate} ${timeTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationDescriptionTemplate}
        </section>
      </form>
    </li>
  `;
};


export default class EditFormView {
  constructor({point = null, destinations = [], offers = {}}){
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createEditFormTemplate(this.point, this.destinations, this.offers);
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
