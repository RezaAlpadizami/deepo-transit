import React from 'react';
import { WarehouseApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName, name } = props;

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
          { header: 'Wareouse Code', value: 'code', copy: true, type: 'link' },
          { header: 'Wareouse Name', value: 'name', copy: true },
          { header: 'Wareouse Location', value: 'location', copy: true },
          { header: 'Wareouse Address', value: 'address', copy: true },
          { header: 'Warehouse Capacity', value: 'capacity', copy: true },
          { header: 'Last Stock Opname', value: 'last_stock_opname', copy: true, type: 'date' },
          { header: 'Warehouse Phone', value: 'phone', copy: true },
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
        name={name}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
