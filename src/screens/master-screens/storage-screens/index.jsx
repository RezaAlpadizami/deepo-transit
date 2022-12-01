import React from 'react';

import Datatable from '../../../components/datatable-component';
import { StorageApi } from '../../../services/api-master';

function Screen(props) {
  const { displayName, route } = props;

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'code',
            label: 'Code',
          },
          {
            name: 'rack_number',
            label: 'Rack',
          },
          {
            name: 'bay',
            label: 'Bay',
          },
          {
            name: 'level',
            label: 'Level',
          },
          {
            name: 'warehouse',
            label: 'Warehouse',
            type: 'select',
            data: [
              {
                value: 1,
                label: 'Gudang Pusat',
              },
              {
                value: 2,
                label: 'Gudang Serpong',
              },
              {
                value: 3,
                label: 'Gudang Cilegon',
              },
              {
                value: 4,
                label: 'Gudang Jakarta Selatan',
              },
            ],
          },
        ]}
        columns={[
          { header: 'Code', value: 'code', copy: true, type: 'link' },
          { header: 'Rack Number', value: 'rack_number', copy: true },
          { header: 'Bay', value: 'bay', copy: true },
          { header: 'Level', value: 'level', copy: true },
          { header: 'Warehouse', value: 'warehouse.location', copy: true },
        ]}
        toolbar={{
          action: {
            add: true,
            edit: true,
            view: true,
            delete: true,
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={StorageApi}
        to={route}
        name={displayName}
        checkbox
      />
      {/* </div> */}
    </div>
  );
}
export default Screen;
