const SORTING_TYPES = {
  DAY: { type: 'day', enabled: true },
  EVENT: { type: 'event', enabled: false },
  TIME: { type: 'time', enabled: true },
  PRICE: { type: 'price', enabled: true },
  OFFER: { type: 'offer', enabled: false }
};

const EVENT_TYPE_ICONS = {
  taxi: 'img/icons/taxi.png',
  bus: 'img/icons/bus.png',
  train: 'img/icons/train.png',
  ship: 'img/icons/ship.png',
  transport: 'img/icons/transport.png',
  drive: 'img/icons/drive.png',
  flight: 'img/icons/flight.png',
  'check-in': 'img/icons/check-in.png',
  sightseeing: 'img/icons/sightseeing.png',
  restaurant: 'img/icons/restaurant.png'
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR','MAY', 'JUN', 'JUL', 'AUG','SEP', 'OCT', 'NOV', 'DEC'];

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const AUTHORIZATION = 'Basic 7gewd87twas1';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export {SORTING_TYPES, EVENT_TYPE_ICONS, EVENT_TYPES, MONTHS, Mode, UserAction, UpdateType, Method, END_POINT, AUTHORIZATION, TimeLimit};
