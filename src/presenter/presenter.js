import EditFormView from '../view/edit-form-view.js';
import FilterPanelView from '../view/filter-panel-view.js';
import RoutePointView from '../view/route-point-view.js';
import PointListView from '../view/point-list-view.js';
import SortPanelView from '../view/sort-panel-view.js';
import WholeTripView from '../view/whole-trip-view.js';
import { render, RenderPosition } from '../render.js';
export default class MainPresenter {
  constructor({ pointsModel }) {
    this.model = pointsModel;
    this.filterContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');
    this.mainContainer = document.querySelector('.trip-main');
  }

  init() {
    const { points, destinations, offers} = this.model;
    render(new WholeTripView(), this.mainContainer, RenderPosition.AFTERBEGIN);
    render(new FilterPanelView(), this.filterContainer);
    render(new SortPanelView(), this.eventsContainer, RenderPosition.AFTERBEGIN);

    const pointsListView = new PointListView();
    render(pointsListView, this.eventsContainer);
    const pointsListContainer = pointsListView.getElement();

    render(new EditFormView({point: points[0], destinations, offers}), pointsListContainer);

    points.forEach((point) => {
      render (new RoutePointView({point, destinations, offers}), pointsListContainer);
    });
  }
}
