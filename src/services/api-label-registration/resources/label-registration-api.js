import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-transit';

class LabelRegistrationApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.LABEL_REGISTRATION);
  }

  labelRegister(body) {
    return new Promise((resolve, reject) => {
      this.api
        .post(`${this.url}/bulk`, body)
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

export default new LabelRegistrationApi();
