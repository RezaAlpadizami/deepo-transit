import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { CityApi } from '../../../services/api-master';

import Datatable from '../../../components/datatable-component';
import Input from '../../../components/input-component';
import Select from '../../../components/select-component';
// import DatePicker from '../../../components/datepicker-component';
// import Textarea from '../../../components/textarea-component';

function Screen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);

  const schema = yup.object().shape({
    code: yup.string().nullable().required(),
    rack: yup.string().nullable().required(),
    bay: yup.string().nullable().required(),
    level: yup.string().nullable().required(),
    warehouse: yup.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = (page = 1) => {
    setLoading(true);
    CityApi.get({ page })
      .then(data => {
        console.log('data', data);
        setLoading(false);
        setData(data.results);
        setTotalData(data.count);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
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
      <form onSubmit={handleSubmit(d => console.log(d))}>
        <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 px-6 mb-4 grid-cols-3 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="rack" label="Rack" register={register} errors={errors} />
          <Input name="bay" label="Bay" register={register} errors={errors} />

          {/* <DatePicker
            name="last_stock-opname"
            label="Last Stock Opname"
            placeholder="Select Date"
            register={register}
            control={control}
            errors={errors}
          /> */}
          {/* <Textarea name="age" label="Age" placeholder="Input Age" register={register} errors={errors} /> */}
        </div>
        <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 px-6 mb-4 grid-cols-2 mt-4">
          <Input name="level" label="Level" register={register} errors={errors} />
          <Select
            name="warehouse"
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

        {/* <div className="flex gap-2">
          <div className="flex-1" />
          <Button type="button" size="sm" width="24" onClick={() => reset()} colorScheme="blackAlpha" variant="outline">
            Reset
          </Button>
          <Button type="submit" size="sm" width="24" colorScheme="primary">
            Filter
          </Button>
        </div> */}
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
          column={[
            { header: 'Name', value: 'name' },
            { header: 'Terrain', value: 'terrain' },
            { header: 'Diameter', value: 'diameter' },
            { header: 'Gravity', value: 'gravity' },
          ]}
          data={data}
          totalData={totalData}
          loading={loading}
          onChangePage={page => getData(page)}
        />
      </div>
    </div>
  );
}
export default Screen;
