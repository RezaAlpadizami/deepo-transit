import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class ProductInfoApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.PRODUCT_INFO);
  }
}

export default new ProductInfoApi();
