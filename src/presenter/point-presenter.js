import { Mode, UpdateType, UserAction } from '../consts/consts.js';
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
      onOpenEditButtonClick: this.#editButtonOpenHandler,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#editPointComponent = new EditFormView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onCloseEditButtonClick: this.#editButtonCloseHandler,
      onSubmitButtonClick: this.#submitButtonClickHandler,
      onDeleteButtonClick: this.#deleteClickHandler
    });

    if (prevPointComponent === null || prevEditPointComponent === null){
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT){
      replace(this.#pointComponent, prevPointComponent);
    } else {
      replace(this.#editPointComponent, prevEditPointComponent);
      this.#mode = Mode.DEFAULT;
      this.#replaceToCommonPoint();
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
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceToCommonPoint();
    }
  };

  #editButtonOpenHandler = () => {
    this.#replaceToEditPoint();
  };

  #editButtonCloseHandler = () => {
    this.#replaceToCommonPoint();
  };

  #submitButtonClickHandler = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, update.dateTo) ||
      this.#point.basePrice !== update.basePrice;

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
  };

  #favoriteClickHandler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #deleteClickHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
