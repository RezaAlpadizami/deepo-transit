import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class ProductJourneyAPI extends RequestHandler {
  constructor() {
    super(ENDPOINT.PRODUCT_JOURNEY);
  }
}

export default new ProductJourneyAPI();
