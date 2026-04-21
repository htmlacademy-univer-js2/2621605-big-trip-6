import { MONTHS } from '../data.js';
import { getRandomInteger } from '../utils/general-utils.js';

const getRandomDate = () => {
  const date = new Date();

  date.setDate(date.getDate() + getRandomInteger(-31, 31));
  date.setHours(getRandomInteger(0, 23));
  date.setMinutes(getRandomInteger(0, 59));
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

const getRandomEndDate = (beginDate) => {
  const endDate = new Date(beginDate);
  const extraHours = getRandomInteger(1, 120);

  endDate.setHours(endDate.getHours() + extraHours);
  endDate.setMinutes(getRandomInteger(0, 59));
  endDate.setSeconds(0);
  endDate.setMilliseconds(0);

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

  const totalMinutes = Math.floor(msDiff / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}D ${hours}H ${minutes.toString().padStart(2, '0')}M`;
  }

  if (hours > 0) {
    return `${hours}H ${minutes.toString().padStart(2, '0')}M`;
  }

  return `${minutes}M`;
};

const isDatesEqual = (dateA, dateB) => {
  if (!dateA && !dateB) {
    return true;
  }

  if (!dateA || !dateB) {
    return false;
  }

  return new Date(dateA).getTime() === new Date(dateB).getTime();
};

export {getRandomDate, getRandomEndDate, getFormatedDate, getFormatedTime, formatDateTime, calculateTimeDuration, isDatesEqual};
