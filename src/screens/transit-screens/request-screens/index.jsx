import React from 'react';

import { RequestApi } from '../../../services/api-transit';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName } = props;

  const activityProduct = [
    { activity_name: 'INBOUND' },
    { activity_name: 'OUTBOUND' },
    { activity_name: 'RELOCATE-IN' },
    { activity_name: 'RELOCATE-OUT' },
  ];
  const statusRequest = [{ status: 'PENDING' }, { status: 'PROCESS' }, { status: 'COMPLETED' }];

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'request_number',
            label: 'Request Number',
            col: 2,
          },
          {
            name: 'request_by',
            label: 'User',
            col: 2,
          },
          {
            name: 'activity_name',
            label: 'Activity',
            type: 'select',
            data: activityProduct?.map(i => {
              return {
                value: i.activity_name,
                label: i.activity_name,
              };
            }),
            col: 2,
          },
          {
            name: 'date_from',
            label: 'Date From',
            type: 'date_picker',
            placeholder: 'Select date',
            col: 2,
          },
          {
            name: 'date_to',
            label: 'Date To',
            type: 'date_picker',
            placeholder: 'Select date',
            col: 2,
          },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            data: statusRequest?.map(i => {
              return {
                value: i.status,
                label: i.status,
              };
            }),
            col: 2,
          },
        ]}
        columns={[
          { header: 'Request Number', value: 'request_number', copy: true, type: 'link' },
          { header: 'User', value: 'request_by', copy: true },
          { header: 'Activity', value: 'activity_name', copy: true },
          { header: 'Date', value: 'activity_date', copy: true, type: 'date' },
          { header: 'Notes', value: 'notes', copy: true, type: 'scrollable' },
          { header: 'Status', value: 'status', copy: true },
        ]}
        toolbar={{
          action: {
            add: true,
            edit: true,
            delete: true,
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={RequestApi}
        to={route}
        displayName={displayName}
        checkbox
        hasButtonAction
      />
    </div>
  );
}
export default Screen;
