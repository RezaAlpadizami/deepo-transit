import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import Moment from 'moment';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import Datatable from '../../../components/datatable-component';
import Input from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import WarehouseApi from '../../../services/api-master/resources/warehouse-api';

function Screen(props) {
  const { displayName } = props;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataListWarehouse, setDataListWarehouse] = useState([]);
  const [totalData, setTotalData] = useState([]);

  const schema = yup.object().shape({
    name: yup.string(),
    code: yup.string(),
    phone: yup.string(),
    capacity: yup.number(),
    location: yup.string(),
    last_stock_opname: yup.date(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getDataWarehouse();
  }, []);

  const getDataWarehouse = () => {
    setLoading(true);
    WarehouseApi.get()
      .then(data => {
        setLoading(false);
        setDataListWarehouse(data.data);
        setTotalData(data.query.total);
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  const onSubmitFilter = data => {
    Object.keys(data).forEach(dt => {
      if (Object.hasOwnProperty.call(data, dt)) {
        if (!data[dt]) {
          delete data[dt];
        }
        if (data[dt] instanceof Date) {
          if (dt.toLowerCase().includes('to')) {
            data[dt] = Moment(data[dt]).endOf('day').format('YYYY-MM-DD');
          } else {
            data[dt] = Moment(data[dt]).startOf('day').format('YYYY-MM-DD');
          }
        } else {
          // eslint-disable-next-line no-unused-expressions
          data[dt];
        }
      }
    });
  };

  return (
    <div className="">
      <div className="flex">
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex-1" />
      </div>
      <form onSubmit={handleSubmit(onSubmitFilter)}>
        <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 mx-2 mb-4 grid-cols-5 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="name" label="Name" register={register} errors={errors} />
          <Input name="capacity" label="Capacity" register={register} errors={errors} />
          <Input name="location" label="Location" register={register} errors={errors} />
          <DatePicker
            name="last_stock-opname"
            label="Last Stock Opname"
            placeholder="Select Date"
            register={register}
            control={control}
            errors={errors}
          />
        </div>
      </form>
      <div>
        <div className="flex gap-4 bg-white py-6 px-6 rounded-t-3xl">
          <Button
            type="button"
            onClick={() => navigate('/master/warehouse/add')}
            className="bg-white border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            +Add Warehouse
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-white border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Update
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-white border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Delete
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-white border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Save to Excel
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-white border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Copy to Clipboard
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-white border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Show/Hide Column
          </Button>
        </div>
        <Datatable
          checkbox
          column={[
            { header: 'Code', value: 'code', type: 'link' },
            { header: 'Name', value: 'name' },
            { header: 'Capacity', value: 'capacity', type: 'percent' },
            { header: 'Location', value: 'location' },
            { header: 'Last Stock Opname', value: 'last_stock_opname', type: 'date' },
          ]}
          data={dataListWarehouse}
          api={WarehouseApi}
          totalData={totalData}
          loading={loading}
          onChangePage={page => getDataWarehouse(page)}
        />
      </div>
    </div>
  );
}
export default Screen;
