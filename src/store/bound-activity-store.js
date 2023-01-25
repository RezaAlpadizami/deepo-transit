import { types } from 'mobx-state-tree';

const BoundActivity = types
  .model('BoundActivity', {
    request_number: types.optional(types.integer, 0),
    activity_name: types.optional(types.string, ''),
  })
  .actions(self => ({
    setRequestNumber(data) {
      self.request_number = data;
    },
    getRequestNumber() {
      return self.request_number;
    },
    setActivityName(data) {
      self.activity_name = data;
    },
    getActivityName() {
      return self.activity_name;
    },
  }));
export default BoundActivity;
