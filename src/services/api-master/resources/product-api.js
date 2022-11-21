import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class ProductApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.PRODUCT);
  }
}

export default new ProductApi();
