import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import LoadingHover from '../../../components/loading-hover-component';
import { StorageApi } from '../../../services/api-master';
import Input from '../../../components/input-component';
import Select from '../../../components/select-component';

function Screen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    bay: yup.string().nullable().required(),
    code: yup.string().nullable().required(),
    rack_number: yup.string().nullable().required(),
    warehouse_id: yup.number().nullable().required(),
    level: yup.string().nullable().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onEditSaveWarehouse = data => {
    setLoading(true);
    StorageApi.update(id, {
      code: data.code,
      bay: data.bay,
      rack_number: data.rack_number,
      warehouse_id: data.warehouse_id,
      level: data.level,
    })
      .then(res => {
        console.log('res update', res);
        setLoading(false);
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate('/master/storage');
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onEditSaveWarehouse)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">Update Warehouse</h1>
          <div className="flex-1" />
          <Button
            onClick={() => reset()}
            paddingX={12}
            size="sm"
            className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-2 hover:text-white hover:bg-black"
          >
            Cancel
          </Button>
          <Button
            paddingX={12}
            type="submit"
            size="sm"
            className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
          >
            Save
          </Button>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="level" label="Level" register={register} errors={errors} />
          <Input name="rack_number" label="Rack" register={register} errors={errors} />
          <Select
            name="warehouse_id"
            label="Warehouse"
            options={[
              { value: 1, label: 'Gudang Pusat' },
              { value: 2, label: 'Gudang Serpong' },
              { value: 3, label: 'Gudang Cilegon' },
              { value: 4, label: 'Gudang Jakarta Selatan' },
            ]}
            placeholder=""
            register={register}
            errors={errors}
          />
          <Input name="bay" label="Bay" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
