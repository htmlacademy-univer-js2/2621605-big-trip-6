import AbstractView from '../framework/view/abstract-view.js';

const sortPointsByDate = (points) => [...points].sort((a, b) =>
  new Date(a.dateFrom) - new Date(b.dateFrom)
);

const getRoutePoints = (points, destinations) =>
  points
    .map((point) => {
      const destination = destinations.find((d) => d.id === point.destination);
      return destination ? destination.name : '';
    })
    .filter(Boolean);

const getRouteTitle = (routePoints) => {
  if (routePoints.length === 0) {
    return 'Trip route';
  }

  if (routePoints.length <= 3) {
    return routePoints.join(' — ');
  }

  return `${routePoints[0]} — ... — ${routePoints[routePoints.length - 1]}`;
};

const formatTripDates = (points) => {
  if (points.length === 0) {
    return '';
  }

  const startDate = new Date(points[0].dateFrom);
  const endDate = new Date(points[points.length - 1].dateTo);

  const formatDate = (date) =>
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    }).toUpperCase();

  return `${formatDate(startDate)} — ${formatDate(endDate)}`;
};

const calculateTotalPrice = (points, offersByType) =>
  points.reduce((sum, point) => {
    const availableOffers = offersByType[point.type] || [];

    const selectedOffers = availableOffers.filter((offer) =>
      (point.offers || []).includes(offer.id)
    );

    const offersPrice = selectedOffers.reduce((s, offer) => s + offer.price, 0);

    const pointPrice = Number(point.basePrice) || 0;
    return sum + pointPrice + offersPrice;
  }, 0);

const createWholeTripTemplate = (points = [], offersByType = {}, destinations = []) => {
  const sortedPoints = sortPointsByDate(points);

  const routePoints = getRoutePoints(sortedPoints, destinations);
  const routeTitle = getRouteTitle(routePoints);
  const tripDates = formatTripDates(sortedPoints);
  const totalPrice = calculateTotalPrice(sortedPoints, offersByType);

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${routeTitle}</h1>
        <p class="trip-info__dates">${tripDates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>
  `;
};

export default class WholeTripView extends AbstractView {
  #points = [];
  #offers = {};
  #destinations = [];

  constructor({ points, offers, destinations }) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createWholeTripTemplate(this.#points, this.#offers, this.#destinations);
  }
}
