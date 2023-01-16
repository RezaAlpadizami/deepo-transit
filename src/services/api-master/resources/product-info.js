import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class ProductJourneyApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.PRODUCT_INFO);
  }
}

export default new ProductJourneyApi();
