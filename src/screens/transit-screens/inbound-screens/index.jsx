import React, { useEffect, useState, useContext, useMemo } from 'react';

import * as yup from 'yup';
import Moment from 'moment';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { XIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, useMediaQuery, Input, Fade } from '@chakra-ui/react';

import Context from '../../../context';
import SimpleTable from './component/table';
import { toCalculate } from '../../../utils/helper';
import { clipboardRequest } from '../../../assets/images';
import { StorageApi } from '../../../services/api-master';
import Select from '../../../components/select-component';
import Loading from '../../../assets/lotties/Loading.json';
import TextArea from '../../../components/textarea-component';
import Datatable from '../../../components/datatable-component';
import InputComponent from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import MagnifyClass from '../../../assets/images/magnify-glass.svg';
import FilePicker from '../../../components/file-local-picker-component';
import LottiesAnimation from '../../../components/lotties-animation-component';
import TableRegistration from '../../../components/table-registration-component';
import { AmqpScanApi, RequestApi, TransitApi } from '../../../services/api-transit';

const swalButton = Swal.mixin({
  customClass: {
    confirmButton:
      'ml-4 rounded-md px-6 py-1 bg-[#50B8C1] drop-shadow-md text-xs text-[#fff] font-bold hover:-translate-y-0.5 hover:ease-in-out hover:duration-200',
    cancelButton:
      'rounded-md px-6 py-1 border border-[#50B8C1] bg-[#fff] text-xs hover:bg-gray-100 hover:text-red-400 text-[#50B8C1] font-bold',
  },
  buttonsStyling: false,
});

const storage = yup.object({
  rack: yup.string().test('rack', 'rack is required', value => {
    if (value) {
      return true;
    }
    return false;
  }),
  level: yup.string().test('level', 'level is required', value => {
    if (value) {
      return true;
    }
    return false;
  }),
});

const schema = yup.object({
  details: yup.array().of(storage).min(1, 'must have at least one data'),
});

