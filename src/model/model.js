import { generateMockPoint } from '../mocks/points.js';

export default class PointsModel {
  constructor() {
    const mockPoint = generateMockPoint();
    this.points = mockPoint.points;
    this.destinations = mockPoint.destinations;
    this.offers = mockPoint.offers;
  }
}
