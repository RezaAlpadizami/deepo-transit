import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from '../../../components/input-component';
import { ProductApi } from '../../../services/api-master';
import { thousandSeparator } from '../../../utils/helper';
import Select from '../../../components/select-component';
import { RequestApi } from '../../../services/api-transit';
import TextArea from '../../../components/textarea-component';
import deleteIcon from '../../../assets/images/deleteItem.svg';
import DatePicker from '../../../components/datepicker-component';
import InputDetail from '../../../components/input-detail-component';
import CookieService from '../../../services/cookies/cookie-service';
import LoadingHover from '../../../components/loading-hover-component';

function Screen() {
  const navigate = useNavigate();

  const [dataProduct, setDataProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataAdd, setDataAdd] = useState([]);

  const activityProduct = [
    { activity_name: 'INBOUND' },
    { activity_name: 'OUTBOUND' },
    { activity_name: 'RELOCATE-IN' },
    { activity_name: 'RELOCATE-OUT' },
  ];

  const schemaAddProduct = yup.object().shape({
    product_id: yup.string().nullable().required(),
    qty: yup.number().nullable().min(1, 'The minimum qty is one').typeError('please input quantity').required(),
  });

  const schemaSubmitRequest = yup.object().shape({
    activity_name: yup.string().nullable().required(),
    activity_date: yup.date().nullable().required(),
    notes: yup.string().nullable().max(255).required(),
  });

  const {
    register: registerProd,
    control: controlProd,
    formState: { errors: errorsProd },
    reset,
    handleSubmit: handleSubmitProd,
  } = useForm({
    resolver: yupResolver(schemaAddProduct),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSubmitRequest),
  });

  useEffect(() => {
    getData();
  }, [dataAdd]);

  const getData = () => {
    ProductApi.get()
      .then(res => {
        setDataProduct(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  const onAddProdRequestDetail = dataInput => {
    const dataInputAddArray = [dataProduct.find(obj => obj.id === Number(dataInput.product_id))];
    const handleDataAdd = dataInputAddArray.map(data => {
      return {
        product_id: dataInput.product_id,
        product_sku: data.sku,
        product_name: data.product_name,
        qty: dataInput.qty,
      };
    });
    setDataAdd(state => [...state, ...handleDataAdd]);
    reset();
  };

  const handleRemove = product_id => {
    setDataAdd(dataAdd.filter(item => item.product_id !== product_id));
  };

  const updateDataAdd = Object.values(
    Array.isArray(dataAdd)
      ? dataAdd.reduce((accu, { product_id, ...item }) => {
          if (!accu[product_id])
            accu[product_id] = {
              qty: 0,
            };

          accu[product_id] = {
            product_id,
            ...accu[product_id],
            ...item,
            qty: accu[product_id].qty + item.qty,
          };

          return accu;
        }, {})
      : []
  );

  const getTotalQty = Array.isArray(updateDataAdd) ? updateDataAdd.reduce((acc, item) => acc + item.qty, 0) : null;

  const onSubmitRequest = data => {
    setLoading(true);
    RequestApi.store({
      request_by: 'testing',
      warehouse_id: Number(CookieService.getCookies('warehouse_id')),
      notes: data.notes,
      activity_date: data.activity_date,
      activity_name: data.activity_name,
      detail: updateDataAdd.map(data => {
        return {
          qty: data.qty,
          product_id: data.product_id,
        };
      }),
    })
      .then(() => {
        setLoading(false);
        Swal.fire({
          text: 'Request baru berhasil ditambahkan',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonColor: 'primarydeepo',
          confirmButtonText: `<p class="rounded bg-secondarydeepo text-[#fff] px-5 py-2 ml-5 font-bold">OK</p>`,
        });
        navigate('/request');
      })
      .catch(error => {
        setLoading(false);
        if (error.message === 'Validation Failed') {
          Swal.fire({ text: 'Product or Qty still empty', icon: 'error' });
        } else {
          Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
        }
      });
  };

  return (
    <div>
      <div className="bg-white p-5 rounded-[55px] py-12 drop-shadow-md">
        <div className="grid-cols-2 gap-4 flex max-[640px]:flex-col sm:flex-col lg:flex-row">
          <fieldset className="border border-borders shadow-custom w-full h-full py-12 rounded-[55px] max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
            <legend className="px-2 text-[28px] text-primarydeepo">Request</legend>
            <div className="flex gap-4 justify-center max-[640px]:flex-col sm:flex-col lg:flex-row">
              <div className="w-full">
                <Select
                  name="activity_name"
                  label="Activity"
                  options={activityProduct?.map(i => {
                    return {
                      value: i.activity_name,
                      label: i.activity_name,
                    };
                  })}
                  register={register}
                  errors={errors}
                />
              </div>
              <div className="w-full">
                <DatePicker
                  name="activity_date"
                  label="Date"
                  placeholder="Date / Month / Year"
                  register={register}
                  control={control}
                  errors={errors}
                />
              </div>
            </div>
            <div>
              <TextArea name="notes" label="Notes" register={register} errors={errors} />
            </div>
          </fieldset>

          <fieldset className="border border-borders shadow-custom w-full h-full py-12 rounded-[55px] max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
            <legend className="px-2 text-[28px] text-primarydeepo">Request Detail</legend>
            <form onSubmit={handleSubmitProd(onAddProdRequestDetail)}>
              <div className="flex gap-4 justify-center max-[640px]:flex-col sm:flex-col lg:flex-row">
                <div className="w-full col-span-2">
                  <Select
                    name="product_id"
                    label="Product"
                    options={dataProduct?.map(i => {
                      return {
                        value: i.id,
                        label: i.product_name,
                      };
                    })}
                    register={registerProd}
                    control={controlProd}
                    errors={errorsProd}
                  />
                </div>
                <div className="">
                  <Input name="qty" label="QTY" register={registerProd} errors={errorsProd} control={controlProd} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button px={8} type="submit" size="sm" className="rounded-full bg-primarydeepo text-[#fff] mr-6">
                  + Add
                </Button>
              </div>
            </form>
            <div className="border-b border-primarydeepo my-6"> </div>
            {updateDataAdd?.length > 0 && (
              <div>
                {updateDataAdd.map((val, id) => {
                  return (
                    <div className="flex" key={id}>
                      <div className="my-4 mr-4 max-[640px]:mr-0 sm:mr-0 lg:mr-2 flex flex-col justify-center align-middle">
                        <Button
                          type="button"
                          size="sm"
                          bgColor="transparent"
                          _hover={{
                            bgColor: '#EBECF1',
                          }}
                          onClick={() => handleRemove(val.product_id)}
                        >
                          <img src={deleteIcon} alt="delete Icon" className="max-[640px]:w-8 max-[640px]:h-8" />
                        </Button>
                      </div>
                      <InputDetail
                        value={`SKU: ${val.product_sku}`}
                        label={`${val.product_name}`}
                        customStyleLabel="font-bold text-md mb-0 max-[640px]:text-xs max-[640px]:w-24 sm:w-24 md:w-full lg:w-24 xl:w-48"
                        customStyleSpan="text-md max-[640px]:text-xs sm:text-sm"
                      />
                      <div className="flex relative gap-20 mt-6">
                        <span className="absolute right-24 max-[640px]:right-12">X</span>
                        <Text>{thousandSeparator(val.qty)}</Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-b border-primarydeepo my-6"> </div>
            <div className="flex justify-between font-bold">
              <Text>Total Product</Text>
              <Text className={`${getTotalQty < 1 ? 'hidden' : ''}`}>{thousandSeparator(getTotalQty)}</Text>
            </div>
          </fieldset>
        </div>
        <div className="flex justify-end mt-6 max-[640px]:justify-start max-[640px]:mt-12">
          <div className="flex">
            <div>
              <Button
                onClick={() => navigate(-1)}
                px={8}
                size="sm"
                className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold"
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmitRequest)}
                px={8}
                size="sm"
                className="ml-4 rounded-full bg-gradient-to-r from-secondarydeepo to-primarydeepo hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-secondarydeepo drop-shadow-md text-[#fff] font-bold  mr-14"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
