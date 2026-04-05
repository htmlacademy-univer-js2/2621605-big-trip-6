import FilterPanelView from '../view/filter-panel-view.js';
import PointListView from '../view/point-list-view.js';
import SortPanelView from '../view/sort-panel-view.js';
import WholeTripView from '../view/whole-trip-view.js';
import EmptyPointsListView from '../view/empty-points-list-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { generateFilters } from '../mocks/filter-mock.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/point-utils.js';
import { SORTING_TYPES } from '../data.js';

export default class MainPresenter {
  #model = null;
  #filterContainer = null;
  #eventsContainer = null;
  #mainContainer = null;
  #points = [];
  #pointsPresenter = new Map();
  #sortType = SORTING_TYPES.DAY;

  constructor({ pointsModel }) {
    this.#model = pointsModel;
    this.#points = [...this.#model.points];
    this.#filterContainer = document.querySelector('.trip-controls__filters');
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#mainContainer = document.querySelector('.trip-main');
  }

  init() {
    const { points } = this.#model;
    this.#renderWholeTrip();

    const filters = generateFilters(points);
    this.#renderFilterPanel(filters);

    if (!points || !points.length) {
      this.#renderEmptyPointsList();
    } else {
      const pointsListView = new PointListView();
      this.#renderPointList(pointsListView);

      this.#renderSortPanel();

      this.#renderPointsList(points);
    }
  }

  #renderWholeTrip() {
    render(new WholeTripView(), this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFilterPanel(filters) {
    render(new FilterPanelView({ filters }), this.#filterContainer);
  }

  #renderEmptyPointsList() {
    render(new EmptyPointsListView(), this.#eventsContainer);
  }

  #renderSortPanel() {
    render(new SortPanelView({ onSortChange: this.#handleSortChange }), this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointList(pointsListView) {
    render(pointsListView, this.#eventsContainer);
  }

  #renderPointsList(points) {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    const pointsListContainer = this.#eventsContainer.querySelector('.trip-events__list');

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        destinations: this.#model.destinations,
        offers: this.#model.offers,
        pointsListContainer,
        onDataChange: this.#handleDataChange,
        onModeChange: this.#handleModeChange
      });
      pointPresenter.init(point);
      this.#pointsPresenter.set(point.id, pointPresenter);
    });
  }

  #handleDataChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortingType) => {
    this.#sortType = sortingType;
    this.#renderSortedPoints(sortingType);
  };

  #sortPoints = (points, sortType) => {
    const sortedPoints = [...points];

    switch (sortType) {
      case SORTING_TYPES.DAY:
        sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;

      case SORTING_TYPES.TIME:
        sortedPoints.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
        break;

      case SORTING_TYPES.PRICE:
        sortedPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;

      default:
        sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;
    }
    return sortedPoints;
  };

  #renderSortedPoints = (sortType) => {
    const sortedPoints = this.#sortPoints(this.#model.points, sortType);
    this.#renderPointsList(sortedPoints);
  };
}
