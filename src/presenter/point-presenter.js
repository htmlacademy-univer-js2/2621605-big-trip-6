import { Mode, UpdateType, UserAction } from '../data.js';
import { render, replace, remove } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import { isDatesEqual } from '../utils/date-utils.js';

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
      onSubmitButtonClick: this.#onSubmitButtonClickHandler,
      onDeleteButtonClick: this.#onDeleteClickHandler
    });

    if (prevPointComponent === null || prevEditPointComponent === null){
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
    }
  };

  #onOpenEditButtonClickHandler = () => {
    this.#replaceToEditPoint();
  };

  #onCloseEditButtonClickHandler = () => {
    this.#replaceToCommonPoint();
  };

  #onSubmitButtonClickHandler = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, update.dateTo) ||
      this.#point.basePrice !== update.basePrice;

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );

    this.#replaceToCommonPoint();
  };

  #replaceToEditPoint(){
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceToCommonPoint(){
    this.#editPointComponent.reset(this.#point);
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #onFavoriteClickHandler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavourite: !this.#point.isFavourite}
    );
  };

  #onDeleteClickHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
