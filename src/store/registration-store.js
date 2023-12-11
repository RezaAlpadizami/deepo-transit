import { types } from 'mobx-state-tree';

const RegistrationStore = types
  .model('RegistrationActivity', {
    dynamic_path: types.optional(types.string, 'dummy-data.txt'),
  })
  .actions(self => ({
    setDynamicPath(data) {
      self.dynamic_path = data;
    },
    getDynamicPath() {
      return self.dynamic_path;
    },
  }));

export default RegistrationStore;
