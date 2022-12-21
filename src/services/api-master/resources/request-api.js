import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class RequestApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.STORAGE);
  }
}

export default new RequestApi();
