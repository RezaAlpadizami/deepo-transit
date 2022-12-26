import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-transit';

class RequestApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.REQUEST);
  }

  createRequestProcess(id) {
    return new Promise((resolve, reject) => {
      this.api
        .post(`${this.url}/process/${id}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default new RequestApi();
