import React, { useState, useContext, useEffect } from 'react';
import { Button, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useMediaQuery, Fade } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as yup from 'yup';
import Moment from 'moment';

import Swal from 'sweetalert2';
import { CalculatorIcon, XIcon } from '@heroicons/react/outline';
import { StopIcon } from '@heroicons/react/solid';
import { toCalculate } from '../../../utils/helper';
import { RequestApi, TransitApi } from '../../../services/api-transit';
import { ProductInfoApi } from '../../../services/api-master';
import LoadingHover from '../../../components/loading-hover-component';
import LoadingComponent from '../../../components/loading-component';
import MagnifyClass from '../../../assets/images/magnify-glass.svg';
import DatePicker from '../../../components/datepicker-component';
import Datatable from '../../../components/datatable-component';
import InputComponent from '../../../components/input-component';
import SimpleTable from './component/table';
import Allocate from './allocate';
import Badge from './component/badge-component';
import NoContent from './component/no-content';
import Context from '../../../context';

const swalButton = Swal.mixin({
  customClass: {
    confirmButton: 'rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold w-20 ml-4 ',
    cancelButton: 'rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold w-20',
  },
  buttonsStyling: false,
});

const allocated = [];
const product = yup.object({
  isAllocate: yup.boolean(),
});

const schema = yup.object({
  details: yup
    .array()
    .of(product)
    .min(1, 'must have at least one data')
    .test('details', 'all products must be allocated', value => {
      if (value.every(i => i.actual_qty)) {
        return true;
      }
      return false;
    }),
});

