import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class RequestApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.REQUEST);
  }

  createRequestProcess(id) {
    return new Promise((resolve, reject) => {
      this.store(`${this.url}/process/${id}`)
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
