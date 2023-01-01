import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { yupResolver } from '@hookform/resolvers/yup';
import { CalculatorIcon, XIcon } from '@heroicons/react/outline';
import Moment from 'moment';
import { StopIcon } from '@heroicons/react/solid';
import { RequestApi, TransitApi } from '../../../services/api-transit';
import InputComponent from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import { StorageApi } from '../../../services/api-master';
import MagnifyClass from '../../../assets/images/magnify-glass.svg';
import Datatable from '../../../components/datatable-component';
import LoadingComponent from '../../../components/loading-component';
import { toCalculate } from '../../../utils/helper';
import Select from '../../../components/select-component';

const totalRFID = 110;
const swalButton = Swal.mixin({
  customClass: {
    confirmButton: 'rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold w-20',
    cancelButton:
      'ml-4 rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold w-20',
  },
  buttonsStyling: false,
});
const storage = yup.object({
  rack: yup.string().test('rack', 'Rack is required', value => {
    if (value) {
      return true;
    }
    return false;
  }),
  // .required(), .required() .required() .required()
  bay: yup.string().test('bay', 'Bay is required', value => {
    if (value) {
      return true;
    }
    return false;
  }),
  level: yup.string().test('level', 'Level is required', value => {
    if (value) {
      return true;
    }
    return false;
  }),
  child_qty: yup.string(),
});

const schema = yup.object({
  details: yup
    .array()
    .of(storage)
    .min(1, 'must have at least one data')
    .test('details', 'total of splitted quantity must be the same with the actual quantity', function (value) {
      let pass = true;

      const { filters, isSplitted } = this.parent;

      if (isSplitted) {
        const filterBy = filters.map(f => {
          return value.filter(i => i.product_id === f);
        });
        if (filterBy.length > 0 && value) {
          const parentQty = filterBy.map(item => {
            const quantities = item.map(x => {
              if (x.qty) {
                return { qty: x.qty, product_id: x.product_id };
              }
              return x.qty;
            });

            return quantities.find(i => i !== undefined);
          });

          const childQty = filterBy.map((item, idx) => {
            return { calc: toCalculate(item, 'child_qty'), product_id: filters[idx] };
          });

          if (childQty.length > 0 && parentQty.length > 0) {
            parentQty.map((item, idx) => {
              if (item.qty) {
                if (childQty[idx]?.product_id === item.product_id) {
                  if (item.qty === childQty[idx].calc) {
                    return pass;
                  }
                  pass = false;
                }
              }
              return pass;
            });
          }
          // pass = false;
        }
      }
      return pass;
    }),
});

