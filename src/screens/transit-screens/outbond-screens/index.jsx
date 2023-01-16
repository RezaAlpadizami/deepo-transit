import React, { useState, useContext, useEffect } from 'react';
import { Button, Fade, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
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
import TableCh from './table';
import Allocate from './allocate';
import Badge from './component/badge-component';
import NoContent from './component/no-content';
import Context from '../../../context';

const swalButton = Swal.mixin({
  customClass: {
    confirmButton: 'rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold w-20',
    cancelButton:
      'ml-4 rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold w-20',
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

function Screen() {
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
  const [requestDetailData, setRequestDetailData] = useState([]);
  const [transitData, setTransitData] = useState();
  const [allocateData, setAllocateData] = useState([]);
  const [productInfoData, setproductInfoData] = useState([]);
  const [rfidData, setRfidData] = useState([]);
  const [isAllocate, setIsAllocate] = useState([]);

  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingTransit, setLoadingTransit] = useState(false);
  const [onOpenTransit, setOnOpenTransit] = useState(false);
  const [loadingHover, setLoadingHover] = useState(false);
  const [loadingRFID, setLoadingRFID] = useState(false);
  const [onAllocate, setOnAllocate] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
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
      setRequestId(activityStore?.getRequestNumber());
    }
  }, [activityStore]);

  useEffect(() => {
    if (requestId !== '') {
      setLoadingHover(true);
      setLoadingRequest(true);
      setLoadingRFID(true);
      RequestApi.find(requestId)
        .then(res => {
          setValue('details', res.detail);
          setRequestDetailData(res.detail);
          setValue('activity_date', res?.activity_date ? Moment(res?.activity_date).toDate() : null);
          setValue('request_number', res?.request_number ? res?.request_number : '-');
          setTotalRequest(toCalculate(res.detail, 'qty'));
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

  const getTransit = () => {
    setTimer(
      setInterval(() => {
        TransitApi.get()
          .then(res => {
            setRfidData(res.data);
            setTotalRFID(res.query.total || 0);
          })
          .catch(error => {
            Swal.fire({ text: error?.data?.message, icon: 'error' });
          });
      }, 5000)
    );
  };

  const startScanning = () => {
    setScanning(true);

    if (!scanning && rfidData.length > 0) {
      setLoadingRFID(true);
      setRfidData([]);
      setTimeout(() => {
        setLoadingRFID(false);
      }, 500);

      getTransit();
    } else {
      getTransit();
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
      setLoadingTransit(true);
    }
  };

  const onReset = () => {
    setLoadingRequest(true);
    setLoadingRFID(true);
    setIsScanned(false);
    setRequestDetailData([]);
    setRfidData([]);
    setIsAllocate([]);
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
        setIsAllocate([]);
        setValue('details', fields);
      }
    });
  };

  const onSubmitTransit = data => {
    setTransitData(data);
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
        setIsAllocate([]);
        setOnOpen(!onOpen);
        setErrMessage('');
        setErrors(false);
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
            allocate: allocated.filter(f => f.product_id === i.product_id && f.actual_qty !== undefined),
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
    <div className="bg-white p-5 rounded-[55px] shadow px-6 pb-11">
      {loadingHover && <LoadingHover left="[20%]" top="[9%]" />}
      <fieldset className="border border-primarydeepo w-full h-full px-8 rounded-[30px] pb-6">
        <legend className="px-2 text-[28px] text-primarydeepo font-semibold">Request</legend>
        <div className="grid grid-cols-8 gap-6">
          <button
            type="submit"
            onClick={() => setOnOverview(!onOverview)}
            className={`${
              scanning ? 'bg-[#ffc108]' : 'bg-processbtnfrom'
            }  h-[100px] w-[110px] rounded-lg grid place-content-center ml-6 mt-2 col-span-2 mt-2`}
            disabled={scanning}
          >
            <p className="text-lg text-[#fff] font-bold mb-2">Request</p>
            <CalculatorIcon
              className={`${
                scanning ? 'bg-[#ffc108]' : 'bg-processbtnfrom'
              } h-10 w-15 bg-processbtnfrom stroke-[#fff] mx-auto`}
            />
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
              name="activity_date"
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
        <fieldset className="border border-primarydeepo w-full h-full px-8 py-12 rounded-[30px]">
          <legend className="px-2 text-[28px] text-primarydeepo font-semibold">Request Detail</legend>
          <LoadingComponent visible={loadingRequest} />
          {!loadingRequest ? <TableCh data={requestDetailData} /> : null}
        </fieldset>
        <fieldset className="border border-primarydeepo w-full h-full px-8 py-12 rounded-[30px]">
          <legend className="px-2 text-[28px] text-primarydeepo font-semibold">RFID Detected</legend>
          <LoadingComponent visible={loadingRFID} />
          {!loadingRFID ? <TableCh data={rfidData} /> : null}
        </fieldset>
      </div>
      <div
        className={`border  ${
          error ? 'border-[#a2002d]' : 'border-primarydeepo'
        }  w-full h-full px-8 rounded-[30px] py-2 mt-10`}
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="py-auto">
            <div>Total Request</div>
            <div>Total RFID Detected</div>
          </div>
          <div className="py-auto">
            <div className="font-bold">{totalRequest || ''}</div>
            <div className="font-bold">{totalRFID || ''}</div>
          </div>
          <div className="flex py-2">
            <Button
              _hover={{
                shadow: 'md',
                transform: 'translateY(-5px)',
                transitionDuration: '0.2s',
                transitionTimingFunction: 'ease-in-out',
              }}
              type="button"
              size="sm"
              px={6}
              className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold"
              onClick={scanning ? stopScanning : startScanning}
              disabled={requestDetailData.length === 0}
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
              size="sm"
              px={6}
              className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold mx-4"
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
              size="sm"
              px={6}
              className="rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold"
              onClick={onSubmitRFID}
              disabled={onDisabled()}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      {error && <span className="pl-10 text-sm text-[#a2002d]">{errMessage || ''}</span>}
      {onOverview && (
        <Fade in={onOverview}>
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
                  onActionButton={(id, data) => onProcess(id, data)}
                />
              </div>
            </div>
          </div>
        </Fade>
      )}
      {onOpenTransit && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded z-50 h-84">
            <form onSubmit={handleSubmit(onSubmitTransit)}>
              <p className="text-md font-bold py-2 px-4">Dashboard Transit</p>

              <div className="overflow-y-auto h-60 px-6 py-2">
                <LoadingComponent loading={loadingTransit} />
                <TableContainer>
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
                                    if (isAllocate.length > 0) {
                                      if (isAllocate?.find(f => f.product_id === item.product_id)?.isAllocate) {
                                        return (
                                          <Badge
                                            name={`details.${index}.isAllocate`}
                                            idx={index}
                                            {...field}
                                            control={control}
                                            register={register}
                                            label="allocated"
                                            errors={errors}
                                          />
                                        );
                                      }
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
                {errors && (
                  <span className="pl-10 text-[#a2002d]">{`${
                    Array.isArray(errors.details)
                      ? errors?.details?.filter(i => i !== undefined).length > 0
                        ? 'storage is required'
                        : ''
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
            <Allocate
              productId={productId}
              onAllocate={onAllocate}
              setOnAllocate={setOnAllocate}
              data={productInfoData}
              allocateData={allocateData}
              setAllocateData={setAllocateData}
              loadingTransit={loadingTransit}
              setIsAllocate={setIsAllocate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Screen;
