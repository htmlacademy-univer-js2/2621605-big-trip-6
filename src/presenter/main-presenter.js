import PointListView from '../view/point-list-view.js';
import SortPanelView from '../view/sort-panel-view.js';
import WholeTripView from '../view/whole-trip-view.js';
import EmptyPointsListView from '../view/empty-points-list-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { SORTING_TYPES, TimeLimit, UserAction, UpdateType} from '../consts/consts.js';
import FilterPresenter from './filter-presenter.js';
import { FilterType, filter } from '../consts/filter-consts.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import LoadingErrorView from '../view/loading-error-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortingTypes } from '../utils/sort-utils.js';

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
  #loadingComponent = null;
  #loadingErrorComponent = null;
  #pointListComponent = new PointListView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.MIN_TIMEOUT,
    upperLimit: TimeLimit.MAX_TIMEOUT
  });

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
    return filter[filterType](points);
  }

  init() {
    this.#renderWholeTrip();
    this.#renderFilterPanel();
    this.#renderNewPointButton();
    this.#renderLoading();
  }

  #renderWholeTrip() {
    const allPoints = this.#pointsModel.points;

    if (!allPoints.length) {
      return;
    }

    this.#wholeTripComponent = new WholeTripView({
      points: allPoints,
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations
    });

    render(this.#wholeTripComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNewPointButton() {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick
    });

    render(this.#newPointButtonComponent, this.#mainContainer);
    this.#newPointButtonComponent.element.disabled = true;
  }

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#eventsContainer);
  }

  #renderLoadingError() {
    this.#loadingErrorComponent = new LoadingErrorView();
    render(this.#loadingErrorComponent, this.#eventsContainer);
  }

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

  #renderSortPanel() {
    this.#sortComponent = new SortPanelView({
      onSortChange: this.#handleSortChange,
      activeSortType: this.#sortType
    });
    render(this.#sortComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointList() {
    render(this.#pointListComponent, this.#eventsContainer);
  }

  #renderPointsList(points) {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    const pointsListContainer = this.#pointListComponent.element;

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

  #renderBoard = () => {
    this.#renderPointList();

    if (!this.points.length) {
      remove(this.#sortComponent);
      this.#renderEmptyPointsList();
      return;
    }

    this.#renderSortPanel();
    this.#renderSortedPoints(this.#sortType);
  };

  #renderSortedPoints = (sortType) => {
    const sortedPoints = this.#sortPoints(this.points, sortType);
    this.#renderPointsList(sortedPoints);
  };

  #enableNewPointButton = () => {
    this.#newPointButtonComponent.element.disabled = false;
    if (!this.points.length) {
      this.#renderEmptyPointsList();
    }
  };

  #createPoint = () => {
    this.#sortType = SORTING_TYPES.DAY.type;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (!this.#newPointPresenter) {
      this.#initNewPointPresenter();
    }
    remove(this.#emptyPointComponent);
    this.#newPointPresenter.init();
  };

  #sortPoints = (points, currentSortType) =>
    [...points].sort(sortingTypes[currentSortType]);


  #clearBoard({resetSortType = false} = {}) {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#emptyPointComponent);

    if (resetSortType) {
      this.#sortType = SORTING_TYPES.DAY.type;
    }
  }

  #initNewPointPresenter() {
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#enableNewPointButton,
      allOffers: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations
    });
  }

  #handleNewPointButtonClick = () => {
    this.#handleModeChange();
    this.#createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleModeChange = () => {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortingType) => {
    this.#sortType = sortingType;
    this.#renderSortedPoints(sortingType);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointsPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, update) => {
    remove(this.#wholeTripComponent);
    this.#renderWholeTrip();

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenter.get(update.id).init(update);
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;

      case UpdateType.INIT: {
        remove(this.#loadingComponent);
        remove(this.#loadingErrorComponent);

        this.#clearBoard();

        if (this.#pointsModel.isLoadingError) {
          this.#newPointButtonComponent.element.disabled = true;
          this.#renderLoadingError();
          return;
        }
        this.#newPointButtonComponent.element.disabled = false;
        this.#renderBoard();

        break;
      }
    }
  };
}
