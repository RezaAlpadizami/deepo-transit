import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import LoadingHover from '../../../components/loading-component';
import TextArea from '../../../components/textarea-component';
import { ProductApi } from '../../../services/api-master';
import Select from '../../../components/select-component';
import Input from '../../../components/input-component';

const schema = yup.object().shape({
  sku: yup.string().nullable().required(),
  product_name: yup.string().nullable().required(),
  category_id: yup.string().required(),
  product_desc: yup.string(),
});
const category = [
  {
    id: 1,
    code: 'A1',
    name: 'SATU',
  },
  {
    id: 2,
    code: 'A2',
    name: 'DUA',
  },
  {
    id: 3,
    code: 'A3',
    name: 'TIGA DUMMY',
  },
];
function Screen(props) {
  const { route, displayName } = props;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    setLoading(true);
    ProductApi.store({
      sku: data.sku,
      product_name: data.product_name,
      category_id: Number(data.category_id),
      product_desc: data.product_desc,
    })
      .then(() => {
        setLoading(false);
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate(route.split('/').slice(0, 3).join('/'));
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">{displayName}</h1>
          <div className="flex-1" />
          <div>
            <Button
              onClick={() => reset()}
              px={8}
              size="sm"
              className="rounded-full bg-[#aaa] outline outline-offset-2 outline-[#1F2022] text-[#fff]"
            >
              Cancel
            </Button>
            <Button px={8} type="submit" className="ml-4 rounded-full bg-[#232323] text-[#fff]">
              Save
            </Button>
          </div>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="sku" label="Sku" register={register} errors={errors} />
          <Select
            name="category_id"
            label="Category"
            options={category.map(i => {
              return {
                value: i?.id,
                label: `${i.code} - ${i.name}`,
              };
            })}
            register={register}
            errors={errors}
          />
          <Input name="product_name" label="Name" register={register} errors={errors} />
          <TextArea name="product_desc" label="Description" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
