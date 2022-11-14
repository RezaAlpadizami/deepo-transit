import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class CityApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.PLANET);
  }
}

export default new CityApi();