function Screen(props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const location = useLocation();
  const { store, activityStore, registrationStore } = useContext(Context);

  const [scanning] = useState(false);
  const [notes, setNotes] = useState('');
  console.log('notes', notes);
  const [error, setErrors] = useState(false);
  const { fields, append } = useFieldArray({
    control,
    name: 'details',
  });
  const [onOpen, setOnOpen] = useState(false);
  const [filterBay, setFilterBay] = useState({
    warehouse_id: store?.getWarehouseId(),
  });
  const [isSplit, setIsSplit] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [jsonArray, setJsonArray] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [filterParams, setFilterParams] = useState({
    warehouse_id: store?.getWarehouseId(),
  });
  const [totalRequest, setTotalRequest] = useState(0);
  const [onOverview, setOnOverview] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [loadingRFID, setLoadingRFID] = useState(false);
  const [isLarge] = useMediaQuery('(min-width: 1150px)');
  const [loadingHover, setLoadingHover] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [requestDetailData, setRequestDetailData] = useState([]);
  const [isLoadingCheckLabel, setIsLoadingCheckLabel] = useState(false);

  const rfidDatas = [...registrationStore.getProductRegistered()];
  console.log('rfidDatas', rfidDatas);
  const checkRfidRegistered = [...registrationStore.getLabelRegistered()];

  const groupedData = rfidDatas.reduce((acc, obj) => {
    const key = obj.product_id;
    acc[key] = acc[key] || { product_name: obj.product_name, sku: obj.sku, product_id: obj.product_id, qty: 0 };
    acc[key].qty += 1;
    return acc;
  }, {});

  const dataRfids = Object.values(groupedData);

  useEffect(() => {
    if (activityStore?.getRequestNumber() && activityStore?.getActivityName()?.toLowerCase() === 'inbound') {
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
          const filterByProductId = [
            ...new Map(res.detail?.map(i => [JSON.stringify(i.product_id), i.product_id])).values(),
          ];
          const quantity = [...new Map(res.detail?.map(i => [JSON.stringify(i.qty), i.qty])).values()];
          setValue('filters', filterByProductId);
          setValue('quantity', quantity);
          setValue('activity_date', res?.activity_date ? Moment(res?.activity_date).toDate() : null);
          setValue('request_number', res?.request_number ? res?.request_number : '-');
          setTotalRequest(toCalculate(res.detail, 'qty'));
          setRequestDetailData(res.detail);
          setLoadingRequest(false);
          setLoadingRFID(false);
          setLoadingHover(false);
        })
        .catch(error => {
          Swal.fire({ text: error?.message, icon: 'error' });
        });
    }
  }, [requestId]);

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

  const handleAmqpScan = () => {
    const scanType = 'RUNNING';
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

  useEffect(() => {
    Promise.allSettled([StorageApi.get({ warehouse_id: store?.getWarehouseId() }).then(res => res)])
      .then(result => {
        setStorageData(result[0].value.data);
        console.log('storageData', storageData);
        setValue('storageData', result[0].value.data);

        setIsSplit(false);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.data?.message, icon: 'error' });
      });
  }, [filterParams, filterBay]);

  const onChangeValue = (rack, item, index) => {
    const onChangeData = { rack, item, idx: index };
    setValue('onChangeRack', onChangeData);

    if (rack) {
      setFilterParams(prev => ({
        ...prev,
        rack_number: rack,
      }));
    }
  };

  const onChangeBay = (bay, item, index) => {
    const onChangeData = { bay, item, idx: index };
    setValue('onChangeBay', onChangeData);
    if (bay) {
      setFilterBay(prev => ({
        ...prev,
        bay,
      }));
    }
  };

  const onChangeLevel = (level, item, index) => {
    const onChangeData = { level, item, idx: index };
    setValue('onChangeLevel', onChangeData);
  };

  const onSubmitRFID = () => {
    const hasUnregisteredRfid = checkRfidRegistered.some(item => item?.product_name === null && item?.id === null);
    let pass = onOpen;
    if (hasUnregisteredRfid) {
      swalButton.fire({
        icon: 'error',
        title: 'Unregistered RFID',
        text: 'You have RFID numbers that are not registered. Please register them first.',
      });
      return false;
    }
    if (jsonArray.length === totalRequest) {
      append(dataRfids);
      setOnOpen(!pass);
      setErrors(false);
      pass = true;
    } else {
      setErrors(true);
      swalButton
        .fire({
          html: '<b> NOTES </b> <br/> <p class="text-[15px]">The amount of data in Request Detail does not match the data in RFID Detected, please type Yes to Continue process?<p>',
          input: 'text',
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonColor: '#50B8C1',
          preConfirm: pre => {
            if (!pre && pre.length === 0) {
              Swal.showValidationMessage(`notes is a required field`);
            } else if (pre.length <= 2) {
              Swal.showValidationMessage(`please type yes`);
            }
            return pre;
          },
        })
        .then(result => {
          if (result.isConfirmed) {
            setNotes(result.value);
            append(dataRfids);
            setOnOpen(!pass);
            setErrors(false);
          }
        });
    }
    return pass;
  };

  const onProcess = id => {
    if (id) {
      setRequestId(id);
      setOnOverview(!onOverview);
      handleAmqpScan();
    }
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

  const validateStorageId = data => {
    let pass = false;
    const datas = data.details.map(i => {
      return storageData.find(f => f.rack_number === i.rack && f.bay === i.bay)?.id;
    });

    if (datas.includes(undefined)) {
      if (datas.findIndex(i => i === undefined) !== -1) {
        pass = false;

        setError('details', {
          type: 'error',
          message: `this storage combination cannot be done in sku ${data.details
            .find(
              i =>
                i.product_id ===
                data.details.find((i, idx) => idx === datas.findIndex(i => i === undefined))?.product_id
            )
            ?.sku.toUpperCase()} `,
        });
      }
    } else {
      pass = true;
    }

    return pass;
  };

  const validateIsDuplicate = data => {
    let pass = false;
    const datas = data.details.map(i => {
      return storageData.find(f => f.rack_number === i.rack && f.bay === i.bay)?.id;
    });
    if (datas) {
      if (new Set(datas).size !== datas.length) {
        pass = false;
        setError('details', {
          type: 'error',
          message: `cannot contain duplicate storage id `,
        });
      } else {
        pass = true;
      }
    }
    return pass;
  };

  const onFinalSubmit = data => {
    if (validateStorageId(data)) {
      if (validateIsDuplicate(data)) {
        const datas = data.details.map(i => {
          return storageData.find(f => f.rack_number === i.rack && f.bay === i.bay && f.level === i.level)?.id;
        });
        const concatenatedNumber = datas.reduce((accumulator, currentValue) => {
          if (currentValue !== undefined) {
            accumulator += currentValue;
          }
          return accumulator;
        }, 0);
        const body = {
          request_id: requestId,
          notes: 'Inbound masuk',
          detail: rfidDatas.map(i => {
            return {
              product_id: i.product_id,
              label_id: i.id,
              warehouse_id: store?.getWarehouseId(),
              storage_id: concatenatedNumber,
            };
          }),
        };

        TransitApi.inbound(body)
          .then(() => {
            Swal.fire({ text: 'Sucessfully Saved', icon: 'success' });
            setOnOpen(!onOpen);
            reset();
            setTotalRequest('');
            setValue('details', []);
            setValue('request_number', '');
            setValue('activity_date', null);
            setStorageData([]);
            setRequestDetailData([]);
            setJsonArray([]);
            if (activityStore.getRequestNumber() && activityStore.getActivityName()) {
              activityStore.setRequestNumber(0);
              activityStore?.setActivityName('');
            }
          })
          .catch(error => {
            Swal.fire({ text: error?.message || error?.data?.message, icon: 'error' });
          });
      }
    }
  };

  const deleteDuplicates = (array, key) => {
    const data = new Set();
    return array.filter(obj => !data.has(obj[key]) && data.add(obj[key]));
  };

  const onReset = () => {
    setLoadingRequest(true);
    setLoadingRFID(true);
    setRequestDetailData([]);
    if (activityStore.getRequestNumber() && activityStore.getActivityName()) {
      activityStore.setRequestNumber(0);
      activityStore?.setActivityName('');
    }
    setTotalRequest(0);
    setRequestId('');
    setJsonArray([]);
    setValue('activity_date', null);
    setValue('request_number', '');
    setTimeout(() => {
      setLoadingRequest(false);
      setLoadingRFID(false);
    }, 500);
  };

  console.log('field', fields);

  return (
    <Fade in={props}>
      <input type="hidden" {...register('filters')} />
      <input type="hidden" {...register('onChangeRack')} />
      <input type="hidden" {...register('onChangeBay')} />
      <input type="hidden" {...register('onChangeLevel')} />
      {loadingHover && (
        <LottiesAnimation
          animationsData={Loading}
          classCustom="z-[999] right-0 left-[20%] top-[9%] absolute bottom-0 overflow-hidden bg-[#f2f2f2] opacity-75 flex flex-col items-center justify-center"
        />
      )}
      <div className="grid grid-rows-7 px-8 py-1 rounded-md w-full">
        <div className="mb-2">
          <fieldset className="w-full px-8 py-2">
            <div className="flex">
              <button
                type="submit"
                onClick={() => setOnOverview(!onOverview)}
                className={`${scanning ? 'bg-[#ffc108]' : 'bg-white'}  h-3/4 rounded-md border border-[#C2C2C2] px-3 ${
                  isLarge ? 'py-2' : 'my-auto pb-2'
                } `}
                disabled={scanning}
              >
                <p className="md:text-sm xl:text-md text-xs text-[#50B8C1] sm:font-semibold xl:font-semibold">
                  Request
                </p>
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

        <div className={`${isLarge ? 'flex gap-6' : ''} h-full w-full row-span-2 px-8 justify-center`}>
          <div className="w-full mb-2">
            <fieldset
              className={`${
                isLarge ? 'min-h-[507px] py-8' : 'h-1/2 py-4'
              } bg-white border border-[#C2C2C2] w-full min-h-[507px]  rounded-md px-2`}
            >
              <legend className="px-2 text-lg text-gray-400">Request Detail</legend>
              <LottiesAnimation
                animationsData={Loading}
                visible={loadingRequest}
                classCustom="h-full z-[999] opacity-100 flex flex-col items-center justify-center"
              />
              {!loadingRequest ? <SimpleTable data={requestDetailData} isLarge={isLarge} /> : null}
            </fieldset>
          </div>
          <div className="w-full mb-6">
            <fieldset
              className={`${
                isLarge ? 'min-h-[507px] py-8' : 'h-1/2 py-4'
              } bg-white border border-[#C2C2C2] w-full min-h-[507px]  rounded-md px-2`}
            >
              <legend className="px-2 text-lg text-gray-400">RFID Detected</legend>
              {loadingRFID ? (
                <LottiesAnimation
                  visible={loadingRFID}
                  animationsData={Loading}
                  classCustom="h-full z-[999] opacity-100 flex flex-col items-center justify-center"
                />
              ) : (
                <TableRegistration
                  data={memoizedData}
                  isLarge={isLarge}
                  isLoadingCheckLabel={isLoadingCheckLabel}
                  rfidTable
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
                  <div className="font-bold">{totalRequest || 0}</div>
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
                    isDisabled={scanning}
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
            <p className="text-[#a2002d] text-xs w-full pl-4">
              {totalRequest !== jsonArray.length
                ? 'The amount of data in Request Detail does not match the data in RFID Detected.'
                : ''}
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
                filterParams={{ status: 'PENDING', warehouse_id: store?.getWarehouseId(), activity_name: 'INBOUND' }}
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
      {onOpen && (
        <div
          className="fixed w-full inset-0 z-50 overflow-hidden flex justify-center items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <form
            className="px-4 py-2 border shadow-lg bg-white w-[60%] mx-auto rounded z-50"
            onSubmit={handleSubmit(onFinalSubmit)}
          >
            <p className="text-md font-bold py-1 px-4">Dashboard Transit</p>
            <div className="overflow-y-auto h-60 px-6 py-2">
              <TableContainer className="px-4 py-1">
                <Table>
                  <Thead className="bg-[#F5F5F5]">
                    <Tr className="text-bold text-[#000]">
                      <Th className="text-semibold text-[#000] w-10">NO</Th>
                      <Th className="text-semibold text-[#000] w-20">SKU</Th>
                      <Th className="text-semibold text-[#000] w-60">PRODUCT</Th>
                      <Th className="text-semibold text-[#000] w-20 ">QTY</Th>
                      <Th className="text-semibold text-[#000] w-20 ">Rack</Th>
                      <Th className="text-semibold text-[#000] w-20 ">Bay</Th>
                      <Th className="text-semibold text-[#000] w-20 ">Level</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {fields.length > 0 ? (
                      fields.map((item, index) => {
                        return (
                          <Tr key={item.id} className={`${index % 2 ? 'bg-gray-100' : ''} w-full`}>
                            <Td className="w-10 text-start">
                              {index + 1}
                              <Controller
                                render={({ field }) => {
                                  return (
                                    <Input variant="unstyled" {...field} disabled className="hidden" value={index} />
                                  );
                                }}
                                name="index"
                                className="hidden"
                                control={control}
                              />
                            </Td>
                            <Td className="w-20">
                              {item.sku}
                              <Controller
                                render={({ field }) => {
                                  return <Input variant="unstyled" {...field} disabled className="hidden" />;
                                }}
                                name={`details.${index}.sku`}
                                className="hidden"
                                control={control}
                              />
                            </Td>

                            <Td className="w-60">
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
                            <Td className="w-20">
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
                            <Td className="w-24 px-2">
                              <Controller
                                render={({ field }) => {
                                  const rackOptions = deleteDuplicates(
                                    storageData?.map(s => ({
                                      label: s.rack_number,
                                      value: s.rack_number,
                                    })),
                                    'label'
                                  );

                                  return (
                                    <Select
                                      name={`details.${index}.rack`}
                                      idx={index}
                                      placeholder="Rack"
                                      booleans={isSplit}
                                      options={rackOptions}
                                      onChangeValue={e => {
                                        field.onChange(e);
                                        onChangeValue(e, item, index);
                                      }}
                                      register={register}
                                      control={control}
                                      errors={errors}
                                      isAllocate
                                    />
                                  );
                                }}
                                name={`details.${index}.rack`}
                                control={control}
                              />
                            </Td>
                            <Td className="w-24 px-2">
                              <Controller
                                render={({ field }) => {
                                  const selectedRack = watch(`details.${index}.rack`);
                                  const bayOptions = deleteDuplicates(
                                    storageData
                                      .filter(s => !selectedRack || s.rack_number === selectedRack)
                                      .map(i => ({
                                        label: i.bay,
                                        value: i.bay,
                                      })),
                                    'label'
                                  );

                                  return (
                                    <Select
                                      name={`details.${index}.bay`}
                                      idx={index}
                                      placeholder="Bay"
                                      booleans={isSplit}
                                      options={bayOptions}
                                      onChangeValue={e => {
                                        field.onChange(e);
                                        onChangeBay(e, item, index);
                                      }}
                                      register={register}
                                      control={control}
                                      errors={errors}
                                      isAllocate
                                    />
                                  );
                                }}
                                name={`details.${index}.bay`}
                                control={control}
                              />
                            </Td>
                            <Td className="w-24 px-2">
                              <Controller
                                render={({ field }) => {
                                  const selectedRack = watch(`details.${index}.rack`);
                                  const selectedBay = watch(`details.${index}.bay`);
                                  const levelOptions = deleteDuplicates(
                                    storageData
                                      .filter(
                                        s =>
                                          (!selectedRack || s.rack_number === selectedRack) &&
                                          (!selectedBay || s.bay === selectedBay)
                                      )
                                      .map(i => ({
                                        label: i.level,
                                        value: i.level,
                                      })),
                                    'label'
                                  );

                                  return (
                                    <Select
                                      name={`details.${index}.level`}
                                      idx={index}
                                      placeholder="Level"
                                      booleans={isSplit}
                                      options={levelOptions}
                                      onChangeValue={e => {
                                        field.onChange(e);
                                        onChangeLevel(e, item, index);
                                      }}
                                      register={register}
                                      control={control}
                                      errors={errors}
                                      isAllocate
                                    />
                                  );
                                }}
                                name={`details.${index}.level`}
                                control={control}
                              />
                            </Td>
                          </Tr>
                        );
                      })
                    ) : (
                      <tr className="bg-gray-100 w-full border-2 border-solid">
                        <td className="w-10 text-center px-2  text-red-500 h-[170px]" colSpan={9} rowSpan={5} />
                      </tr>
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
                  className="rounded-md border border-gray-300 bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-bold"
                  onClick={() => {
                    reset();
                    setOnOpen(!onOpen);
                    setNotes('');
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
                  className="ml-4 rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] hover:text-[#fff] font-bold"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
        // </div>
      )}
    </Fade>
  );
}

export default Screen;
