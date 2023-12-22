import { types } from 'mobx-state-tree';

const RegistrationStore = types
  .model('RegistrationActivity', {
    dynamic_path: types.optional(types.string, 'dummy-data.txt'),
    labelRegistered: types.optional(types.array(types.frozen()), []),
    productRegistered: types.optional(types.array(types.frozen()), []),
    dataRfid: types.optional(types.array(types.frozen()), []),
    dataListRegistered: types.optional(types.array(types.frozen()), []),
  })
  .actions(self => ({
    setDynamicPath(data) {
      self.dynamic_path = data;
    },
    getDynamicPath() {
      return self.dynamic_path;
    },
    setLabelRegistered(data) {
      self.labelRegistered = data;
    },
    getLabelRegistered() {
      return self.labelRegistered;
    },
    setProductRegistered(data) {
      self.productRegistered = data;
    },
    getProductRegistered() {
      return self.productRegistered;
    },
    setDataRfid(data) {
      self.dataRfid = data;
    },
    getDataRfid() {
      return self.dataRfid;
    },
    setDataListRegistered(data) {
      self.dataListRegistered = data;
    },
    getDataListRegistered() {
      return self.dataListRegistered;
    },
  }));

export default RegistrationStore;
