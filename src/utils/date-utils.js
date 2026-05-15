import { MONTHS } from '../consts/consts.js';
import { TIME_STRING_LENGTH, DATE_TIME_LENGTH, MILLISECONDS_IN_MINUTE, MINUTES_IN_HOUR, HOURS_IN_DAY } from '../consts/date-consts.js';

const getFormatedDate = (date) => {
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return `${day} ${month}`;
};

const getFormatedTime = (time) =>
  time.toTimeString().slice(0, TIME_STRING_LENGTH);

const formatDateTime = (date) =>
  date.toISOString().slice(0, DATE_TIME_LENGTH);

const calculateTimeDuration = (from, to) => {
  const msDiff = to - from;

  const totalMinutes = Math.floor(msDiff / MILLISECONDS_IN_MINUTE);

  const days = Math.floor(totalMinutes / (MINUTES_IN_HOUR * HOURS_IN_DAY));

  const hours = Math.floor(
    (totalMinutes % (MINUTES_IN_HOUR * HOURS_IN_DAY)) / MINUTES_IN_HOUR
  );

  const minutes = totalMinutes % MINUTES_IN_HOUR;

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

export {getFormatedDate, getFormatedTime, formatDateTime, calculateTimeDuration, isDatesEqual};
