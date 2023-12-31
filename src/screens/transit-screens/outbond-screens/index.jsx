import React, { useState, useEffect, useContext, useMemo } from 'react';

import * as yup from 'yup';
import Moment from 'moment';
import Swal from 'sweetalert2';
// import { StopIcon } from '@heroicons/react/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { XIcon } from '@heroicons/react/outline';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useMediaQuery, Fade } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import Allocate from './allocate';
import Context from '../../../context';
import SimpleTable from './component/table';
import NoContent from './component/no-content';
import Badge from './component/badge-component';
import { toCalculate } from '../../../utils/helper';
import Loading from '../../../assets/lotties/Loading.json';
import { ProductInfoApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';
import InputComponent from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import MagnifyClass from '../../../assets/images/magnify-glass.svg';
// import LoadingComponent from '../../../components/loading-component';
import { RequestApi, TransitApi, AmqpScanApi } from '../../../services/api-transit';
// import LoadingHover from '../../../components/loading-hover-component';
import LottiesLoading from '../../../components/lotties-animation-component';
import { clipboardRequest } from '../../../assets/images';
import TextArea from '../../../components/textarea-component';
import TableRegistration from '../../../components/table-registration-component';
import FilePicker from '../../../components/file-local-picker-component';
import CookieService from '../../../services/cookies/cookie-service';

const swalButton = Swal.mixin({
  customClass: {
    confirmButton:
      'rounded-md bg-[#50B8C1] px-6 py-1 drop-shadow-md text-[#fff] font-bold ml-4 hover:-translate-y-[5px] hover:ease-in-out hover:duration-200',
    cancelButton: 'rounded-md border border-[#50B8C1] px-6 py-1 bg-[#fff] hover:bg-gray-100 text-[#50B8C1] font-bold',
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

  const { activityStore, store, registrationStore } = useContext(Context);
  const getWarehouseId = CookieService.getCookies('warehouse_id');
  const [isLarge] = useMediaQuery('(min-width: 1150px)');
  const [transitData, setTransitData] = useState();
  const [allocateData, setAllocateData] = useState([]);
  const [productInfoData, setproductInfoData] = useState([]);
  // const [rfidData, setRfidData] = useState([]);

  const [loadingAllocate, setLoadingAllocate] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [onOpenTransit, setOnOpenTransit] = useState(false);
  const [loadingHover, setLoadingHover] = useState(false);
  const [loadingRFID, setLoadingRFID] = useState(false);
  const [onAllocate, setOnAllocate] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
  // const [isScanned, setIsScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setErrors] = useState(false);
  const [isLoadingCheckLabel, setIsLoadingCheckLabel] = useState(false);

  const [totalRequest, setTotalRequest] = useState(0);
  const [errMessage, setErrMessage] = useState('');
  // const [totalRFID, setTotalRFID] = useState(0);
  const [requestId, setRequestId] = useState('');
  const [productId, setProductId] = useState('');
  const [jsonArray, setJsonArray] = useState([]);
  const location = useLocation();

  const rfidDatas = [...registrationStore.getProductRegistered()];

  useEffect(() => {
    if (activityStore?.getRequestNumber() && activityStore?.getActivityName()?.toLowerCase() === 'outbound') {
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
          setValue('activity_date', res?.activity_date ? Moment(res?.activity_date).toDate() : null);
          setValue('request_number', res?.request_number ? res?.request_number : '-');
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

  const dynamicPath = localStorage.getItem('dynamicPath');

  const memoizedData = useMemo(() => {
    return jsonArray.map(i => {
      return {
        key: i.product_id,
        rfid_number: i.rfid_number,
        product_id: i.product_id,
        product_name: i.product_name,
        product_sku: i.sku,
        in_stock: i.in_stock,
      };
    });
  }, [jsonArray]);

  const toggleScan = () => {
    const newIsScanning = !isScanning;
    setIsScanning(newIsScanning);
  };

  const handleAmqpScanReset = () => {
    const body = {
      type: 'RESET',
      logInfo: 'resetListOfTags',
      message: 'true',
    };

    AmqpScanApi.amqpScan(body)
      .then(res => {
        console.log('res', res);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const handleAmqpScan = status => {
    const scanType = status;
    const body = {
      type: location.pathname === '/inbound' ? 'INBOUND' : location.pathname === '/outbound' ? 'OUTBOUND' : 'REGIS',
      logInfo: 'info',
      message: {
        scanType,
      },
    };

    AmqpScanApi.amqpScan(body)
      .then(res => {
        console.log('res', res);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const onFileChange = newFileContent => {
    setLoadingRFID(true);

    const lines = newFileContent.split('\n');
    const newJsonArray = lines.filter(line => line.trim() !== '').map(line => ({ rfid_number: line.trim() }));
    setJsonArray(newJsonArray);
    setLoadingRFID(false);
  };

  // const getTransitData = () => {
  //   TransitApi.get({ warehouse_id: store?.getWarehouseId() })
  //     .then(res => {
  //       setRfidData(res.data);
  //       setTotalRFID(toCalculate(res.data, 'qty') || 0);
  //       getTransit();
  //       setTimeout(() => {
  //         setLoadTable(false);
  //       }, 500);
  //     })
  //     .catch(error => {
  //       Swal.fire({ text: error?.data?.message, icon: 'error' });
  //     });
  // };

  // const getTransitDatas = () => {
  //   TransitApi.get({ warehouse_id: store?.getWarehouseId() })
  //     .then(res => {
  //       setRfidData(res.data);
  //       setTotalRFID(res.query.total || 0);

  //       setTimeout(() => {
  //         setLoadTable(false);
  //       }, 500);
  //     })
  //     .catch(error => {
  //       Swal.fire({ text: error?.data?.message, icon: 'error' });
  //     });
  // };

  // const getTransit = () => {
  //   setTimer(
  //     setInterval(() => {
  //       getTransitDatas();
  //       setLoadTable(true);
  //     }, 5000)
  //   );
  // };
  // const startScanning = () => {
  //   setScanning(true);

  //   if (!scanning && rfidData.length > 0) {
  //     setLoadingRFID(true);
  //     setRfidData([]);
  //     setTotalRFID();
  //     setTimeout(() => {
  //       setLoadingRFID(false);
  //     }, 500);

  //     getTransitData();
  //   } else {
  //     setLoadTable(true);
  //     setTimeout(() => {
  //       getTransitData();
  //     }, 500);
  //   }

  //   setIsScanned(false);
  // };

  // const stopScanning = () => {
  //   setScanning(false);
  //   setIsScanned(true);
  //   clearInterval(timer);
  // };

  const onProcess = id => {
    if (id) {
      setRequestId(id);
      setOnOverview(!onOverview);
      setOnOpenTransit(!onOpenTransit);
      handleAmqpScan('RUNNING');
    }
  };

  const onReset = () => {
    setLoadingRequest(true);
    setLoadingRFID(true);
    // setIsScanned(false);
    setJsonArray([]);
    setTransitData([]);
    setAllocateData([]);
    setproductInfoData([]);
    handleAmqpScanReset();
    if (allocated.length > 0) {
      allocated.length = 0;
    }
    if (activityStore.getRequestNumber() && activityStore?.getActivityName()) {
      activityStore.setRequestNumber(0);
      activityStore?.setActivityName('');
    }

    setRequestId('');
    // setTotalRFID();
    setTotalRequest('');
    setValue('details', []);
    setValue('activity_date', null);
    setValue('request_number', '');
    setTimeout(() => {
      setLoadingRequest(false);
      setLoadingRFID(false);
    }, 500);
  };

  const onCancel = () => {
    swalButton
      .fire({
        html: '<p class="font-semibold">Transit data may not be saved <br/> Are your sure to cancel ?</p>',
        width: '30%',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        reverseButtons: true,
        cancelButtonText: 'No',
      })
      .then(result => {
        if (result.isConfirmed) {
          setOnOpenTransit(false);
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

    if (isScanning && jsonArray.length > 0) {
      pass = true;
    } else if (!isScanning && !jsonArray.length) {
      pass = true;
    } else if (isScanning && !jsonArray.length) {
      pass = true;
    }
    return pass;
  };

  const validateValue = () => {
    let pass = true;

    if (totalRequest === jsonArray.length) {
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
        setOnOpenTransit(false);
        setErrMessage('');
        setErrors(false);
        // setRfidData([]);
        setTransitData([]);
        setAllocateData([]);
        setproductInfoData([]);
        if (allocated.length > 0) {
          allocated.length = 0;
        }
        if (activityStore.getRequestNumber() && activityStore?.getActivityName()) {
          activityStore.setRequestNumber(0);
          activityStore?.setActivityName('');
        }
        setRequestId('');
        // setTotalRFID();
        setTotalRequest('');
        setValue('details', []);
        setValue('activity_date', null);
        setValue('request_number', '');
        setTimeout(() => {
          setLoadingRequest(false);
          setLoadingRFID(false);
        }, 500);

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
        warehouse_id: CookieService.getCookies('warehouse_id'),
        detail: rfidDatas.map(i => {
          const allocatedItems = allocated
            .filter(f => f.product_id === i.product_id && f.actual_qty !== undefined)
            .map(item => item.storage_id);

          const storage_id = allocatedItems.length > 0 ? allocatedItems[0] : null;
          return {
            product_id: i.product_id,
            label_id: i.id,
            storage_id,
          };
        }),
      };
      storeOutbound(body);
      handleAmqpScan('STOP');
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
              warehouse_id: getWarehouseId,
              details: rfidDatas.map(i => {
                return {
                  product_id: i.product_id,
                  qty: i.qty,
                  allocate: allocated
                    .filter(f => f.product_id === i.product_id && f.actual_qty !== undefined)
                    .map(item => {
                      return {
                        storage_id: item.storage_id,
                        actual_qty: Number(item.actual_qty),
                      };
                    }),
                };
              }),
            };
            storeOutbound(body);
            handleAmqpScan('STOP');
          }
        });
    }
  };

  return (
    <Fade in={props}>
      {loadingHover && (
        <LottiesLoading
          animationsData={Loading}
          classCustom="z-[999] right-0 left-[20%] top-[9%] absolute bottom-0 overflow-hidden bg-[#f2f2f2] opacity-75 flex flex-col items-center justify-center"
        />
      )}
      <div className="grid grid-rows-7 px-8 py-1 rounded-md w-full h-full">
        <div className="mb-2">
          <fieldset className="bg-white w-full h-full px-8 py-6 rounded-3xl">
            {/* <legend className="sm:text-xl xl:text-3xl text-primarydeepo font-semibold p-2">Request</legend> */}

            <div className="flex my-auto">
              <button
                type="submit"
                onClick={() => setOnOverview(!onOverview)}
                className={`${
                  isScanning ? 'bg-[#50B8C1]' : 'bg-white'
                }  h-3/4 rounded-md border border-[#C2C2C2] px-3 ${isLarge ? 'py-2' : 'my-auto pb-2'} `}
                disabled={isScanning}
              >
                <p
                  className={`md:text-sm xl:text-md text-xs ${
                    isScanning ? 'text-[#FFF]' : 'text-[#50B8C1]'
                  } sm:font-semibold xl:font-semibold`}
                >
                  {isScanning ? 'Request is Scanning . .' : 'Request'}
                </p>
                {/* <CalculatorIcon className={`${scanning ? 'bg-[#ffc108]' : 'bg-white'} w-28 stroke-[#50B8C1] mx-auto`} /> */}
                <img src={clipboardRequest} alt="icon-request" width={120} />
              </button>
              <div className={`${isLarge ? 'flex gap-8' : ''} w-full pl-8 pb-2`}>
                <div className="flex-col w-[70%]">
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
                    disabled
                  />
                </div>
                <div className="w-full">
                  <TextArea name="notes" label="Notes" register={register} errors={errors} />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div className={`${isLarge ? 'flex gap-6 px-8' : ''} h-full w-full row-span-2 justify-center`}>
          <div className="w-full mb-6">
            {/* <h1 className="px-3 text-gray-400">Request Detail</h1> */}
            <fieldset
              className={`${
                isLarge ? 'min-h-[507px] py-8' : 'h-1/2 py-4'
              } bg-white w-full border border-[#C2C2C2] rounded-md px-2`}
            >
              <legend className="px-2 text-lg text-gray-400">Request Detail</legend>
              {/* <LoadingComponent visible={loadingRequest} /> */}
              <LottiesLoading
                animationsData={Loading}
                visible={loadingRequest}
                classCustom="h-full z-[999] opacity-100 flex flex-col items-center justify-center"
              />
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
          </div>
          <div className="w-full mb-6">
            {/* <h2 className="px-3 text-gray-400">RFID Detected</h2> */}
            <fieldset
              className={`${
                isLarge ? 'min-h-[507px] py-8' : 'h-1/2 py-4'
              } bg-white border border-[#C2C2C2] w-full rounded-md px-2`}
            >
              <legend className="px-2 text-lg text-gray-400">RFID Detected</legend>
              {loadingRFID ? (
                <LottiesLoading
                  visible={loadingRFID}
                  animationsData={Loading}
                  classCustom="h-full z-[999] opacity-100 flex flex-col items-center justify-center"
                />
              ) : (
                <TableRegistration
                  data={memoizedData}
                  isLarge={isLarge}
                  rfidTable
                  isLoadingCheckLabel={isLoadingCheckLabel}
                />
              )}
            </fieldset>
          </div>
        </div>

        <div className="my-auto px-8">
          <div className="rounded-md border border-[#C2C2C2] py-2">
            <div className="flex py-2 w-full">
              <div
                className={`grid w-full mr-16 bg-white px-4 py-2 rounded-3xl border ${
                  error ? 'border-red-500' : 'border-none'
                }`}
              >
                <div className="flex">
                  <div className="max-sm:text-xs xl:text-md w-1/2 flex-1">Total Request</div>
                  <div className="font-bold">{totalRequest}</div>
                </div>
                <div className="flex">
                  <div className="max-sm:text-xs xl:text-md w-1/2 flex-1">
                    {isLarge ? 'Total RFID Detected' : 'Total RFID'}{' '}
                  </div>
                  <div className="font-bold">{jsonArray.length}</div>
                </div>
              </div>

              <div className="flex justify-end w-full sm:space-x-[20%] md:space-x-[60%] xl:space-x-[70%]">
                <div className={`${isLarge ? 'flex flex-col gap-2 mx-8 w-[30%]' : 'flex flex-col gap-2 my-2 '}`}>
                  <FilePicker
                    onFileChange={onFileChange}
                    isScanning={isScanning}
                    toggleScan={toggleScan}
                    dynamicPath={dynamicPath}
                    dataRfid={memoizedData}
                    setIsLoadingCheckLabel={setIsLoadingCheckLabel}
                  />

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
                    className="rounded-md border border-[#757575] bg-[#fff] hover:bg-[#E4E4E4] text-[#757575] font-semibold"
                    onClick={onReset}
                    isDisabled={isScanning}
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
                    className={`rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-semibold ${
                      isLarge ? '' : 'mt-2'
                    } `}
                    onClick={onSubmitRFID}
                    isDisabled={onDisabled()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <p className="text-[#a2002d] pl-10">
              {totalRequest !== jsonArray.length
                ? 'The amount of data in Request Detail does not match the data in RFID Detected.'
                : errMessage}
            </p>
          )}
        </div>
      </div>
      {onOverview && (
        <div
          className="main-modal fixed w-full h-full inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="rounded-md border shadow-lg modal-container bg-white w-[80%] h-3/5 mx-auto z-50 overflow-y-hidden ">
            <div className="grid justify-items-end mb-8">
              <XIcon
                className="fixed h-6 stroke-2 my-2 px-2 pointer-events-auto cursor-pointer"
                onClick={() => setOnOverview(!onOverview)}
              />
            </div>
            <div className="modal-content py-4 text-left px-6">
              <Datatable
                api={RequestApi}
                filterParams={{ status: 'PENDING', activity_name: 'OUTBOUND' }}
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
                isInOut
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
                      <Tr className="bg-[#F5F5F5] text-bold text-[#000] w-full">
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
                                  className="rounded-md border-2 border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-bold"
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
                    className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-bold"
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
                    className="ml-4 rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold"
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
          <div className="border shadow-lg modal-container bg-white w-3/4 mx-auto rounded z-50 h-84">
            {/* <LoadingComponent loading={loadingAllocate} /> */}
            {loadingAllocate ? (
              <LottiesLoading
                visible={loadingAllocate}
                animationsData={Loading}
                classCustom="h-full z-[999] py-16 opacity-100 flex flex-col items-center justify-center"
              />
            ) : (
              <Allocate
                productId={productId}
                onAllocate={onAllocate}
                setOnAllocate={setOnAllocate}
                data={productInfoData}
                allocateData={allocateData}
                setAllocateData={setAllocateData}
                allocated={allocated}
              />
            )}
          </div>
        </div>
      )}
    </Fade>
  );
}

export default Screen;
