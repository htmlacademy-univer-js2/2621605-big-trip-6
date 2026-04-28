import {capitalizeFirstLetter} from '../utils/general-utils.js';
import {getFormatedDate, getFormatedTime} from '../utils/date-utils.js';
import { EVENT_TYPES, EVENT_TYPE_ICONS } from '../data.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

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
      <p class="event__destination-description">${destination.description}</p>
      ${destination.pictures.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
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
      <form class="event event--edit" action="#" method="post" autocomplete="off">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${EVENT_TYPE_ICONS[type]}" alt="Event type icon">
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination ? `${destination.name}` : '')}" list="destination-list-1" required>
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
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
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


export default class EditFormView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offers = null;
  #onCloseEditButtonClick = null;
  #onSubmitButtonClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #onDeleteButtonClick = null;

  constructor({point = null, destinations = [], offers = {}, onCloseEditButtonClick, onSubmitButtonClick, onDeleteButtonClick}) {
    super();
    this._setState({...point});
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onCloseEditButtonClick = onCloseEditButtonClick;
    this.#onSubmitButtonClick = onSubmitButtonClick;
    this.#onDeleteButtonClick = onDeleteButtonClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinations, this.#offers);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onCloseEditButtonClickHandler);

    this.element.querySelector('form').addEventListener('submit', this.#onSubmitButtonClickHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onDeleteClickHandler);

    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const newEventType = evt.target.value;
    this.updateElement({
      type: newEventType,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value);
    this.updateElement({
      destination: selectedDestination ? selectedDestination.id : ''
    });
  };

  #onCloseEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditButtonClick();
  };

  #onSubmitButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitButtonClick(this._state);
  };

  reset(point) {
    this.updateElement(point);
  }

  #setDatepickerStart = () => {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );
  };

  #setDatepickerEnd = () => {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      }
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({dateFrom: userDate,});
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({dateTo: userDate,});
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const offerId = evt.target.value;
    const checked = evt.target.checked;

    const currentOffers = this._state.offers;

    let updatedOffers;

    if (checked) {
      updatedOffers = [...currentOffers, offerId];
    } else {
      updatedOffers = currentOffers.filter((id) => id !== offerId);
    }

    this._setState({
      offers: updatedOffers
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: Number(evt.target.value)
    });
  };

  #onDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteButtonClick(this._state);
  };
}
