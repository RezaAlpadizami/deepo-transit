import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { observer } from 'mobx-react-lite';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import LoadingHover from '../../../components/loading-component';
import TextArea from '../../../components/textarea-component';
import { ProductApi } from '../../../services/api-master';
import Select from '../../../components/select-component';
import Input from '../../../components/input-component';
import LoadSkeleton from '../../../components/skeleton-edit-component';
import Context from '../../../context';

const schema = yup.object().shape({
  sku: yup.string().nullable().required(),
  product_name: yup.string().nullable().required(),
  category: yup.string().nullable().required(),
  product_desc: yup.string(),
});

function Screen(props) {
  const { route, displayName } = props;
  const { store } = useContext(Context);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const loadingSkeleton = store?.isLoadEdit;

  useEffect(() => {
    ProductApi.find(id)
      .then(res => {
        setValue('sku', res.sku);
        setValue('product_name', res.product_name);
        setValue('category', res.category_id);
        setValue('product_desc', res.product_desc);
        store.setIsLoadEdit(false);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, [store]);

  const onSubmit = data => {
    setLoading(true);
    ProductApi.update(id, {
      product_name: data.product_name,
      sku: data.sku,
      category_id: data.category,
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
        {loadingSkeleton && <LoadSkeleton />}
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">{displayName}</h1>
          <div className="flex-1" />
          <div>
            <Button
              onClick={() => navigate(-1)}
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
            name="category"
            label="Category"
            options={[
              {
                value: '1',
                label: 'ID',
              },
              {
                value: 'category_code',
                label: 'Code',
              },
              {
                value: 'category_name',
                label: 'Name',
              },
            ]}
            register={register}
            errors={errors}
          />
          <Input name="product_name" label="Name" register={register} errors={errors} />
          <TextArea name="product_desc" label="Description" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default observer(Screen);
