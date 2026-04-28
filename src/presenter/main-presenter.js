import PointListView from '../view/point-list-view.js';
import SortPanelView from '../view/sort-panel-view.js';
import WholeTripView from '../view/whole-trip-view.js';
import EmptyPointsListView from '../view/empty-points-list-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { SORTING_TYPES } from '../data.js';
import FilterPresenter from './filter-presenter.js';
import { FilterPoint, filter } from '../filter-const.js';
import { UserAction, UpdateType } from '../data.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import NewPointPresenter from './new-point-presenter.js';

export default class MainPresenter {
  #pointsModel = null;
  #filterModel = null;
  #filterContainer = null;
  #eventsContainer = null;
  #mainContainer = null;
  #pointsPresenter = new Map();
  #sortType = SORTING_TYPES.DAY.type;
  #emptyPointComponent = null;
  #wholeTripComponent = null;
  #sortComponent = null;
  #newPointPresenter = null;
  #newPointButtonComponent = null;

  constructor({ pointsModel, filterModel }) {
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#filterContainer = document.querySelector('.trip-controls__filters');
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#mainContainer = document.querySelector('.trip-main');

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

    return filteredPoints;
  }

  init() {
    const { points } = this.#pointsModel;

    this.#renderWholeTrip();

    this.#renderFilterPanel();

    this.#renderNewPointButton();

    if (!points.length) {
      const pointsListView = new PointListView();
      this.#renderPointList(pointsListView);

      this.#renderEmptyPointsList();

      this.#initNewPointPresenter();

    } else {
      const pointsListView = new PointListView();
      this.#renderPointList(pointsListView);

      this.#renderSortPanel();
      this.#renderSortedPoints(this.#sortType);

      this.#initNewPointPresenter();
    }
  }

  #renderWholeTrip() {
    this.#wholeTripComponent = new WholeTripView({
      points: this.points,
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations
    });

    render(this.#wholeTripComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNewPointButton() {
    const existingButton = this.#mainContainer.querySelector('.trip-main__event-add-btn');
    if (existingButton) {
      existingButton.remove();
    }
    this.#newPointButtonComponent = new NewPointButtonView({onClick: this.#handleNewPointButtonClick});
    render(this.#newPointButtonComponent, this.#mainContainer);
  }

  #handleNewPointButtonClick = () => {
    this.#handleModeChange();
    this.#createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleNewPointClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #enableNewPointButton = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #createPoint = () => {
    this.#sortType = SORTING_TYPES.DAY.type;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterPoint.EVERYTHING);

    if (!this.#newPointPresenter) {
      this.#initNewPointPresenter();
    }

    this.#newPointPresenter.init();
  };

  #renderFilterPanel() {
    const filterPresenter = new FilterPresenter({
      filterContainer: this.#filterContainer,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel
    });

    filterPresenter.init();
  }

  #renderEmptyPointsList() {
    this.#emptyPointComponent = new EmptyPointsListView({
      filterType: this.#filterModel.filter
    });
    render(this.#emptyPointComponent, this.#eventsContainer);
  }

  #initNewPointPresenter() {
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventsContainer.querySelector('.trip-events__list'),
      onDataChange: this.#handleViewAction,
      onDestroy: this.#enableNewPointButton,
      allOffers: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations
    });
  }

  #renderSortPanel() {
    this.#sortComponent = new SortPanelView({
      onSortChange: this.#handleSortChange,
      activeSortType: this.#sortType
    });
    render(this.#sortComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #updateSortPanel() {
    remove(this.#sortComponent);

    this.#sortComponent = new SortPanelView({
      onSortChange: this.#handleSortChange,
      activeSortType: SORTING_TYPES.DAY.type
    });

    render(this.#sortComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
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
        destinations: this.#pointsModel.destinations,
        offers: this.#pointsModel.offers,
        pointsListContainer,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange
      });
      pointPresenter.init(point);
      this.#pointsPresenter.set(point.id, pointPresenter);
    });
  }

  #handleDataChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(UpdateType.PATCH, updatedPoint);
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
      case 'day':
        sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;

      case 'time':
        sortedPoints.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
        break;

      case 'price':
        sortedPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;

      default:
        sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;
    }
    return sortedPoints;
  };

  #renderSortedPoints = (sortType) => {
    const sortedPoints = this.#sortPoints(this.points, sortType);
    this.#renderPointsList(sortedPoints);
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    if (resetSortType) {
      this.#sortType = SORTING_TYPES.DAY.type;
    }

    if (this.#emptyPointComponent) {
      remove(this.#emptyPointComponent);
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, update) => {
    remove(this.#wholeTripComponent);
    this.#renderWholeTrip();

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenter.get(update.id).init(update);
        break;

      case UpdateType.MINOR:
        this.#updateSortPanel();
        this.#clearBoard({ resetSortType: true });
        this.#renderSortedPoints(this.#sortType);
        break;

      case UpdateType.MAJOR:
        this.#updateSortPanel();
        this.#clearBoard({ resetSortType: true });
        this.#renderSortedPoints(this.#sortType);
        break;
    }
  };
}
