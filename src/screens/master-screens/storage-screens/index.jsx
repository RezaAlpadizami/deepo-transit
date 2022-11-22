import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Moment from 'moment';
import { StorageApi } from '../../../services/api-master';

import Datatable from '../../../components/datatable-component';
import Input from '../../../components/input-component';
import Select from '../../../components/select-component';

function Screen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);

  const schema = yup.object().shape({
    code: yup.string().nullable(),
    rack_number: yup.string().nullable(),
    bay: yup.string().nullable(),
    level: yup.string().nullable(),
    warehouse_id: yup.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getDataStorage();
  }, []);

  const getDataStorage = () => {
    setLoading(true);
    StorageApi.get()
      .then(data => {
        setLoading(false);
        setData(data.results);
        setTotalData(data.count);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
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
        <h1 className="font-bold text-xl">Storage</h1>
        <div className="flex-1" />
        {/* <Button onClick={() => navigate('/master/city/add')} paddingX={12} size="sm" colorScheme="primary">
          Tambah SKP
        </Button> */}
      </div>
      <form onSubmit={handleSubmit(onSubmitFilter)}>
        <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 px-6 mb-4 grid-cols-3 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="rack_number" label="Rack" register={register} errors={errors} />
          <Input name="bay" label="Bay" register={register} errors={errors} />
        </div>
        <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 px-6 mb-4 grid-cols-2 mt-4">
          <Input name="level" label="Level" register={register} errors={errors} />
          <Select
            name="warehouse_id"
            label="Warehouse"
            options={[
              { value: 'pusat', label: 'Gudang Pusat' },
              { value: 'serpong', label: 'Gudang Serpong' },
              { value: 'cilegon', label: 'Gudang Cilegon' },
              { value: 'jaksel', label: 'Gudang Jakarta Selatan' },
            ]}
            placeholder=""
            register={register}
            errors={errors}
          />
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1" />
          <Button type="button" size="sm" width="24" onClick={() => reset()} colorScheme="blackAlpha" variant="outline">
            Reset
          </Button>
          <Button
            type="submit"
            size="sm"
            width="24"
            colorScheme="solid"
            className="bg-gray-500 hover:bg-black text-white"
          >
            Filter
          </Button>
        </div>
      </form>
      <div>
        <div className="flex gap-4 bg-white py-6 px-6 rounded-t-3xl">
          <Button
            type="button"
            onClick={() => navigate('/master/storage/add')}
            className="border border-gray-500 text-md rounded-xl border-3 py-1 px-4 bg-gray-200 hover:bg-black hover:text-white"
          >
            +Add Storage
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-gray-200 border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Update
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-gray-200 border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Delete
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-gray-200 border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Save to Excel
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-gray-200 border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Copy to Clipboard
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            className="bg-gray-200 border border-gray-500 text-md rounded-xl border-3 py-1 px-4 hover:bg-black hover:text-white"
          >
            Show/Hide Column
          </Button>
        </div>
        <Datatable
          checkbox
          column={[
            { header: 'Code', value: 'code' },
            { header: 'Rack', value: 'rack_number' },
            { header: 'Bay', value: 'bay' },
            { header: 'Level', value: 'level' },
            { header: 'Warehouse', value: 'warehouse_id' },
          ]}
          data={data}
          totalData={totalData}
          loading={loading}
          onChangePage={page => getDataStorage(page)}
          hasViewAction
        />
      </div>
    </div>
  );
}
export default Screen;
