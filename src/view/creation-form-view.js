import { capitalizeFirstLetter } from '../utils/general-utils.js';
import { EVENT_TYPES } from '../data.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

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

const createCreationFormTemplate = (state, destinations = []) => {
  const {
    type,
    destination,
    basePrice
  } = state;

  const destinationsTemplate = destinations.map((place) => `
    <option value="${place.name}"></option>
  `).join('');

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post" autocomplete="off">
        <header class="event__header">

          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
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
              value="${destination}"
              list="destination-list-1"
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
              type="text"
              name="event-price"
              value="${basePrice}"
            >
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>

        </header>
      </form>
    </li>
  `;
};

export default class CreationFormView extends AbstractStatefulView {
  #destinations = null;

  constructor({ destinations = [] } = {}) {
    super();

    this.#destinations = destinations;

    this._setState({
      type: EVENT_TYPES[0],
      destination: '',
      basePrice: ''
    });

    this._restoreHandlers();
  }

  get template() {
    return createCreationFormTemplate(this._state, this.#destinations);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
  }

  #eventTypeChangeHandler = (evt) => {
    if (evt.target.name !== 'event-type') {
      return;
    }

    this.updateElement({
      type: evt.target.value
    });
  };

  #destinationChangeHandler = (evt) => {
    const selected = this.#destinations.find((dest) => dest.name === evt.target.value);
    this.updateElement({
      destination: selected.name
    });
  };

  #priceChangeHandler = (evt) => {
    this.updateElement({
      basePrice: evt.target.value
    });
  };

  reset() {
    this._setState({
      type: EVENT_TYPES[0],
      destination: '',
      basePrice: ''
    });

    this._restoreHandlers();
  }
}
