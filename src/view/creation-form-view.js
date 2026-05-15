import { EVENT_TYPE_ICONS, MIN_PRICE } from '../consts/consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  createOffersTemplate,
  createDestinationSectionTemplate,
  createEventTypeListTemplate,
  createDestinationOptionsTemplate,
  createDestinationFieldTemplate,
  createPriceFieldTemplate
} from '../utils/form-template-utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DEFAULT_EVENT_TYPE = 'flight';

const createCreationFormTemplate = (state, destinations = [], offers = {}) => {
  const {
    type,
    destination: destinationId,
    basePrice,
    offers: selectedOffers
  } = state;

  const {isDeleting, isDisabled, isSaving} = state;

  const emptyDestination = {
    name: '',
    description: '',
    pictures: []
  };

  const destination = destinations.find((place) => place.id === destinationId) || emptyDestination;

  const offerTypes = offers[type] || [];

  const destinationsTemplate =
    createDestinationOptionsTemplate(destinations);

  const offersTemplate =
    createOffersTemplate(offerTypes, selectedOffers);

  const destinationDescriptionTemplate =
    createDestinationSectionTemplate(destination);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post" autocomplete="off">

        <header class="event__header">


          <div class="event__type-wrapper">

            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">
                Choose event type
              </span>

              <img class="event__type-icon" width="17" height="17" src="${EVENT_TYPE_ICONS[type]}" alt="Event type icon">
            </label>

            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            ${createEventTypeListTemplate(type)}
          </div>


          ${createDestinationFieldTemplate({
    type,
    destinationName: destination.name,
    destinationsTemplate
  })}

          <!-- time -->
          <div class="event__field-group event__field-group--time">

            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>

            <input class="event__input event__input--time" id="event-start-time-1" type="text" value="">

            &mdash;

            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>

            <input class="event__input event__input--time" id="event-end-time-1" type="text" value="">
          </div>


          ${createPriceFieldTemplate(basePrice)}


          <button class="event__save-btn btn btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>

          <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>
            Cancel
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
      type: DEFAULT_EVENT_TYPE,
      destination: '',
      basePrice: 0,
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

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  reset() {
    this._setState({
      type: DEFAULT_EVENT_TYPE,
      destination: '',
      basePrice: 0,
      offers: []
    });
  }

  #createDatepicker = ({elementSelector, defaultDate, onChange, minDate = null}) => (
    flatpickr(this.element.querySelector(elementSelector), {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      defaultDate,
      'time_24hr': true,
      minDate,
      onChange
    })
  );

  #setDatepickerStart = () => {
    this.#datepickerStart = this.#createDatepicker({
      elementSelector: '#event-start-time-1',
      defaultDate: this._state.dateFrom,
      onChange: this.#dateFromChangeHandler
    });
  };

  #setDatepickerEnd = () => {
    this.#datepickerEnd = this.#createDatepicker({
      elementSelector: '#event-end-time-1',
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom,
      onChange: this.#dateToChangeHandler
    });
  };

  #destroyDatepicker = (datepicker) => {
    if (!datepicker) {
      return;
    }

    datepicker.destroy();
  };

  removeElement() {
    this.#destroyDatepicker(this.#datepickerStart);
    this.#destroyDatepicker(this.#datepickerEnd);

    this.#datepickerStart = null;
    this.#datepickerEnd = null;

    super.removeElement();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const {basePrice, dateFrom, dateTo} = this._state;

    const isDatesInvalid = !dateFrom || !dateTo || dateFrom.getTime() >= dateTo.getTime();

    if (basePrice < MIN_PRICE || isDatesInvalid) {
      this.shake();
      return;
    }

    this.#onFormSubmit(this._state);
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick();
  };

  #eventTypeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestinations = this.#destinations.find((dest) => dest.name === evt.target.value);
    this.updateElement({
      destination: selectedDestinations ? selectedDestinations.id : ''
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: Number(evt.target.value)
    });
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const offerId = evt.target.value;
    const checked = evt.target.checked;
    const currentOffers = this._state.offers;

    const updatedOffers = checked ? [...currentOffers, offerId] : currentOffers.filter((id) => id !== offerId);

    this._setState({
      offers: updatedOffers
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({dateFrom: userDate});
    if (this.#datepickerEnd) {
      this.#datepickerEnd.set('minDate', userDate);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({dateTo: userDate});
  };
}
