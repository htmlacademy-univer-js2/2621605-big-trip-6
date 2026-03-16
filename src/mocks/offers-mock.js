import { EVENT_TYPES, OFFER_TYPES } from '../data.js';
import { getRandomInteger } from '../utils/general-utils.js';

const createOffers = () => {
  const offers = {};
  EVENT_TYPES.forEach((type) => {
    const typeOffers = OFFER_TYPES[type];
    if (typeOffers) {
      offers[type] = typeOffers.map((title, index) =>({
        id: `${type}-${index + 1}`,
        title,
        price: getRandomInteger(50, 200)
      }));
    }
  });

  return offers;
};


export{createOffers};
