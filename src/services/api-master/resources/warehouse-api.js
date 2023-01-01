import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class WarehouseApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.WAREHOUSE);
  }
}

export default new WarehouseApi();
