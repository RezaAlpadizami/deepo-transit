import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Datatable from '../../../components/datatable-component';
import Input from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import warehouseApi from '../../../services/api-master/resources/warehouse-api';

function Screen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataListWarehouse, setDataListWarehouse] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [filterData, setFilterData] = useState({
    limit: 5,
    offset: 0,
  });

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
  }, [JSON.stringify(filterData)]);

  useEffect(() => {
    setFilterData({ ...filterData });
  }, []);

  const getDataWarehouse = () => {
    setLoading(true);
    warehouseApi
      .get({ ...filterData })
      .then(data => {
        setLoading(false);
        setDataListWarehouse(data.data);
        setTotalData(data.query.total);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });
  };

  return (
    <div className="">
      <div className="flex">
        <h1 className="font-bold text-xl">Warehouse</h1>
        <div className="flex-1" />
      </div>
      <form onSubmit={handleSubmit(d => console.log(d))}>
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
          column={[
            { header: 'Code', value: 'code' },
            { header: 'Name', value: 'name' },
            { header: 'Capacity', value: 'capacity', type: 'percent' },
            { header: 'Location', value: 'location' },
            { header: 'Last Stock Opname', value: 'last_stock_opname', type: 'date' },
          ]}
          data={dataListWarehouse}
          totalData={totalData}
          loading={loading}
          onChangePage={page => getDataWarehouse(page)}
          hasViewAction
        />
      </div>
    </div>
  );
}
export default Screen;
