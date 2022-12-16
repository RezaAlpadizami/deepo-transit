import React from 'react';
import RequestApi from '../../../services/api-transit';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName } = props;

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'request_number',
            label: 'Request Number',
            col: 3,
          },
          {
            name: 'request_by',
            label: 'User',
            col: 3,
          },
          {
            name: 'activity_name',
            label: 'Activity',
            col: 2,
          },
          {
            name: 'activity_date',
            label: 'Date',
            type: 'date_picker',
            placeholder: 'Select date',
            col: 2,
          },
          {
            name: 'status',
            label: 'Status',
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
