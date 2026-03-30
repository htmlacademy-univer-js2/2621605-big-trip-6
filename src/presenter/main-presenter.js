import FilterPanelView from '../view/filter-panel-view.js';
import PointListView from '../view/point-list-view.js';
import SortPanelView from '../view/sort-panel-view.js';
import WholeTripView from '../view/whole-trip-view.js';
import EmptyPointsListView from '../view/empty-points-list-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { generateFilters } from '../mocks/filter-mock.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/point-utils.js';

export default class MainPresenter {
  #model = null;
  #filterContainer = null;
  #eventsContainer = null;
  #mainContainer = null;
  #points = [];
  #pointsPresenter = new Map();

  constructor({ pointsModel }) {
    this.#model = pointsModel;
    this.#points = [...this.#model.points];
    this.#filterContainer = document.querySelector('.trip-controls__filters');
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#mainContainer = document.querySelector('.trip-main');
  }

  init() {
    const { points, destinations, offers } = this.#model;
    this.#renderWholeTrip();

    const filters = generateFilters(points);
    this.#renderFilterPanel(filters);

    if (!points || !points.length) {
      this.#renderEmptyPointsList();
    } else {
      this.#renderSortPanel();
      const pointsListView = new PointListView();
      this.#renderPointList(pointsListView);
      const pointsListContainer = pointsListView.element;

      points.forEach((point) => {
        const pointPresenter = new PointPresenter({
          destinations,
          offers,
          pointsListContainer,
          onDataChange: this.#handleDataChange,
          onModeChange: this.#handleModeChange
        });
        pointPresenter.init(point);
        this.#pointsPresenter.set(point.id, pointPresenter);
      });
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
    render(new SortPanelView(), this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointList(pointsListView) {
    render(pointsListView, this.#eventsContainer);
  }

  #handleDataChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };
}