function Screen(props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { fields } = useFieldArray({
    control,
    name: 'details',
  });

  const { activityStore, store } = useContext(Context);
  const [isLarge] = useMediaQuery('(min-width: 1150px)');
  // const [requestDetailData, setRequestDetailData] = useState([]);
  const [transitData, setTransitData] = useState();
  const [allocateData, setAllocateData] = useState([]);
  const [productInfoData, setproductInfoData] = useState([]);
  const [rfidData, setRfidData] = useState([]);

  const [loadingAllocate, setLoadingAllocate] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [onOpenTransit, setOnOpenTransit] = useState(false);
  const [loadingHover, setLoadingHover] = useState(false);
  const [loadingRFID, setLoadingRFID] = useState(false);
  const [onAllocate, setOnAllocate] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
  const [loadtable, setLoadTable] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [onOpen, setOnOpen] = useState(false);
  const [error, setErrors] = useState(false);

  const [totalRequest, setTotalRequest] = useState(0);
  const [errMessage, setErrMessage] = useState('');
  const [totalRFID, setTotalRFID] = useState(0);
  const [requestId, setRequestId] = useState('');
  const [productId, setProductId] = useState('');
  const [timer, setTimer] = useState();

  useEffect(() => {
    if (activityStore?.getRequestNumber()) {
      setTimeout(() => {
        setRequestId(activityStore?.getRequestNumber());
        setOnOpenTransit(!onOpenTransit);
      }, 500);
    }
  }, [activityStore]);

  useEffect(() => {
    store.setIsDrawerOpen(isLarge);
  }, [isLarge]);

  useEffect(() => {
    if (requestId !== '') {
      setLoadingHover(true);
      setLoadingRequest(true);
      setLoadingRFID(true);
      RequestApi.find(requestId)
        .then(res => {
          setValue('details', res.detail);
          // setRequestDetailData(res.detail);
          setValue('activity_date', res?.activity_date ? Moment(res?.activity_date).toDate() : null);
          setValue('request_number', res?.request_number ? res?.request_number : '-');
          // setTotalRequest(toCalculate(res.detail, 'qty'));
          setLoadingRFID(false);
          setLoadingRequest(false);
          setLoadingHover(false);
        })
        .catch(error => {
          Swal.fire({ text: error?.message, icon: 'error' });
        });
    }
  }, [requestId]);

  useEffect(() => {
    if (productId && onAllocate) {
      ProductInfoApi.find(productId)
        .then(res => {
          setproductInfoData(res.product);
        })
        .catch(error => {
          Swal.fire({ text: error?.message, icon: 'error' });
        });
    }
  }, [productId]);

  useEffect(() => {
    if (allocateData.length > 0) {
      const filter = allocateData.filter(i => i.product_id === productId && i.actual_qty !== undefined);
      if (allocated.length === 0) {
        allocated.push(...allocateData);
      } else if (allocated.length > 0) {
        if (allocated[allocated.findIndex(f => f.product_id === productId)]?.product_id === productId) {
          allocated
            .filter(f => f.product_id === productId)
            .map((item, idx) => {
              item.actual_qty = allocateData[idx].actual_qty;
              return item;
            });
        } else {
          allocated.push(...allocateData);
        }
      }

      setValue(
        'details',
        fields.map(item => {
          if (filter.length > 0) {
            if (filter.find(i => i)?.product_id === item.product_id) {
              item.actual_qty = toCalculate(filter, 'actual_qty');
              item.source = filter.length;
            }
          }

          return item;
        })
      );
    }
  }, [allocateData]);

  const getTransitData = () => {
    TransitApi.get({ warehouse_id: store?.getWarehouseId() })
      .then(res => {
        setRfidData(res.data);
        setTotalRFID(toCalculate(res.data, 'qty') || 0);
        getTransit();
        setTimeout(() => {
          setLoadTable(false);
        }, 500);
      })
      .catch(error => {
        Swal.fire({ text: error?.data?.message, icon: 'error' });
      });
  };

  const getTransitDatas = () => {
    TransitApi.get({ warehouse_id: store?.getWarehouseId() })
      .then(res => {
        setRfidData(res.data);
        setTotalRFID(res.query.total || 0);

        setTimeout(() => {
          setLoadTable(false);
        }, 500);
      })
      .catch(error => {
        Swal.fire({ text: error?.data?.message, icon: 'error' });
      });
  };

  const getTransit = () => {
    setTimer(
      setInterval(() => {
        getTransitDatas();
        setLoadTable(true);
      }, 5000)
    );
  };
  const startScanning = () => {
    setScanning(true);

    if (!scanning && rfidData.length > 0) {
      setLoadingRFID(true);
      setRfidData([]);
      setTotalRFID();
      setTimeout(() => {
        setLoadingRFID(false);
      }, 500);

      getTransitData();
    } else {
      setLoadTable(true);
      setTimeout(() => {
        getTransitData();
      }, 500);
    }

    setIsScanned(false);
  };

  const stopScanning = () => {
    setScanning(false);
    setIsScanned(true);
    clearInterval(timer);
  };

  const onProcess = id => {
    if (id) {
      setRequestId(id);
      setOnOverview(!onOverview);
      setOnOpenTransit(!onOpenTransit);
    }
  };

  const onReset = () => {
    setLoadingRequest(true);
    setLoadingRFID(true);
    setIsScanned(false);
    setRfidData([]);
    setTransitData([]);
    if (allocated.length > 0) {
      allocated.length = 0;
    }
    if (activityStore.getRequestNumber()) {
      activityStore.setRequestNumber('');
    }

    setRequestId('');
    setTotalRFID();
    setTotalRequest('');
    setValue('activity_date', null);
    setValue('request_number', '');
    setTimeout(() => {
      setLoadingRequest(false);
      setLoadingRFID(false);
    }, 500);
  };

  const onCancel = () => {
    Swal.fire({
      html: '<p class="font-semibold">Transit data may not be saved <br/> Are your sure to cancel ?</p>',
      width: '30%',
      showCancelButton: true,
      confirmButtonColor: '#ee5e68',
      cancelButtonColor: '#8388a5',
      confirmButtonText: 'Yes',
      reverseButtons: true,
      cancelButtonText: 'No',
    }).then(result => {
      if (result.isConfirmed) {
        setOnOpenTransit(!onOpenTransit);
        setValue('details', fields);
      }
    });
  };

  const onSubmitTransit = data => {
    setTransitData(data);
    setTotalRequest(toCalculate(data.details, 'actual_qty'));
    setOnOpenTransit(!onOpenTransit);
  };

  const onDisabled = () => {
    let pass = false;

    if (!isScanned && totalRFID > 0) {
      pass = true;
    } else if (!isScanned && !totalRFID) {
      pass = true;
    } else if (isScanned && !totalRFID) {
      pass = true;
    }
    return pass;
  };

  const validateValue = () => {
    let pass = true;

    if (totalRequest === totalRFID) {
      pass = true;
      setErrors(false);
      setErrMessage('');
    } else {
      pass = false;
      setErrors(true);
      setErrMessage('The amount of data in Request Detail does not match the data in RFID Detected.');
    }
    return pass;
  };

  const storeOutbound = body => {
    TransitApi.outbound(body)
      .then(() => {
        setOnOpen(!onOpen);
        setErrMessage('');
        setErrors(false);
        setRfidData([]);
        setTransitData([]);
        if (allocated.length > 0) {
          allocated.length = 0;
        }
        if (activityStore.getRequestNumber()) {
          activityStore.setRequestNumber('');
        }

        setRequestId('');
        setTotalRFID();
        setTotalRequest('');
        setValue('activity_date', null);
        setValue('request_number', '');
        allocated.length = 0;
        if (activityStore.getRequestNumber()) {
          activityStore.setRequestNumber(0);
        }
        Swal.fire({ text: 'Succesfully Saved', icon: 'success' });
      })
      .catch(error => {
        Swal.fire({ text: error?.data?.message, icon: 'error' });
      });
  };

  const onSubmitRFID = () => {
    if (validateValue()) {
      const body = {
        request_id: requestId,
        notes: '',
        warehouse_id: store?.getWarehouseId(),
        details: transitData.details.map(i => {
          return {
            product_id: i.product_id,
            qty: i.qty,
            allocate: allocated
              .filter(f => f.product_id === i.product_id && f.actual_qty !== undefined)
              .map(item => {
                return {
                  id: item.product_info_id,
                  storage_id: item.storage_id,
                  product_id: item.product_id,
                  actual_qty: Number(item.actual_qty),
                };
              }),
          };
        }),
      };
      storeOutbound(body);
    } else {
      swalButton
        .fire({
          html: '<b> NOTES </b> <br/> <p class="text-[15px]">The amount of data in Request Detail does not match the data in RFID Detected. Continue process?<p>',
          input: 'text',
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonColor: '#3085d6',
          preConfirm: pre => {
            if (!pre && pre.length === 0) {
              Swal.showValidationMessage(`notes is a required field`);
            } else if (pre.length <= 5) {
              Swal.showValidationMessage(`notes length must be more than 5`);
            }
            return pre;
          },
        })
        .then(result => {
          if (result.isConfirmed) {
            const body = {
              request_id: requestId,
              notes: result.value,
              warehouse_id: Number(store?.getWarehouseId()),
              details: transitData.details.map(i => {
                return {
                  product_id: i.product_id,
                  qty: i.qty,
                  allocate: allocated
                    .filter(f => f.product_id === i.product_id && f.actual_qty !== undefined)
                    .map(item => {
                      return {
                        id: item.product_info_id,
                        storage_id: item.storage_id,
                        product_id: item.product_id,
                        actual_qty: Number(item.actual_qty),
                      };
                    }),
                };
              }),
            };
            storeOutbound(body);
          }
        });
    }
  };

  return (
    <Fade in={props}>
      {loadingHover && <LoadingHover left="[20%]" top="[9%]" />}
      <div className="grid grid-rows-4 bg-white px-5 py-1 rounded-3xl drop-shadow-xl w-full h-[98%]">
        <div className="">
          <fieldset className="border border-primarydeepo w-full h-full px-6 rounded-2xl">
            <legend className="sm:text-xl xl:text-3xl text-primarydeepo font-semibold p-2">Request</legend>

            <div className="flex my-auto">
              <button
                type="submit"
                onClick={() => setOnOverview(!onOverview)}
                className={`${scanning ? 'bg-[#ffc108]' : 'bg-processbtnfrom'}  h-3/4 rounded-lg px-4 ${
                  isLarge ? 'py-2' : 'my-auto pb-2'
                } `}
                disabled={scanning}
              >
                <p className="md:text-sm xl:text-lg text-[#fff] sm:font-semibold xl:font-semibold">Request</p>
                <CalculatorIcon
                  className={`${scanning ? 'bg-[#ffc108]' : 'bg-processbtnfrom'} h-12 w-15 stroke-[#fff] mx-auto`}
                />
              </button>

              <div className={`${isLarge ? 'flex gap-6' : ''} w-3/4 pl-10 pb-4`}>
                <InputComponent
                  name="request_number"
                  label="Request Number"
                  register={register}
                  control={control}
                  errors={errors}
                  disabled
                />
                <DatePicker
                  name="activity_date"
                  label="Date"
                  register={register}
                  control={control}
                  errors={errors}
                  isLarge={isLarge}
                  disabled
                />
              </div>
            </div>
          </fieldset>
        </div>

        <div className={`${isLarge ? 'flex gap-4' : ''} h-full w-full row-span-2`}>
          <fieldset
            className={`${isLarge ? 'h-full py-8' : 'h-1/2 py-4'} border border-primarydeepo w-full rounded-3xl px-2`}
          >
            <legend className="px-2 sm:text-xl xl:text-3xl text-primarydeepo font-semibold">Request Detail</legend>
            <LoadingComponent visible={loadingRequest} />
            {!loadingRequest ? (
              <SimpleTable
                data={
                  transitData?.details?.map(d => {
                    return {
                      product_id: d.product_id,
                      product_name: d.product_name,
                      product_sku: d.product_sku,
                      qty: d.actual_qty,
                    };
                  }) || []
                }
                isLarge={isLarge}
              />
            ) : null}
          </fieldset>
          <fieldset
            className={`${isLarge ? 'h-full py-8' : 'h-1/2 py-4'} border border-primarydeepo w-full rounded-3xl px-2`}
          >
            <legend className="px-2 sm:text-xl xl:text-3xl text-primarydeepo font-semibold">RFID Detected</legend>
            <LoadingComponent visible={loadingRFID} />
            {!loadingRFID ? (
              <SimpleTable
                loading={loadtable}
                data={rfidData.map(i => {
                  return {
                    product_id: i.product_id,
                    product_name: i.product_name,
                    product_sku: i.sku,
                    qty: i.qty,
                    warehouse_id: i.warehouse_id,
                  };
                })}
                isLarge={isLarge}
              />
            ) : null}
          </fieldset>
        </div>

        <div className="my-auto">
          <div className={`border  ${error ? 'border-[#a2002d]' : 'border-primarydeepo'}  w-full px-4 rounded-3xl`}>
            <div className="flex w-full py-2">
              <div className="grid py-auto w-1/2">
                <div className="flex">
                  <div className="max-sm:text-xs xl:text-lg w-1/2">Total Request</div>
                  <div className="font-bold">{totalRequest}</div>
                </div>
                <div className="flex">
                  <div className="max-sm:text-xs xl:text-lg w-1/2">
                    {isLarge ? 'Total RFID Detected' : 'Total RFID'}{' '}
                  </div>
                  <div className="font-bold">{totalRFID}</div>
                </div>
              </div>

              <div className="grid w-1/2">
                <div
                  className={`${isLarge ? 'grid grid-cols-3 justify-place-end pl-8' : 'flex flex-wrap my-2 '} my-auto `}
                >
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="button"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 5 : 2}
                    className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold"
                    onClick={scanning ? stopScanning : startScanning}
                    disabled={transitData ? transitData?.details?.length === 0 || transitData?.length === 0 : true}
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
                    type="button"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 6 : 2}
                    className={`rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold ${
                      isLarge ? 'mx-4' : 'mx-2'
                    } `}
                    onClick={onReset}
                    disabled={scanning}
                  >
                    <p className="tracking-wide">Reset</p>
                  </Button>

                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="submit"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 6 : 3}
                    className={`rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold ${
                      isLarge ? '' : 'mt-2'
                    } `}
                    onClick={onSubmitRFID}
                    disabled={onDisabled()}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <p className="text-[#a2002d] pl-10">
              {totalRequest !== totalRFID
                ? 'The amount of data in Request Detail does not match the data in RFID Detected.'
                : errMessage}
            </p>
          )}
        </div>
      </div>
      {onOverview && (
        <div
          className=" main-modal fixed w-full h-full inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="rounded rounded-3xl border shadow-lg modal-container bg-white w-[80%] h-3/4 mx-auto z-50 overflow-y-auto ">
            <div className="grid justify-items-end">
              <XIcon
                className="fixed h-6 stroke-2 mr-1 pointer-events-auto"
                onClick={() => setOnOverview(!onOverview)}
              />
            </div>
            <div className="modal-content py-4 text-left px-6">
              <Datatable
                api={RequestApi}
                filterParams={{ status: 'PENDING' }}
                filterEnd
                limit={5}
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
                onActionButton={(id, data) => onProcess(id, data)}
              />
            </div>
          </div>
        </div>
      )}
      {onOpenTransit && (
        <div
          className=" main-modal fixed w-full inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] max-h-80 mx-auto rounded z-50">
            <form onSubmit={handleSubmit(onSubmitTransit)}>
              <p className="text-md font-bold py-1 px-2">Dashboard Transit</p>
              <div className="max-h-80 overflow-y-auto overflow-x-hidden p-5">
                <TableContainer className="px-4 py-1">
                  <Table>
                    <Thead>
                      <Tr className="bg-[#bbc9ff] text-bold text-[#000] w-full">
                        <Th className="text-semibold text-[#000] text-center w-10 py-1.5 pl-2">NO</Th>
                        <Th className="text-semibold text-[#000] text-center w-20">SKU</Th>
                        <Th className="text-bold text-[#000] text-cente w-60">PRODUCT</Th>
                        <Th className="text-semibold text-[#000] text-center w-20 ">Qty</Th>
                        <Th className="text-semibold text-[#000] text-center w-20 ">Actual Qty</Th>
                        <Th className="text-semibold text-[#000] text-center w-20 ">SOURCE</Th>
                        <Th aria-label="Mute volume" className="w-10" />
                        <Th aria-label="Mute volume" className="w-10" />
                      </Tr>
                    </Thead>

                    <Tbody className="overflow-y-auto">
                      {fields.length > 0 ? (
                        fields.map((item, index) => {
                          return (
                            <Tr key={item.id} className={`${index % 2 ? 'bg-gray-100' : ''} w-full`}>
                              <Td className="w-10 text-center px-2">{index + 1}</Td>
                              <Td className="w-20 text-center px-2">
                                {item.product_sku}
                                <Controller
                                  render={({ field }) => {
                                    return <Input variant="unstyled" {...field} disabled className="hidden" />;
                                  }}
                                  name={`details.${index}.product_sku`}
                                  className="hidden"
                                  control={control}
                                />
                              </Td>

                              <Td className="w-60 px-2">
                                {item.product_name}
                                <Controller
                                  render={({ field }) => {
                                    return <Input variant="unstyled" {...field} disabled className="hidden" />;
                                  }}
                                  name={`details.${index}.product_name`}
                                  className="hidden"
                                  control={control}
                                />
                              </Td>
                              <Td className="w-20 text-center px-2">
                                {item.qty}
                                <Controller
                                  render={({ field }) => {
                                    return <Input variant="unstyled" {...field} disabled className="hidden" />;
                                  }}
                                  name={`details.${index}.qty`}
                                  className="hidden"
                                  control={control}
                                />
                              </Td>
                              <Td className="w-20 text-center px-2">
                                {item.actual_qty}
                                <Controller
                                  render={({ field }) => {
                                    return <Input variant="unstyled" {...field} disabled className="hidden" />;
                                  }}
                                  name={`details.${index}.actual_qty`}
                                  className="hidden"
                                  control={control}
                                />
                              </Td>
                              <Td className="w-20 text-center px-2">
                                {item.source ? `${item.source} Rack` : ''}
                                <Controller
                                  render={({ field }) => {
                                    return <Input variant="unstyled" {...field} disabled className="hidden" />;
                                  }}
                                  name={`details.${index}.source`}
                                  className="hidden"
                                  control={control}
                                />
                              </Td>
                              <Td className="w-24 px-2">
                                <Controller
                                  render={({ field }) => {
                                    if (item.actual_qty) {
                                      // if (isAllocate?.find(f => f.product_id === item.product_id)?.isAllocate) {
                                      return (
                                        <Badge
                                          name={`details.${index}.isAllocate`}
                                          idx={index}
                                          {...field}
                                          errName="allocate"
                                          control={control}
                                          register={register}
                                          label="allocated"
                                          errors={errors}
                                        />
                                      );
                                      // }
                                    }
                                    return null;
                                  }}
                                  name={`details.${index}.isAllocate`}
                                  className="hidden"
                                  control={control}
                                />
                              </Td>
                              <Td className="w-10 px-4">
                                <Button
                                  size="sm"
                                  type="button"
                                  px={6}
                                  className="rounded-full border-2 border-[#9bd0b4] bg-[#fff] hover:bg-[#E4E4E4] text-[#5dc08b] font-bold"
                                  key={index}
                                  onClick={() => {
                                    setProductId(item.product_id);
                                    setOnAllocate(!onAllocate);
                                    setLoadingAllocate(true);
                                    setTimeout(() => {
                                      setLoadingAllocate(false);
                                    }, 500);
                                  }}
                                >
                                  Allocate
                                </Button>
                              </Td>
                            </Tr>
                          );
                        })
                      ) : (
                        <NoContent />
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>

              <div className="flex justify-between">
                {Object.entries(errors).length > 0 ? (
                  <span className="pl-10 text-[#a2002d]">{`${
                    Array.isArray(errors.details)
                      ? errors?.details?.filter(i => i !== undefined).length > 0
                        ? 'storage is required'
                        : ''
                      : errors?.details?.message || ' '
                  }`}</span>
                ) : (
                  <span />
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
                    onClick={onCancel}
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
      {onAllocate && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded z-50 h-84">
            <LoadingComponent loading={loadingAllocate} />
            <Allocate
              productId={productId}
              onAllocate={onAllocate}
              setOnAllocate={setOnAllocate}
              data={productInfoData}
              allocateData={allocateData}
              setAllocateData={setAllocateData}
              allocated={allocated}
            />
          </div>
        </div>
      )}
    </Fade>
  );
}

export default Screen;
