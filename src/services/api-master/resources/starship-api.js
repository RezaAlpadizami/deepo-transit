import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class StarshipApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.STARSHIP);
  }
}

export default new StarshipApi();
