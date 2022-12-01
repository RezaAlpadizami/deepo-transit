import React from 'react';
import { WarehouseApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName } = props;

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'code',
            label: 'Code',
          },
          {
            name: 'name',
            label: 'Name',
          },
          {
            name: 'location',
            label: 'Location',
          },
          {
            name: 'last_stock_opname',
            label: 'Last Stock Opname',
            type: 'date_picker',
            placeholder: 'Select date',
          },
        ]}
        columns={[
          { header: ' Code', value: 'code', copy: true, type: 'link' },
          { header: ' Name', value: 'name', copy: true },
          { header: ' Capacity', value: 'capacity', copy: true },
          { header: ' Location', value: 'location', copy: true },
          { header: 'Last Stock Opname', value: 'last_stock_opname', copy: true, type: 'date' },
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
        api={WarehouseApi}
        to={route}
        name={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
