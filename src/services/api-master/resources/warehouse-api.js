import LocalStorage from 'local-storage';
import RequestHandler from '../request-handler';
import ENDPOINT from '../../../config/api-master';

class WarehouseApi extends RequestHandler {
  constructor() {
    super(ENDPOINT.PLANET);
  }

  submit(id) {
    return new Promise((resolve, reject) => {
      this.api
        .put(`${this.url}/${encodeURIComponent(id)}/submit`)
        .then(response => {
          if (response.ok) resolve(response.data);
          else {
            reject(RequestHandler.defaultErrorResponse(response));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  approve(id) {
    return new Promise((resolve, reject) => {
      this.api
        .put(`${this.url}/${encodeURIComponent(id)}/approve`)
        .then(response => {
          if (response.ok) resolve(response.data);
          else {
            reject(RequestHandler.defaultErrorResponse(response));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  reject(id, body) {
    return new Promise((resolve, reject) => {
      this.api
        .put(`${this.url}/${encodeURIComponent(id)}/reject`, body)
        .then(response => {
          if (response.ok) resolve(response.data);
          else {
            reject(RequestHandler.defaultErrorResponse(response));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  archived(id) {
    return new Promise((resolve, reject) => {
      this.api
        .put(`${this.url}/${encodeURIComponent(id)}/archive`)
        .then(response => {
          if (response.ok) resolve(response.data);
          else {
            reject(RequestHandler.defaultErrorResponse(response));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  reopen(id) {
    return new Promise((resolve, reject) => {
      this.api
        .put(`${this.url}/${encodeURIComponent(id)}/reopen`)
        .then(response => {
          if (response.ok) resolve(response.data);
          else reject(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  duplicate(body) {
    return new Promise((resolve, reject) => {
      this.api
        .post(`${this.url}/duplicate`, body, {
          params: {
            state: LocalStorage.get('is_mock') ? 'mock' : 'default',
          },
        })
        .then(response => {
          if (response.ok) resolve(response.data);
          else {
            reject(RequestHandler.defaultErrorResponse(response));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getDataBy(id, params) {
    return new Promise((resolve, reject) => {
      this.api
        .get(`${this.url}/${encodeURIComponent(id)}`, {
          ...params,
        })
        .then(response => {
          if (response.ok) resolve(response.data);
          else reject(RequestHandler.defaultErrorResponse(response));
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default new WarehouseApi();
