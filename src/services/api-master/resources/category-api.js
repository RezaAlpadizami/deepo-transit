import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class CategoryApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.CATEGORY);
  }
}

export default new CategoryApi();
