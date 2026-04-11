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

const CITIES = ['Amsterdam', 'Geneva', 'Chamonix', 'Moscow', 'Saint-Petersburg', 'London', 'Beijin', 'Tokio', 'New-York', 'Paris'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];

const OFFER_TYPES = {
  taxi: ['Upgrade to a business class', 'Chose the radio station', 'Drive quickly, I\'m in a hurry'],
  bus: ['Infotainment system', 'Order meal', 'Choose seats'],
  train: ['Book a taxi at the arrival point', 'Order a breakfast', 'Wake up at a certain time'],
  flight: ['Choose meal', 'Choose seats', 'Upgrade to comfort class'],
  'check-in': ['Chose the time to check-in', 'add breakfast', 'Laundry'],
  sightseeing: [],
  ship: ['Choose meal', 'Choose seats', 'Upgrade to comfort class'],
  drive: ['With automatic transmission', 'With air conditioning'],
  restaurant: ['Choose live music', 'Choose VIP area']
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export {SORTING_TYPES, EVENT_TYPE_ICONS, EVENT_TYPES, CITIES, DESCRIPTIONS, OFFER_TYPES, MONTHS, Mode};
