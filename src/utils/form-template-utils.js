import he from 'he';
import { capitalizeFirstLetter } from './general-utils.js';
import { EVENT_TYPES } from '../consts/consts.js';

const createEventTypeItemTemplate = (type, currentType) => `
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>

    <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">
      ${capitalizeFirstLetter(type)}
    </label>
  </div>
`;

const createEventTypeListTemplate = (currentType) => `
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>

      ${EVENT_TYPES.map((type) => createEventTypeItemTemplate(type, currentType)).join('')}
    </fieldset>
  </div>
`;

const createDestinationOptionsTemplate = (destinations) =>
  destinations.map((place) => `<option value="${place.name}"></option>`).join('');

const createOffersTemplate = (offerTypes, selectedOffers) => {
  if (!offerTypes.length) {
    return '';
  }

  return `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">
        Offers
      </h3>

      <div class="event__available-offers">
        ${offerTypes.map((offer) => `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${offer.id}"
              type="checkbox"
              name="event-offer-${offer.id}"
              value="${offer.id}"
              ${selectedOffers.includes(offer.id) ? 'checked' : ''}
            >

            <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title">
                ${offer.title}
              </span>

              &plus;&euro;&nbsp;

              <span class="event__offer-price">
                ${offer.price}
              </span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};

const createPicturesTemplate = (pictures) => {
  if (!pictures.length) {
    return '';
  }

  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `
          <img class="event__photo" src="${picture.src}" alt="${picture.description}">
        `).join('')}
      </div>
    </div>
  `;
};

const createDestinationSectionTemplate = (destination) => {
  if (!destination.description) {
    return '';
  }

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">
        Destination
      </h3>

      <p class="event__destination-description">
        ${destination.description}
      </p>

      ${createPicturesTemplate(destination.pictures)}
    </section>
  `;
};

const createDestinationFieldTemplate = ({type, destinationName, destinationsTemplate}) => `
  <div class="event__field-group event__field-group--destination">
    <label class="event__label event__type-output" for="event-destination-1">
      ${capitalizeFirstLetter(type)}
    </label>

    <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-1" required>

    <datalist id="destination-list-1">
      ${destinationsTemplate}
    </datalist>
  </div>
`;

const createPriceFieldTemplate = (basePrice) => `
  <div class="event__field-group event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>

    <input class="event__input event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
  </div>
`;

const createEditDateFieldsTemplate = ({formattedDate, timeFrom, timeTo}) => `
  <div class="event__field-group event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">
      From
    </label>

    <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedDate} ${timeFrom}">

    &mdash;

    <label class="visually-hidden" for="event-end-time-1">
      To
    </label>

    <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedDate} ${timeTo}">
  </div>
`;

const createCreationDateFieldsTemplate = () => `
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
`;

export {
  createEventTypeListTemplate,
  createDestinationOptionsTemplate,
  createOffersTemplate,
  createDestinationSectionTemplate,
  createDestinationFieldTemplate,
  createPriceFieldTemplate,
  createEditDateFieldsTemplate,
  createCreationDateFieldsTemplate
};
