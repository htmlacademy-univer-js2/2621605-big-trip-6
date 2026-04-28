import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const mainPresenter = new MainPresenter({pointsModel, filterModel });

mainPresenter.init();
