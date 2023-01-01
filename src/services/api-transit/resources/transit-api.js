import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-transit';

class TransitApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.TRANSIT);
  }

  inbound(body) {
    return new Promise((resolve, reject) => {
      this.api
        .post(`${this.url}/inbound`, body)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default new TransitApi();
