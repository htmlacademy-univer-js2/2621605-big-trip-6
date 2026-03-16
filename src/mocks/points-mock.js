import { EVENT_TYPES } from '../data.js';
import { getRandomArrayElement, getRandomInteger } from '../utils/general-utils.js';
import { getRandomDate, getRandomEndDate } from '../utils/date-utils.js';
import { createDestinations } from './destinations-mock.js';
import { createOffers } from './offers-mock.js';


const createPoint = (destinations, offers) => {
  const type = getRandomArrayElement(EVENT_TYPES);
  const destination = getRandomArrayElement(destinations);

  const availableOffers = offers[type] || [];
  const selectedOffers = [];
  const offersCount = Math.min(getRandomInteger(0, 2), availableOffers.length);

  for (let i = 0; i < offersCount; i++) {
    const offer = getRandomArrayElement(availableOffers);
    if (!selectedOffers.includes(offer.id)) {
      selectedOffers.push(offer.id);
    }
  }

  const dateFrom = getRandomDate();
  const dateTo = getRandomEndDate(dateFrom);

  return {
    id: crypto.randomUUID(),
    type,
    destination: destination.id,
    dateFrom,
    dateTo,
    basePrice: getRandomInteger(20, 1000),
    offers: selectedOffers,
    isFavourite: Math.random() < 0.5
  };
};

const generateMockPoint = () => {
  const destinations = createDestinations();
  const offers = createOffers();
  const pointsCount = getRandomInteger(0, 5);
  const points = Array.from({length: pointsCount}, () => createPoint(destinations, offers));
  return { destinations, offers, points};
};

export { generateMockPoint };
