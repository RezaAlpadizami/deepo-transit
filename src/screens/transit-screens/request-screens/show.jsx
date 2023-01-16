import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Swal from 'sweetalert2';
import Moment from 'moment/moment';
import { Text } from '@chakra-ui/react';
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid';

import Context from '../../../context';
import { thousandSeparator } from '../../../utils/helper';
import { RequestApi } from '../../../services/api-transit';
import TextArea from '../../../components/textarea-component';
import InputDetail from '../../../components/input-detail-component';

function Screen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store } = useContext(Context);

  const [dataRequesById, setDataRequestById] = useState([]);
  const [dataRequesByIdDetail, setDataRequestByIdDetail] = useState([]);

  const {
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getDetailRequest();
  }, []);

  const getDetailRequest = () => {
    RequestApi.find(id)
      .then(res => {
        setDataRequestById(res);
        setDataRequestByIdDetail(res.detail);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  const updateDataRequesById = Object.values(
    Array.isArray([])
      ? dataRequesByIdDetail.reduce((accu, { product_id, ...item }) => {
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

  const totalQty = Array.isArray([])
    ? updateDataRequesById.reduce((accumulator, object) => {
        return accumulator + object.qty;
      }, 0)
    : '-';

  return (
    <div>
      <div className="bg-white p-5 rounded-[55px] shadow py-8 drop-shadow-md">
        <div
          className="cursor-pointer p-2 w-12 flex justify-center hover:bg-gray-200 hover:rounded-lg mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowNarrowLeftIcon className="w-6 h-6 text-secondarydeepo text-center" />
        </div>
        <div className="grid-cols-2 gap-4 flex">
          <fieldset className="border border-borders shadow-custom hover:shadow-hover transition-all duration-200  w-full h-full px-8 py-12 rounded-[55px] mx-4">
            <legend className="px-2 text-[28px] text-primarydeepo">Request</legend>
            <div className="flex flex-col">
              <div className="w-full">
                <InputDetail
                  value={dataRequesById.request_number}
                  label="Request Number"
                  customStyleLabel="text-gray-400 text-md"
                  customStyleSpan="font-bold text-md"
                />
              </div>
              <div>
                <div className="flex gap-36">
                  <div>
                    <InputDetail
                      value={dataRequesById.activity_name}
                      label="Activity"
                      customStyleLabel="text-gray-400 text-md"
                      customStyleSpan="font-bold text-md"
                    />
                  </div>
                  <div>
                    <InputDetail
                      value={Moment(dataRequesById.activity_date).format('DD MMM, YYYY')}
                      label="Date"
                      customStyleLabel="text-gray-400 text-md"
                      customStyleSpan="font-bold text-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <TextArea
                name="notes"
                label="Notes"
                register={register}
                errors={errors}
                value={dataRequesById?.notes}
                disabled
              />
            </div>
          </fieldset>
          <fieldset className="border border-borders shadow-custom hover:shadow-hover transition-all duration-200  w-full h-full px-8 py-12 rounded-[55px] mx-4">
            <legend className="px-2 text-[28px] text-primarydeepo">Request Detail</legend>
            <div>
              <div className="flex justify-between">
                <Text className="text-gray-400">Product</Text>
                <Text className="text-gray-400">Qty</Text>
              </div>
              {updateDataRequesById.map(({ qty, product_id, product_name, product_sku }) => {
                return (
                  <div className="flex" key={product_id}>
                    <InputDetail
                      value={`SKU: ${product_sku}`}
                      label={product_name}
                      customStyleLabel="font-bold text-md mb-0"
                      customStyleSpan="text-md"
                    />
                    <div className="flex gap-20 mt-6">
                      <span className="">X</span>
                      <Text>{thousandSeparator(qty)}</Text>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-b border-primarydeepo my-6"> </div>
            <div className="flex justify-between font-bold">
              <Text>Total Product</Text>
              <Text>{thousandSeparator(totalQty)}</Text>
            </div>
          </fieldset>
        </div>
        <div className="flex justify-end mt-6">
          <div className="flex">
            <div>
              <Link
                onClick={() => {
                  store.setRequestNumber(dataRequesById?.id);
                }}
                hidden={dataRequesById?.status !== 'PENDING'}
                type="button"
                to="/inbound"
                px={8}
                size="sm"
                className="mr-14 text-white bg-gradient-to-r from-secondarydeepo to-primarydeepo hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-secondarydeepo font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2"
              >
                Process
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Screen;
