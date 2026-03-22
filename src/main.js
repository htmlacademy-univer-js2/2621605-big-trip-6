import PointsModel from './model/model.js';
import MainPresenter from './presenter/main-presenter.js';

const pointsModel = new PointsModel();
const mainPresenter = new MainPresenter({pointsModel});

mainPresenter.init();
