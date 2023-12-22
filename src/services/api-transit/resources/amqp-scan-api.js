import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-transit';

class AmqpScanApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.AMQP_SCAN);
  }

  amqpScan(body) {
    return new Promise((resolve, reject) => {
      this.api
        .post(`${this.url}/scan`, body)
        .then(response => {
          if (response.ok) resolve(response);
          else reject(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default new AmqpScanApi();
