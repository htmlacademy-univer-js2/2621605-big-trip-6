import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';
import PointsApiService from './services/points-api-service.js';
import { END_POINT, AUTHORIZATION } from './consts.js';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({ pointsApiService });
const filterModel = new FilterModel();
const mainPresenter = new MainPresenter({ pointsModel, filterModel });

mainPresenter.init();
pointsModel.init();
