import CreationFormView from '../view/creation-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import FilterPanelView from '../view/filter-panel-view.js';
import RoutePointView from '../view/route-point-view.js';
import SortPanelView from '../view/sort-panel-view.js';
import { render } from '../render.js';

export class HeaderPresenter {
  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new FilterPanelView(), this.container);
  }
}

export class MainPresenter {
  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new SortPanelView(), this.container);
    render(new EditFormView(), this.container);
    render(new CreationFormView(), this.container);
    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.container);
    }
  }
}