function Screen() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { fields, append, remove, insert, update } = useFieldArray({
    control,
    name: 'details',
  });

  const defaultSort = {
    sort_by: 'id',
    sort_order: 'desc',
  };
  const [data, setData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [transitData, setTransitData] = useState([]);
  const [onOpen, setOnOpen] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingRFID, setLoadingRFID] = useState(false);
  const [error, setError] = useState(false);
  const [requestDetailData, setRequestDetailData] = useState();
  const [requestId, setRequestId] = useState('');
  const [totalRequest, setTotalRequest] = useState(0);
  const [counter, setCounter] = useState(2);
  const [timer, setTimer] = useState();
  const [isSplit, setIsSplit] = useState(false);

  useEffect(() => {
    getDetailRequest();
  }, []);

  useEffect(() => {
    if (requestId !== '') {
      setLoadingRequest(true);

      RequestApi.find(requestId)
        .then(res => {
          const filterByProductId = [
            ...new Map(res.detail?.map(i => [JSON.stringify(i.product_id), i.product_id])).values(),
          ];
          const quantity = [...new Map(res.detail?.map(i => [JSON.stringify(i.qty), i.qty])).values()];
          setValue('filters', filterByProductId);
          setValue('quantity', quantity);
          setTransitData(res.detail);
          setValue('activity_date_from', res?.activity_date ? Moment(res?.activity_date).toDate() : null);
          setValue('request_number', res?.request_number ? res?.request_number : '-');
          setTotalRequest(toCalculate(res.detail, 'qty'));
          setRequestDetailData(res.detail);
          setLoadingRequest(false);
        })
        .catch(error => {
          Swal.fire({ text: error?.message, icon: 'error' });
        });
    }
  }, [requestId]);

  useEffect(() => {
    setValue('isSplitted', isSplit);
  }, [isSplit]);

  const startScanning = () => {
    setScanning(true);

    setTimer(
      setInterval(() => {
        TransitApi.get().then(() => {});
      }, 5000)
    );
    setIsScanned(false);
  };
  const stopScanning = () => {
    setScanning(false);
    setIsScanned(true);
    clearInterval(timer);
  };

  const getDetailRequest = () => {
    setLoadingRFID(true);
    Promise.allSettled([
      RequestApi.get({ ...defaultSort }).then(res => res),
      StorageApi.get({ warehouse_id: 2 }).then(res => res),
    ])
      .then(result => {
        setData(result[0].value.data);
        setStorageData(result[1].value.data);
        setLoadingRFID(false);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.data?.error, icon: 'error' });
      });
  };

  const onSplit = (id, qty, idx, child) => {
    setIsSplit(true);

    const findData = fields.find(i => i.product_id === id);
    if (qty / counter > 1) {
      if (counter === 2) {
        update(idx - 1, { ...findData, child_qty: qty / counter });
      }
      if (!child) {
        setCounter(2);
      }
      insert(idx, { product_id: findData.product_id, child_qty: qty / counter });
    }
  };

  const onSubmitRFID = () => {
    let pass = onOpen;
    if (totalRFID === totalRequest) {
      pass = true;
    } else {
      setError(true);
      swalButton
        .fire({
          html: '<b> Jumlah data pada Request Detail tidak sesuai dengan data pada RFID Detected. Lanjutkan proses ? <b>',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
        })
        .then(result => {
          if (result.isConfirmed) {
            append(transitData);
            setOnOpen(!pass);
            setError(false);
          }
        });
    }
    return pass;
  };
  const onProcess = idx => {
    if (idx) {
      setRequestId(idx);
      setOnOverview(!onOverview);
    }
  };

  const onFinalSubmit = data => {
    console.log('onFinalSubmit', data);
    const body = [];
    TransitApi.inbound(body)
      .then(() => {
        // setOnOpen(!onOpen);
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  // console.log(
  //   'validate array',
  //   Array.isArray(errors.details) && isSplit
  //     ? errors?.details.filter(i => i !== undefined)
  //     : errors?.details?.message || ''
  // );
  // console.log('errors?.details?.message ', errors?.details?.message);
  // console.log('error', errors);
  return (
    <div className="bg-white p-5 rounded-[55px] shadow">
      <input type="hidden" {...register('filters')} />
      <input type="hidden" {...register('quantity')} />
      <input type="hidden" {...register('isSplitted')} />
      <fieldset className="border border-primarydeepo w-full h-full px-8 rounded-[55px] pb-6">
        <legend className="px-2 text-[28px] text-primarydeepo font-semibold">Request</legend>
        <div className="grid grid-cols-8 gap-6">
          <button
            type="submit"
            onClick={() => setOnOverview(!onOverview)}
            className="bg-processbtnfrom  h-[100px] w-[110px] rounded-lg grid place-content-center ml-6 mt-2 col-span-2 mt-2"
          >
            <p className="text-lg text-[#fff] font-bold mb-2">Request</p>
            <CalculatorIcon className="h-10 w-15 bg-processbtnfrom stroke-[#fff] mx-auto" />
          </button>

          <div className="col-span-3">
            <InputComponent
              name="request_number"
              label="Request Number"
              register={register}
              control={control}
              errors={errors}
              disabled
            />
          </div>
          <div className="col-span-3">
            <DatePicker
              name="activity_date_from"
              label="Date"
              register={register}
              control={control}
              errors={errors}
              disabled
            />
          </div>
        </div>
      </fieldset>

      <div className="grid-cols-2 gap-4 flex">
        <fieldset className="border border-primarydeepo w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-primarydeepo font-semibold">Request Detail</legend>
          <LoadingComponent visible={loadingRequest} />
          {!loadingRequest ? (
            <TableContainer className="max-h-60 overflow-y-auto overflow-x-hidden">
              <Table variant="simple">
                <Thead>
                  <Tr className="bg-[#bbc9ff] text-bold">
                    <Th className="text-bold text-[#000] text-center">No</Th>
                    <Th className="text-bold text-[#000] text-center">SKU</Th>
                    <Th className="text-bold text-[#000] text-center">Product</Th>
                    <Th className="text-bold text-[#000] text-center">Qty</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {requestDetailData?.map((d, i) => {
                    return (
                      <Tr key={i}>
                        <Td>{i + 1}</Td>
                        <Td>{d.product_sku}</Td>
                        <Td>{d.product_name}</Td>
                        <Td>{d.qty}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : null}
        </fieldset>
        <fieldset className="border border-primarydeepo w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-primarydeepo font-semibold">RFID Detected</legend>
          <LoadingComponent visible={loadingRequest} />
          {!loadingRFID ? (
            <TableContainer className="max-h-60 overflow-y-auto overflow-x-hidden">
              <Table variant="simple">
                <Thead>
                  <Tr className="bg-[#bbc9ff] text-bold">
                    <Th className="text-bold text-[#000] text-center">No</Th>
                    <Th className="text-bold text-[#000] text-center">SKU</Th>
                    <Th className="text-bold text-[#000] text-center">Product</Th>
                    <Th className="text-bold text-[#000] text-center">Qty</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map((d, i) => {
                    return (
                      <Tr key={i}>
                        <Td>{i + 1}</Td>
                        <Td>{d.request_by}</Td>
                        <Td>{d.status}</Td>
                        <Td>{d.id}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : null}
        </fieldset>
      </div>
      <div
        className={`border  ${
          error ? 'border-[#a2002d]' : 'border-primarydeepo'
        }  w-full h-full px-8 rounded-[55px] py-2 mt-10`}
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="pt-2">
            <div>Total Request</div>
            <div>Total RFID Detected</div>
          </div>
          <div className="pt-2">
            <div className="font-bold">{totalRequest}</div>
            <div className="font-bold">{totalRFID}</div>
          </div>
          <div className="flex py-4">
            <Button
              _hover={{
                shadow: 'md',
                transform: 'translateY(-5px)',
                transitionDuration: '0.2s',
                transitionTimingFunction: 'ease-in-out',
              }}
              type="button"
              size="sm"
              px={10}
              className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold"
              onClick={scanning ? stopScanning : startScanning}
            >
              {scanning ? <StopIcon className="h-6 animate-pulse" /> : <p className="tracking-wide">Scan</p>}
            </Button>

            <Button
              _hover={{
                shadow: 'md',
                transform: 'translateY(-5px)',
                transitionDuration: '0.2s',
                transitionTimingFunction: 'ease-in-out',
              }}
              type="submit"
              size="sm"
              px={8}
              className="ml-4 rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold"
              onClick={onSubmitRFID}
              disabled={!isScanned}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-[#a2002d] pl-10">
          {totalRequest !== totalRFID ? 'The sum of request and rfid are not the same' : ''}
        </p>
      )}
      {onOverview && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="rounded rounded-2xl border shadow-lg modal-container bg-white w-[80%] mx-auto z-50 overflow-y-auto ">
            <div className="grid justify-items-end">
              <XIcon className="h-6 stroke-2" onClick={() => setOnOverview(!onOverview)} />
            </div>
            <div className="modal-content py-4 text-left px-6">
              <Datatable
                api={RequestApi}
                filterParams={{ status: 'PENDING' }}
                filterEnd
                filters={[
                  {
                    name: 'text',
                    type: 'addtext',
                    text: 'Request Overview',
                  },
                  {
                    name: 'request_number',
                    placeholder: 'Request Number',
                    icon: MagnifyClass,
                    alt: 'magnify',
                    type: 'input:addOn',
                    col: 2,
                  },
                ]}
                columns={[
                  { header: 'Request Number', value: 'request_number', copy: true, type: 'link' },
                  { header: 'User', value: 'request_by', copy: true },
                  { header: 'Activity', value: 'activity_name', copy: true },
                  { header: 'Date', value: 'activity_date', copy: true, type: 'date' },
                  { header: 'Notes', value: 'notes', copy: true, type: 'scrollable' },
                  { header: 'Status', value: 'status', copy: true },
                  { header: ' ', value: ' ', type: 'action-button' },
                ]}
                onSearch
                onActionButton={(idx, data) => onProcess(idx, data)}
              />
            </div>
          </div>
        </div>
      )}
      {onOpen && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded z-50 h-84">
            <form onSubmit={handleSubmit(onFinalSubmit)}>
              <p className="text-md font-bold py-2 px-4">Dashboard Transit</p>
              <div className="overflow-y-auto h-60 px-6 py-2">
                <table>
                  <thead>
                    <tr className="bg-[#bbc9ff] text-bold text-[#000]">
                      <th className="text-semibold text-[#000] text-center w-10 py-1.5 pl-2">NO</th>
                      <th className="text-semibold text-[#000] text-center w-20">SKU</th>
                      <th className="text-semibold text-[#000] text-center">PRODUCT</th>
                      <th className="text-semibold text-[#000] text-center">QTY</th>
                      <th aria-label="Mute volume" />
                      <th aria-label="Mute volume" />
                      <th aria-label="Mute volume" />
                      <th aria-label="Mute volume" />
                      <th aria-label="Mute volume" />
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((item, index) => {
                      return (
                        <tr key={item.id} className={`${index % 2 ? 'bg-gray-100' : ''} w-full`}>
                          <td className="w-10 text-center px-2">{index + 1}</td>
                          <td className="w-20 text-center px-2">
                            {item.product_sku}
                            <Controller
                              render={({ field }) => {
                                return <Input variant="unstyled" {...field} disabled className="hidden" />;
                              }}
                              name={`details.${index}.product_sku`}
                              className="hidden"
                              control={control}
                            />
                          </td>

                          <td className="w-60 px-2">
                            {item.product_name}
                            <Controller
                              render={({ field }) => {
                                return <Input variant="unstyled" {...field} disabled className="hidden" />;
                              }}
                              name={`details.${index}.product_name`}
                              className="hidden"
                              control={control}
                            />
                          </td>
                          <td className="w-20 text-center px-2">
                            {item.qty}
                            <Controller
                              render={({ field }) => {
                                return <Input variant="unstyled" {...field} disabled className="hidden" />;
                              }}
                              name={`details.${index}.qty`}
                              className="hidden"
                              control={control}
                            />
                          </td>
                          <td className="w-24 px-2">
                            <Controller
                              render={() => {
                                return (
                                  <Select
                                    name={`details.${index}.rack`}
                                    idx={index}
                                    placeholder="Rack"
                                    booleans={isSplit}
                                    options={storageData?.map(s => {
                                      return {
                                        label: s.rack_number,
                                        value: s.rack_number,
                                      };
                                    })}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                  />
                                );
                              }}
                              name={`details.${index}.rack`}
                              control={control}
                            />
                          </td>
                          <td className="w-24 px-2">
                            <Controller
                              render={() => {
                                return (
                                  <Select
                                    name={`details.${index}.bay`}
                                    idx={index}
                                    placeholder="Bay"
                                    booleans={isSplit}
                                    options={storageData?.map(s => {
                                      return {
                                        label: s.bay,
                                        value: s.bay,
                                      };
                                    })}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                  />
                                );
                              }}
                              name={`details.${index}.bay`}
                              control={control}
                            />
                          </td>
                          <td className="w-24 px-2">
                            <Controller
                              render={() => {
                                return (
                                  <Select
                                    name={`details.${index}.level`}
                                    idx={index}
                                    placeholder="Level"
                                    booleans={isSplit}
                                    options={storageData?.map(s => {
                                      return {
                                        label: s.level,
                                        value: s.level,
                                      };
                                    })}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                  />
                                );
                              }}
                              name={`details.${index}.level`}
                              control={control}
                            />
                          </td>
                          <td className="w-20 px-4">
                            <Controller
                              render={({ field }) => {
                                return <Input type="number" {...field} className="w-16" />;
                              }}
                              name={`details.${index}.child_qty`}
                              control={control}
                            />
                          </td>
                          <td className="w-20 px-4">
                            {item.qty ? (
                              <Button
                                size="sm"
                                type="button"
                                px={8}
                                className="rounded-full text-center text-white font-bold bg-gradient-to-r from-processbtnfrom to-processbtnto hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-secondarydeepo"
                                key={index}
                                onClick={() => {
                                  setCounter(count => count + 1);
                                  onSplit(item.product_id, item.qty, index + 1, item?.child_qty);
                                }}
                                // disabled={errors?.details?.length}
                              >
                                Split
                              </Button>
                            ) : (
                              <Button
                                px={6}
                                size="sm"
                                type="button"
                                className="rounded-full bg-[#eb6058] hover:bg-[#f35a52] text-[#fff] hover:text-gray-600 font-bold"
                                key={index}
                                onClick={() => {
                                  setCounter(count => {
                                    if (count > 2) return count - 1;
                                    return count;
                                  });
                                  remove(index);
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between">
                {errors && (
                  <span className="pl-10 text-[#a2002d]">{`${
                    Array.isArray(errors.details) && isSplit
                      ? errors?.details.filter(i => i !== undefined)
                      : errors?.details?.message || ' '
                  }`}</span>
                )}

                <div className="mr-4 mb-2">
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="button"
                    size="sm"
                    px={8}
                    className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold"
                    onClick={() => {
                      setCounter(2);
                      reset();
                      setOnOpen(!onOpen);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="submit"
                    size="sm"
                    px={8}
                    className="ml-4 rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Screen;
