import React from 'react';

import { ProductJourney } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { displayName, route } = props;

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'request_number',
            label: 'Request Number',
            placeholder: 'Input Request Number',
          },
          {
            name: 'product_sku',
            label: 'SKU',
            placeholder: 'Input SKU',
          },
          {
            name: 'product_name',
            label: 'Product Name',
            placeholder: 'Input Product Name',
          },
          {
            name: 'activity_name',
            label: 'Activity',
            placeholder: 'Input Activity',
          },
          {
            name: 'activity_date',
            label: 'Activity Date',
            type: 'date_picker',
            placeholder: 'Select date',
          },
          {
            name: 'warehouse_name',
            label: 'Warehouse',
            placeholder: 'Input Warehouse',
          },
        ]}
        columns={[
          { header: 'Request Number', value: 'request_number', copy: true },
          { header: 'SKU', value: 'product_sku', copy: true, type: 'link' },
          { header: 'Product Name', value: 'product_name', copy: true },
          { header: 'Activity Name', value: 'activity_name', copy: true },
          { header: 'Activity Date', value: 'activity_data', copy: true, type: 'date' },
        ]}
        toolbar={{
          action: {
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={ProductJourney}
        to={route}
        name={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
