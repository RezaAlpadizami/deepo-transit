import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import Swal from 'sweetalert2';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import LoadingHover from '../../../components/loading-hover-component';
import { CategoryApi } from '../../../services/api-master';
import Input from '../../../components/input-component';

function Screen(props) {
  const { displayName } = props;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    code: yup.string().nullable().required(),
    name: yup.string().nullable().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onAddStorage = data => {
    setLoading(true);
    CategoryApi.store({
      code: data.code,
      name: data.name,
    })
      .then(res => {
        console.log('res', res);
        setLoading(false);
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate('/master/category');
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onAddStorage)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">{displayName}</h1>
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
            className="bg-gray-300 border border-gray-500 text-gray-700 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
          >
            Save
          </Button>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="name" label="Category" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
