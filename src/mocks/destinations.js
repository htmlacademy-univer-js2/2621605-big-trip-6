import { CITIES, DESCRIPTIONS } from '../data.js';
import {getRandomDescription, generatePictures } from '../utils.js';

const createDestinations = () => CITIES.map((city) => ({
  id: city.toLowerCase(),
  name: city,
  description: getRandomDescription(DESCRIPTIONS),
  pictures: generatePictures()
}));

export{createDestinations};
