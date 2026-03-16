import { EVENT_TYPES, CITIES, DESCRIPTIONS } from '../data.js';
import {getRandomArrayElement, getRandomInteger} from '../utils/general-utils.js';
import dayjs from 'dayjs';

const getRandomCity = () => getRandomArrayElement(CITIES);

const getRandomType = () => getRandomArrayElement(EVENT_TYPES);

const getRandomDescription = () => {
  const sentencesCount = getRandomInteger(1, 5);
  const descriptionSentences = [];
  for (let i = 0; i < sentencesCount; i++) {
    descriptionSentences.push(getRandomArrayElement(DESCRIPTIONS));
  }
  return descriptionSentences.join(' ');
};

const getRandomPhoto = () => {
  const id = getRandomInteger(1, 5);
  return `https://loremflickr.com/248/152?random=${id}`;
};

const createPicture = (index) => ({
  src: getRandomPhoto(),
  description: `${index + 1} picture`
});

const generatePictures = () => {
  const photosCount = getRandomInteger(1, 5);
  return Array.from({ length: photosCount }, (_, i) => createPicture(i));
};

const isFuturePoint = (point) => dayjs().isBefore(point.dateFrom, 'minute');

const isExpiredPoint = (point) => dayjs(point.dateTo) && dayjs().isAfter(point.dateTo, 'milliseconds');

const isActualPoint = (point) => point.dateTo && (dayjs().isSame(dayjs(point.dateFrom), 'minute')) || dayjs().isAfter(point.dateTo, 'milliseconds');

export {getRandomCity, getRandomType,getRandomDescription, getRandomPhoto,
  generatePictures, isFuturePoint, isActualPoint, isExpiredPoint};
