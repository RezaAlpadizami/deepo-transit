import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import * as yup from 'yup';
import Moment from 'moment';
import Swal from 'sweetalert2';
import { Button, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { thousandSeparator } from '../../../utils/helper';
import Input from '../../../components/input-component';
import Select from '../../../components/select-component';
import { ProductApi } from '../../../services/api-master';
import { RequestApi } from '../../../services/api-transit';
import TextArea from '../../../components/textarea-component';
import deleteIcon from '../../../assets/images/deleteItem.svg';
import DatePicker from '../../../components/datepicker-component';
import InputDetail from '../../../components/input-detail-component';
import LoadingHover from '../../../components/loading-hover-component';

function Screen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataRequesById, setDataRequestById] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataReq, setDataReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [dataNewDetail, setDataNewDetail] = useState([]);
  const [isDelete, setIsDelete] = useState(false);

  const activityProduct = [
    { value: 'INBOUND', label: 'INBOUND' },
    { value: 'OUTBOUND', label: 'OUTBOUND' },
    { value: 'RELOCATE-IN', label: 'RELOCATE-IN' },
    { value: 'RELOCATE-OUT', label: 'RELOCATE-OUT' },
  ];

  const schemaAddProduct = yup.object().shape({
    product_id: yup.string().nullable().required(),
    qty: yup.number().min(1, 'The minimum qty is one').nullable().typeError('please input quantity').required(),
  });

  const schemaSubmitRequest = yup.object().shape({
    activity_name: yup.string().nullable().required(),
    activity_date: yup.date().nullable().required(),
    notes: yup.string().nullable().max(255).required(),
  });

  const {
    register: registerProd,
    control: controlProd,
    reset,
    formState: { errors: errorsProd },
    handleSubmit: handleSubmitProd,
  } = useForm({
    resolver: yupResolver(schemaAddProduct),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSubmitRequest),
  });

  useEffect(() => {
    getDetailRequest();
    getData();
  }, []);

  const getData = () => {
    ProductApi.get()
      .then(res => {
        setDataProduct(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  const getDetailRequest = () => {
    RequestApi.find(id)
      .then(res => {
        setValue('activity_name', res.activity_name, { value: res.activity_name, label: res.activity_name });
        setValue('activity_date', res.activity_date ? Moment(res.activity_date).toDate() : null);
        setValue('notes', res.notes);
        setDataReq(res);
        setDataDetail(
          res?.detail?.map(data => {
            return {
              ...data,
              is_deleted: false,
            };
          })
        );
        setDataRequestById(res.detail);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  const onAddProdRequestDetail = dataInput => {
    setIsDelete(false);
    const dataNewItem = [];
    const dataDetailUpdate = [];

    const dataInputAddArray = [dataProduct.find(obj => obj.id === Number(dataInput.product_id))];
    const handleDataAdd = dataInputAddArray.map(data => {
      return {
        qty: Number(dataInput.qty),
        product_id: Number(dataInput.product_id),
        product_sku: data.sku,
        product_name: data.product_name,
        is_deleted: isDelete,
      };
    });
    const dataObject = Object.assign({}, ...handleDataAdd);
    if (dataReq?.detail?.some(item => item.product_id === dataObject.product_id)) {
      dataDetailUpdate.push({ ...dataObject });
    } else {
      dataNewItem.push({ ...dataObject });
    }
    setDataDetail([...dataDetail, ...dataDetailUpdate]);
    setDataNewDetail(state => [...state, ...dataNewItem]);
    setDataRequestById(state => [...state, dataObject]);
    reset();
  };

  const updateDataDetail = Object.values(
    Array.isArray([])
      ? dataDetail.reduce((accu, { product_id, ...item }) => {
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

  const updateNewDetail = Object.values(
    Array.isArray([])
      ? dataNewDetail.reduce((accu, { product_id, ...item }) => {
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

  const getTotalQty = Array.isArray([])
    ? dataRequesById.reduce((accumulator, object) => {
        return accumulator + object.qty;
      }, 0)
    : '-';

  const updateDataRequesById = Object.values(
    Array.isArray([])
      ? dataRequesById.reduce((accu, { product_id, ...item }) => {
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

  const handleRemove = product_id => {
    if (updateDataRequesById.filter(item => item.product_id !== product_id).length < 1) {
      Swal.fire({ text: 'product cannot be empty', icon: 'error' });
    } else {
      setDataRequestById(updateDataRequesById.filter(item => item.product_id !== product_id));
      setDataDetail(
        updateDataDetail.map(data => {
          if (data.product_id === product_id) {
            return {
              product_id: data.product_id,
              qty: 0,
              id: data.id,
              is_deleted: !isDelete,
            };
          }
          return { ...data, is_deleted: false };
        })
      );
      setDataNewDetail(
        updateNewDetail.map(data => {
          if (data.product_id === product_id) {
            return {
              product_id: data.product_id,
              qty: 0,
            };
          }
          return { product_id: data.product_id, qty: data.qty };
        })
      );
    }
  };

  const onSubmitRequest = data => {
    setLoading(true);
    RequestApi.update(id, {
      activity_name: data.activity_name,
      request_by: 'testing',
      notes: data.notes,
      new_detail: updateNewDetail.map(data => {
        return {
          product_id: data.product_id,
          qty: data.qty,
        };
      }),
      detail: updateDataDetail.map(data => {
        return {
          product_id: data.product_id,
          qty: data.qty,
          is_deleted: data.is_deleted,
          id: data.id,
        };
      }),
    })
      .then(() => {
        setLoading(false);
        Swal.fire({
          text: 'Request berhasil diupdate',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonColor: 'primarydeepo',
          confirmButtonText: `<p class="rounded bg-secondarydeepo text-[#fff] px-5 py-2 ml-5 font-bold">OK</p>`,
        });
        navigate('/request');
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div>
      <div className="bg-white p-5 rounded-[55px] py-12 drop-shadow-md">
        <div className="grid-cols-2 gap-4 flex max-[640px]:flex-col sm:flex-col lg:flex-row">
          <fieldset className="border border-borders shadow-custom w-full h-full px-8 py-12 rounded-[55px] mx-4 max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
            <legend className="px-2 text-[28px] text-primarydeepo">Edit Request </legend>
            <div className="flex gap-4 justify-center max-[640px]:flex-col sm:flex-col lg:flex-row">
              <div className="w-full">
                <Select
                  name="activity_name"
                  label="Activity"
                  options={activityProduct?.map(i => {
                    return {
                      value: i.value,
                      label: i.label,
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

          <fieldset className="border border-borders shadow-custom w-full h-full px-8 py-12 rounded-[55px] mx-4 max-[640px]:px-4 max-[640px]:mx-0 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
            <legend className="px-2 text-[28px] text-primarydeepo max-[640px]:text-[20px]">Edit Request Detail</legend>
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
                    control={controlProd}
                    register={registerProd}
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
            {updateDataRequesById?.map(({ qty, product_id, product_name, product_sku }) => {
              return (
                <div className="flex" key={product_id}>
                  <div className="my-4 mr-4 max-[640px]:mr-0 flex flex-col justify-center align-middle">
                    <Button
                      type="button"
                      size="sm"
                      bgColor="transparent"
                      _hover={{
                        bgColor: '#EBECF1',
                      }}
                      onClick={() => handleRemove(product_id)}
                    >
                      <img
                        src={deleteIcon}
                        alt="delete Icon"
                        className="max-[640px]:w-8 max-[640px]:h-8 md:w-12 md:-12"
                      />
                    </Button>
                  </div>
                  <InputDetail
                    value={`SKU: ${product_sku}`}
                    label={product_name}
                    customStyleLabel="font-bold text-md mb-0 max-[640px]:text-xs max-[640px]:w-24 sm:w-24 md:w-full lg:w-24 xl:w-48"
                    customStyleSpan="text-md max-[640px]:text-xs sm:text-sm"
                  />
                  <div className="flex gap-20 mt-6 max-[640px]:gap-8">
                    <span className="">X</span>
                    <Text>{thousandSeparator(qty)}</Text>
                  </div>
                </div>
              );
            })}

            <div className="border-b border-primarydeepo my-6"> </div>
            <div className="flex justify-between font-bold">
              <Text>Total Product</Text>
              <Text className={`${getTotalQty < 1 ? 'hidden' : ''}`}>{thousandSeparator(getTotalQty)}</Text>
            </div>
          </fieldset>
        </div>
        <div className="flex justify-end mt-6 max-[640px]:justify-start max-[640px]:mt-12 max-[640px]:ml-4">
          <div className="flex">
            <div>
              <Button
                onClick={() => navigate(-1)}
                px={8}
                size="sm"
                className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-primarydeepo font-bold"
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
                className="ml-4 rounded-full bg-gradient-to-r from-secondarydeepo to-primarydeepo hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-secondarydeepo drop-shadow-md text-[#fff] font-bold mr-14"
              >
                Update
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
