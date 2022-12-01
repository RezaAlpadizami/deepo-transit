import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2';

import Datatable from '../../../components/datatable-component';
import { StorageApi, WarehouseApi } from '../../../services/api-master';

function Screen(props) {
  const { displayName, route } = props;
  const [warehouseData, setWarhouseData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    WarehouseApi.get()
      .then(res => {
        setWarhouseData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

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
            data: warehouseData?.map(i => {
              return {
                value: i.id,
                label: `${i.name} ${i.location}`,
              };
            }),
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
