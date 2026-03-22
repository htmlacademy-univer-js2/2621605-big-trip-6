import { Mode } from '../data.js';
import { render, replace, remove } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import RoutePointView from '../view/route-point-view.js';

export default class PointPresenter {
  #pointsListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({destinations, offers, pointsListContainer, onDataChange, onModeChange}){
    this.#pointsListContainer = pointsListContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new RoutePointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onOpenEditButtonClick: this.#onOpenEditButtonClickHandler,
      onFavoriteClick: this.#onFavoriteClickHandler
    });

    this.#editPointComponent = new EditFormView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onCloseEditButtonClick: this.#onCloseEditButtonClickHandler,
      onSubmitButtonClick: this.#onSubmitButtonClickHandler
    });

    if (!prevPointComponent || !prevEditPointComponent){
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT){
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING){
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT){
      this.#replaceToCommonPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceToCommonPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #onOpenEditButtonClickHandler = () => {
    this.#replaceToEditPoint();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #onCloseEditButtonClickHandler = () => {
    this.#replaceToCommonPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #onSubmitButtonClickHandler = (point) => {
    this.#handleDataChange(point);
    this.#replaceToCommonPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceToEditPoint(){
    replace(this.#editPointComponent, this.#pointComponent);
  }

  #replaceToCommonPoint(){
    replace(this.#pointComponent, this.#editPointComponent);
  }

  #onFavoriteClickHandler = () => {
    this.#handleDataChange({
      ...this.#point,
      isFavourite: !this.#point.isFavourite
    });
  };
}
