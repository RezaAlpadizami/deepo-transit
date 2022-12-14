import React from 'react';

import { CategoryApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { displayName, route } = props;

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'code',
            label: 'Code',
            placeholder: 'Input Code',
          },
          {
            name: 'name',
            label: 'Name',
            placeholder: 'Input Name',
          },
        ]}
        columns={[
          { header: 'Code', value: 'code', copy: true, type: 'link' },
          { header: 'Name', value: 'name', copy: true },
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
        api={CategoryApi}
        to={route}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
