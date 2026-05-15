import {getFormatedDate, getFormatedTime} from '../utils/date-utils.js';
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


const createEditFormTemplate = (state, destinations = [], offers = {}) => {
  const {
    type,
    destination: destinationId,
    dateFrom,
    dateTo,
    basePrice,
    offers: selectedOffers
  } = state;

  const {isDisabled, isSaving, isDeleting} = state;

  const destination =
    destinations.find((place) => place.id === destinationId) ||
    destinations[0] ||
    {
      name: '',
      description: '',
      pictures: []
    };

  const offerTypes = offers[type] || [];

  const destinationsTemplate =
    createDestinationOptionsTemplate(destinations);

  const offersTemplate =
    createOffersTemplate(offerTypes, selectedOffers);

  const destinationDescriptionTemplate =
    createDestinationSectionTemplate(destination);

  const formatedDate = getFormatedDate(dateFrom);
  const timeFrom = getFormatedTime(dateFrom);
  const timeTo = getFormatedTime(dateTo);

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


          ${createDestinationFieldTemplate({type,destinationName: destination.name,destinationsTemplate})}


          <div class="event__field-group event__field-group--time">

            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>

            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatedDate} ${timeFrom}">

            &mdash;

            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>

            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatedDate} ${timeTo}">
          </div>


          ${createPriceFieldTemplate(basePrice)}

          <button class="event__save-btn btn btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>

          <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>
            ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">
              Open event
            </span>
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
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditButtonClickHandler);

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);

    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  reset(point) {
    this.updateElement(point);
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

  #eventTypeChangeHandler = (evt) => {
    const newEventType = evt.target.value;
    this.updateElement({
      type: newEventType,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value);
    this.updateElement({
      destination: selectedDestination ? selectedDestination.id : ''
    });
  };

  #closeEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditButtonClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const {basePrice, dateFrom, dateTo} = this._state;

    const isDatesInvalid = !dateFrom || !dateTo || dateFrom.getTime() >= dateTo.getTime();

    if (basePrice < MIN_PRICE || isDatesInvalid) {
      this.shake();
      return;
    }

    this.#onSubmitButtonClick(this._state);
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

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteButtonClick(this._state);
  };
}
