import { EVENT_TYPES, CITIES, DESCRIPTIONS, MONTHS } from './data.js';

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

const getRandomDate = () => {
  const currentDate = new Date();
  const finalDate = new Date();
  finalDate.setDate(currentDate.getDate() + getRandomInteger(1, 31));
  finalDate.setHours(getRandomInteger(0, 23) + getRandomInteger (0, 59));
  return finalDate;
};

const getRandomEndDate = (beginDate) => {
  const endDate = new Date(beginDate);
  endDate.setHours(endDate.getHours() + getRandomInteger(1, 12));
  endDate.setMinutes(getRandomInteger (0, 59));
  return endDate;
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

const getFormatedDate = (date) => {
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return `${day} ${month}`;
};

const getFormatedTime = (time) => time.toTimeString().slice(0, 5);

const formatDateTime = (date) => date.toISOString().slice(0, 16);

const calculateTimeDuration = (from, to) => {
  const msDiff = to - from;

  const minutesDiff = Math.floor(msDiff / (1000 * 60));
  const hours = Math.floor(minutesDiff / 60);
  const minutes = minutesDiff % 60;

  if (hours > 0) {
    return `${hours}H ${minutes.toString().padStart(2, '0')}M`;
  }
  return `${minutes}M`;
};

export {capitalizeFirstLetter, getRandomArrayElement, getRandomInteger, getRandomCity, getRandomType,
  getRandomDescription, getRandomDate, getRandomEndDate, getRandomPhoto, generatePictures,
  getFormatedDate, getFormatedTime, formatDateTime, calculateTimeDuration};
