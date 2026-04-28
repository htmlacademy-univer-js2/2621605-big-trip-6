import { capitalizeFirstLetter } from '../utils/general-utils.js';
import { EVENT_TYPES, EVENT_TYPE_ICONS } from '../data.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const createEventTypeItemTemplate = (type, currentType) => {
  const capitalizedType = capitalizeFirstLetter(type);

  return `
    <div class="event__type-item">
      <input
        id="event-type-${type}-1"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${type === currentType ? 'checked' : ''}
      >
      <label
        class="event__type-label event__type-label--${type}"
        for="event-type-${type}-1"
      >
        ${capitalizedType}
      </label>
    </div>
  `;
};

const createEventTypeTemplate = (currentType) => `
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${EVENT_TYPES.map((type) => createEventTypeItemTemplate(type, currentType)).join('')}
    </fieldset>
  </div>
`;

const createCreationFormTemplate = (state, destinations = [], offers = {}) => {
  const {
    type,
    destination: destinationId,
    basePrice,
    offers: selectedOffers
  } = state;
  const destination = destinations.find((place) => place.id === destinationId)
    || {name: '', description: '', pictures: []};
  const offerTypes = offers[type] || [];
  const listSelectedOffers = offerTypes.filter((offer) => selectedOffers.includes(offer.id));

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
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${EVENT_TYPE_ICONS[type]}" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

            ${createEventTypeTemplate(type)}
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
            </label>

            <input
              class="event__input event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${he.encode(destination ? `${destination.name}` : '')}"
              list="destination-list-1"
              required
            >

            <datalist id="destination-list-1">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" value="">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" value="">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>

            <input
              class="event__input event__input--price"
              id="event-price-1"
              type="number"
              name="event-price"
              value="${basePrice}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationDescriptionTemplate}
        </section>
      </form>
    </li>
  `;
};

export default class CreationFormView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #onFormSubmit = null;
  #onDeleteClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({ destinations = [], offers = {}, onFormSubmit, onDeleteClick } = {}) {
    super();

    this.#destinations = destinations;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onDeleteClick = onDeleteClick;

    this._setState({
      type: 'flight',
      destination: '',
      basePrice: 0,
      dateFrom: new Date(),
      dateTo: new Date(),
      offers: []
    });

    this._restoreHandlers();
  }

  get template() {
    return createCreationFormTemplate(this._state, this.#destinations, this.#offers);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #eventTypeChangeHandler = (evt) => {
    if (evt.target.name !== 'event-type') {
      return;
    }

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const selected = this.#destinations.find((dest) => dest.name === evt.target.value);
    this.updateElement({
      destination: selected ? selected.id : ''
    });
  };

  #priceChangeHandler = (evt) => {
    const sanitizedValue = evt.target.value.replace(/\D/g, '');
    evt.target.value = sanitizedValue;
    this._setState({
      basePrice: sanitizedValue === '' ? 0 : Number(sanitizedValue)
    });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const offerId = evt.target.value;
    const checked = evt.target.checked;
    const currentOffers = this._state.offers;

    const updatedOffers = checked
      ? [...currentOffers, offerId]
      : currentOffers.filter((id) => id !== offerId);

    this._setState({
      offers: updatedOffers
    });
  };

  reset() {
    this._setState({
      type: 'flight',
      destination: '',
      basePrice: 0,
      offers: []
    });

    this._restoreHandlers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const normalizedPrice = Number(this._state.basePrice);
    this.#onFormSubmit({
      ...this._state,
      basePrice: Number.isFinite(normalizedPrice) && normalizedPrice > 0 ? Math.trunc(normalizedPrice) : 0
    });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick();
  };

  #setDatepickerStart = () => {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        'time_24hr': true,
        onChange: this.#dateFromChangeHandler
      }
    );
  };

  #setDatepickerEnd = () => {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        'time_24hr': true,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler
      }
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
  };

  removeElement() {
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }

    super.removeElement();
  }
}
