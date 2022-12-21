import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class StorageApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.STORAGE);
  }
}

export default new StorageApi();
