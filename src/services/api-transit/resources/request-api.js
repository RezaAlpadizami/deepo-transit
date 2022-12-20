import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class RequestApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.REQUEST);
  }

  createRequestProcess(request_number) {
    return new Promise((resolve, reject) => {
      this.store(`${this.url}/process/${encodeURIComponent(request_number)}`)
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
