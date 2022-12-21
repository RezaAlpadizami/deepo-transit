import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-transit';

class RequestApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.REQUEST);
  }
}

export default new RequestApi();
