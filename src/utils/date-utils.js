import { MONTHS } from '../data.js';
import {getRandomInteger} from '../utils/general-utils.js';

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

export {getRandomDate, getRandomEndDate, getFormatedDate, getFormatedTime, formatDateTime, calculateTimeDuration};
