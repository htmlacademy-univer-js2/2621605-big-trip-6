import dayjs from 'dayjs';

const isFuturePoint = (point) => dayjs().isBefore(point.dateFrom, 'minute');

const isExpiredPoint = (point) => point.dateTo && dayjs().isAfter(point.dateTo, 'millisecond');

const isActualPoint = (point) => point.dateTo && (dayjs().isAfter(point.dateFrom, 'minute') && dayjs().isBefore(point.dateTo, 'minute'));

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export {isFuturePoint, isActualPoint, isExpiredPoint, updateItem};
