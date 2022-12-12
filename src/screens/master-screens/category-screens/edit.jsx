import React, { useState, useEffect } from 'react';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

import Input from '../../../components/input-component';
import { CategoryApi } from '../../../services/api-master';
import LoadingHover from '../../../components/loading-hover-component';

const schema = yup.object().shape({
  code: yup.string().nullable().required(),
  name: yup.string().nullable().required(),
});

function Screen(props) {
  const { displayName, route } = props;

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    CategoryApi.find(id)
      .then(res => {
        setValue('code', res.code);
        setValue('name', res.name);
        setLoading(false);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  const onEditSaveCategory = data => {
    CategoryApi.update(id, {
      code: data.code,
      name: data.name,
    })
      .then(() => {
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate(route.split('/').slice(0, 3).join('/'));
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onEditSaveCategory)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">{displayName}</h1>
          <div className="flex-1" />
          <Button
            onClick={() => navigate(-1)}
            paddingX={12}
            size="sm"
            className="bg-[#E3E3E3] border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-2 hover:text-gray-700 hover:bg-[#D9D9D9]"
          >
            Cancel
          </Button>
          <Button
            paddingX={12}
            type="submit"
            size="sm"
            className="bg-[#232323] border border-gray-500 text-white rounded-full border-3 py-4 px-6 mr-60 hover:bg-black"
          >
            Save
          </Button>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="name" label="Category" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
