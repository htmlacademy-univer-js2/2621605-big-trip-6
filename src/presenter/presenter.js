import FilterPanelView from '../view/filter-panel-view.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointListView from '../view/point-list-view.js';
import SortPanelView from '../view/sort-panel-view.js';
import WholeTripView from '../view/whole-trip-view.js';
import EmptyPointsListView from '../view/empty-points-list-view.js';
import { render, RenderPosition, replace } from '../framework/render.js';
import { generateFilters } from '../mocks/filter-mock.js';

export default class MainPresenter {
  #model = null;
  #filterContainer = null;
  #eventsContainer = null;
  #mainContainer = null;

  constructor({ pointsModel }) {
    this.#model = pointsModel;
    this.#filterContainer = document.querySelector('.trip-controls__filters');
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#mainContainer = document.querySelector('.trip-main');
  }

  init() {
    const { points, destinations, offers} = this.#model;
    render(new WholeTripView(), this.#mainContainer, RenderPosition.AFTERBEGIN);
    const filters = generateFilters(points);
    render(new FilterPanelView({filters}), this.#filterContainer);
    if (!points || !points.length) {
      render(new EmptyPointsListView, this.#eventsContainer);
    } else {
      render(new SortPanelView(), this.#eventsContainer, RenderPosition.AFTERBEGIN);

      const pointsListView = new PointListView();
      render(pointsListView, this.#eventsContainer);
      const pointsListContainer = pointsListView.element;

      points.forEach((point) => {
        this.#renderPoint(point, destinations, offers, pointsListContainer);
      });
    }
  }

  #renderPoint(point, destinations, offers, pointsListContainer) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceToCommonPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const onOpenEditButtonClick = () => {
      replaceToEditPoint();
      document.addEventListener('keydown', escKeyDownHandler);
    };

    const onCloseEditButtonClick = () => {
      replaceToCommonPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const onSubmitButtonClick = () => {
      replaceToCommonPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const pointComponent = new RoutePointView({
      point,
      destinations,
      offers,
      onOpenEditButtonClick
    });

    const editPointComponent = new EditFormView({
      point,
      destinations,
      offers,
      onCloseEditButtonClick,
      onSubmitButtonClick
    });

    function replaceToEditPoint(){
      replace(editPointComponent, pointComponent);
    }

    function replaceToCommonPoint(){
      replace(pointComponent, editPointComponent);
    }

    render(pointComponent, pointsListContainer);
  }
}
