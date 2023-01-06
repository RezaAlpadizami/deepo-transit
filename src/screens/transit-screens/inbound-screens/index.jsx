import React, { useEffect, useState } from 'react';
import { Input, Button } from '@chakra-ui/react';
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
import TableCh from './table';

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
    // console.log('rack value', value);
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

      const { isSplitted, currentProductId } = this.parent;
      // console.log('this.parent', this.parent);

      if (isSplitted) {
        // const filterBy = filters.map(f => { filters
        //   return value.filter(i => i.product_id === f);
        // });
        if (value.length > 0) {
          // filterBy.length > 0 &&
          // const parentQty = filterBy.map(item => {
          //   const quantities = item.map(x => {
          //     if (x.qty) {
          //       return { qty: x.qty, product_id: x.product_id };
          //     }
          //     return x.qty;
          //   });

          //   return quantities.find(i => i !== undefined);
          // });

          // const childQty = filterBy.map((item, idx) => {
          //   return { calc: toCalculate(item, 'child_qty'), product_id: filters[idx] };
          // });

          const val = toCalculate(
            value.filter(i => i.product_id === currentProductId),
            'child_qty'
          );
          // if (parent?.product_id === currentProductId && child?.product_id === currentProductId) {
          if (value.filter(i => i.qty).find(i => i.product_id === currentProductId)?.qty === val) {
            return pass;
          }
          pass = false;

          // parentQty.map((item, idx) => {
          //   console.log('item', item);
          //   if (item.qty && item.product_id === currentProductId) {
          //     if (childQty[idx]?.product_id === item.product_id) {
          //       if (item.qty === childQty[idx].calc) {
          //         console.log('childQty[idx].calc', item.qty === childQty[idx].calc);
          //         return pass;
          //       }
          //     }
          //   } else {

          //     pass = false;
          //   }

          //   return pass;
          // });
          // } else {
          // }
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
    // getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { currentProductId } = watch();
  const { fields, append, remove, insert, update } = useFieldArray({
    control,
    name: 'details',
  });

  const defaultSort = {
    sort_by: 'id',
    sort_order: 'desc',
  };
  const [requestDetailData, setRequestDetailData] = useState([]);
  const [transitData, setTransitData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [bayLevel, setBayLevel] = useState([]);
  const [newData, setNewData] = useState([]);
  const [data, setData] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingTransit, setLoadingTransit] = useState(false);
  const [loadingRFID, setLoadingRFID] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [onOpen, setOnOpen] = useState(false);
  const [error, setError] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [notes, setNotes] = useState('');
  const [totalRequest, setTotalRequest] = useState(0);
  const [counter, setCounter] = useState(2);
  const [splitValue, setSplitValue] = useState({});

  const [timer, setTimer] = useState();
  const [filterParams, setFilterParams] = useState({
    warehouse_id: 2,
  });

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
    if (isSplit) {
      setValue('isSplitted', isSplit);
      setNewData(
        fields.map((item, index) => {
          if (splitValue.product_id === item.product_id) {
            item.index = index;
            // item.is_latest = fields.filter(i => i.product_id === item.product_id).length === index + 1;
            if (item.child_qty !== splitValue.value) {
              item.child_qty = splitValue.value;
            }
            if (item.resividual_qty) {
              item.child_qty = item.resividual_qty;
              update(index + 1, item);
              setValue(`details.${index + 1}.child_qty`, item.child_qty);
            }
          }
          return item;
        })
      );

      if (splitValue.product_id) {
        setValue('currentProductId', splitValue.product_id);
      }
      setLoadingTransit(false);
    }
  }, [splitValue]);

  useEffect(() => {
    if (newData.length > 0) {
      setValue('details', newData);
    }
  }, [newData]);

  const startScanning = () => {
    setScanning(true);

    setTimer(
      setInterval(() => {
        TransitApi.get()
          .then(res => {
            console.log('TransitApi', res);
          })
          .catch(error => {
            Swal.fire({ text: error?.message, icon: 'error' });
          });
      }, 5000)
    );
    setIsScanned(false);
  };
  const stopScanning = () => {
    setScanning(false);
    setIsScanned(true);
    clearInterval(timer);
  };

  useEffect(() => {
    Promise.allSettled([
      StorageApi.get({ warehouse_id: 2 }).then(res => res),
      StorageApi.get(filterParams).then(res => res),
    ])
      .then(result => {
        console.log('resultult', result);
        setStorageData(result[0].value.data);
        setBayLevel(result[1].value.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.data?.message, icon: 'error' });
      });
  }, [filterParams]);

  const getDetailRequest = () => {
    setLoadingRFID(true);
    RequestApi.get({ ...defaultSort })
      .then(res => {
        setData(res.data);
        setLoadingRFID(false);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.data?.error, icon: 'error' });
      });
  };

  const onChangeValue = rack => {
    console.log('eeee', rack);

    if (rack) {
      setFilterParams(prev => ({
        ...prev,
        rack_number: rack,
      }));
    } else {
      setBayLevel([]);
    }
  };
  const onChangeBay = bay => {
    if (bay) {
      setFilterParams(prev => ({
        ...prev,
        bay,
      }));
    }
  };

  const onSplit = (id, qty, index) => {
    setIsSplit(true);
    setLoadingTransit(true);

    const findData = fields.filter(i => i.qty)?.find(i => i.product_id === id);
    const fieldLength = fields.filter(i => i.product_id === id).length;
    const fieldLengthLess = fields.filter(i => i.product_id < id).length;
    const fieldLengthMore = fields.filter(i => i.product_id > id).length;

    const value = {
      product_id: findData.product_id,
      child_qty: Math.floor(qty / counter),
    };

    const splitVal = { product_id: id, value: Math.floor(qty / counter) };
    if (Math.floor(qty / counter) > 1) {
      if (index === 0) {
        if (qty % counter === 0) {
          if (fieldLength === 1) {
            insert(fieldLength, value);

            setSplitValue(splitVal);
          } else if (fields.findIndex(i => i.resividual_qty && i.product_id === id) !== -1 && id === currentProductId) {
            remove(fields.findIndex(i => i.resividual_qty));
            insert(
              fields.findIndex(i => i.resividual_qty),
              value
            );

            setSplitValue(splitVal);
          } else if (
            fields.findIndex(i => i.resividual_qty && i.product_id === currentProductId) !== -1 &&
            id !== currentProductId
          ) {
            if (counter !== fields.filter(i => i.product_id === currentProductId && !i.resividual_qty).length) {
              setCounter(
                fields.filter(i => i.product_id === currentProductId && !i.resividual_qty).length > 0
                  ? fields.filter(i => i.product_id === currentProductId && !i.resividual_qty).length
                  : 2
              );
            } else if (fields.findIndex(i => i.product_id === currentProductId && i.resividual_qty === -1)) {
              remove(fields.findIndex(i => i.resividual_qty));
              insert(
                fields.findIndex(i => i.resividual_qty),
                value
              );
              setSplitValue(splitVal);
            }
          } else {
            insert(fieldLength, value);

            setSplitValue(splitVal);
          }
        } else if (qty % counter !== 0) {
          if (id === currentProductId) {
            if (fields.findIndex(i => i.resividual_qty && i.product_id === id) !== -1) {
              remove(fields.findIndex(i => i.resividual_qty));
              insert(
                fields.findIndex(i => i.resividual_qty),
                {
                  product_id: findData.product_id,
                  child_qty: qty - Math.floor(qty / counter) * counter,
                }
              );
              insert(fields.findIndex(i => i.resividual_qty) + 1, {
                product_id: findData.product_id,
                child_qty: qty - Math.floor(qty / counter) * counter,
                resividual_qty: qty - Math.floor(qty / counter) * counter,
              });
            } else {
              insert(fieldLength, {
                product_id: findData.product_id,
                child_qty: qty - Math.floor(qty / counter) * counter,
              });
              insert(fieldLength + 1, {
                product_id: findData.product_id,
                child_qty: qty - Math.floor(qty / counter) * counter,
                resividual_qty: qty - Math.floor(qty / counter) * counter,
              });
            }

            setSplitValue(splitVal);
          } else {
            setCounter(fieldLength > 1 ? fieldLength : 2);
          }
        }
      } else if (index !== 0) {
        if (fieldLengthLess > 0 && fieldLength > 0) {
          if (id === currentProductId) {
            if (qty % counter !== 0) {
              if (fields.findIndex(i => i.resividual_qty && i.product_id === id) !== -1) {
                remove(fields.findIndex(i => i.resividual_qty && i.product_id === id));
                insert(
                  fields.findIndex(i => i.resividual_qty && i.product_id === id),
                  value
                );
                insert(fields.findIndex(i => i.resividual_qty && i.product_id === id) + 1, {
                  product_id: findData.product_id,
                  child_qty: qty - Math.floor(qty / counter) * counter,
                  resividual_qty: qty - Math.floor(qty / counter) * counter,
                });
                setSplitValue(splitVal);
              } else {
                insert(fields.findIndex(i => i.product_id === id) + fieldLength, {
                  product_id: findData.product_id,
                  child_qty: qty - Math.floor(qty / counter) * counter,
                });

                insert(fields.findIndex(i => i.product_id === id) + fieldLength + 1, {
                  product_id: findData.product_id,
                  child_qty: qty - Math.floor(qty / counter) * counter,
                  resividual_qty: qty - Math.floor(qty / counter) * counter,
                });
              }

              setSplitValue(splitVal);
            } else if (fields.findIndex(i => i.resividual_qty && i.product_id === id) !== -1) {
              remove(fields.findIndex(i => i.resividual_qty && i.product_id === id));
              insert(
                fields.findIndex(i => i.resividual_qty),
                value
              );
              setSplitValue(splitVal);
            } else {
              update(
                fields.findIndex(i => i.product_id === id),
                { ...findData, child_qty: Math.floor(qty / counter) }
              );
              insert(fields.findIndex(i => i.product_id === id) + fieldLength, value);

              setSplitValue(splitVal);
            }
          } else if (id !== currentProductId) {
            if (fieldLength > 1 && fields.findIndex(i => i.product_id === id && i.resividual_qty) === -1) {
              setCounter(fields.findIndex(i => i.product_id === id && i.resividual_qty));
            } else if (fieldLength > 1 && fields.findIndex(i => i.product_id === id && i.resividual_qty) !== -1) {
              setCounter(fieldLength);
              setValue('currentProductId', id);
            } else {
              setCounter(2);
            }
          }
          // else if (id === currentProductId) {
          //   if (fieldLength > 1 && fields.findIndex(i => i.product_id === id && i.resividual_qty)) {
          //     remove(fields.findIndex(i => i.product_id === id && i.resividual_qty));
          //     insert(
          //       fields.findIndex(i => i.product_id === id && i.resividual_qty),
          //       value
          //     );
          //     insert(fields.findIndex(i => i.product_id === id && i.resividual_qty) + 1, value);
          //     setSplitValue(splitVal);
          //   }
          // }
        } else if (fieldLengthMore > 0 && fieldLength > 0) {
          if (id === currentProductId) {
            if (qty % counter !== 0) {
              if (fields.findIndex(i => i.resividual_qty && i.product_id === id) !== -1) {
                remove(fields.findIndex(i => i.resividual_qty && i.product_id === id));
                insert(
                  fields.findIndex(i => i.resividual_qty && i.product_id === id),
                  value
                );
                insert(fields.findIndex(i => i.resividual_qty && i.product_id === id) + 1, {
                  product_id: findData.product_id,
                  child_qty: qty - Math.floor(qty / counter) * counter,
                  resividual_qty: qty - Math.floor(qty / counter) * counter,
                });
              } else {
                insert(fields.findIndex(i => i.product_id === id) + fieldLength, {
                  product_id: findData.product_id,
                  child_qty: qty - Math.floor(qty / counter) * counter,
                });

                insert(fields.findIndex(i => i.product_id === id) + fieldLength + 1, {
                  product_id: findData.product_id,
                  child_qty: qty - Math.floor(qty / counter) * counter,
                  resividual_qty: qty - Math.floor(qty / counter) * counter,
                });
              }

              setSplitValue(splitVal);
            } else if (fields.findIndex(i => i.resividual_qty && i.product_id === id) !== -1) {
              if (qty % counter !== 0) {
                remove(fields.findIndex(i => i.resividual_qty && i.product_id === id));
                insert(
                  fields.findIndex(i => i.resividual_qty && i.product_id === id),
                  value
                );
                insert(fields.findIndex(i => i.resividual_qty && i.product_id === id) + 1, {
                  product_id: findData.product_id,
                  child_qty: qty - Math.floor(qty / counter) * counter,
                  resividual_qty: qty - Math.floor(qty / counter) * counter,
                });
              } else {
                remove(fields.findIndex(i => i.resividual_qty && i.product_id === id));
                insert(
                  fields.findIndex(i => i.resividual_qty && i.product_id === id),
                  value
                );
              }

              setSplitValue(splitVal);
            } else {
              update(
                fields.findIndex(i => i.product_id === id),
                { ...findData, child_qty: Math.floor(qty / counter) }
              );
              insert(fields.findIndex(i => i.product_id === id) + fieldLength, value);

              setSplitValue(splitVal);
            }
          } else if (id !== currentProductId) {
            if (fieldLength > 1 && fields.findIndex(i => i.product_id === id && i.resividual_qty) === -1) {
              setCounter(fields.findIndex(i => i.product_id === id && i.resividual_qty));
            } else if (fieldLength > 1 && fields.findIndex(i => i.product_id === id && i.resividual_qty) !== -1) {
              setCounter(fieldLength);
              setValue('currentProductId', id);
            } else {
              setCounter(2);
            }
          }
        }
      }
    }
  };
  // console.log('COUTER OUTSIDE', counter);
  const onRemove = (idx, id) => {
    const fieldLength = fields.filter(i => i.product_id === id).length;
    const dataIndex = newData[newData.findIndex((item, i) => i === idx)];
    const findData = fields.filter(i => i.qty)?.find(i => i.product_id === dataIndex.product_id);
    // const findDataId = fields.filter(i => i.qty)?.find(i => i.product_id === id);
    const dt = fields.filter((item, i) => item.product_id === id && i !== idx && i !== idx - 1);

    const value = {
      product_id: findData.product_id,
      value: Math.floor(findData.qty / fields.filter(i => i.product_id === id && !i.qty).length),
    };
    const values = {
      product_id: findData.product_id,
      value: Math.floor(findData.qty / dt.length),
    };

    if (counter <= 3 && fieldLength === 2) {
      // console.log('test 1');
      delete findData.child_qty;
      setSplitValue(findData);
      remove(idx);
      setCounter(2);
    } else if (findData.qty % findData.child_qty === 0) {
      // console.log('test 2');
      if (findData.qty % value.value !== 0) {
        // console.log('test 3');
        remove(idx);
        remove(idx - 1);
        setSplitValue(values);
      } else {
        if (dt.length === 0) {
          // console.log('test 4');
          delete findData.child_qty;
          setSplitValue(findData);
        } else {
          // console.log('test 5');
          setSplitValue(value);
        }
        remove(idx);
      }
    } else if (findData.qty % findData.child_qty !== 0) {
      // console.log('test 6');
      const resividualValue = {
        product_id: findData.product_id,
        value: Math.floor(findData.qty / dt.length),
        resividual_qty: Math.floor(findData.qty / dt.length),
      };
      if (findData.qty % value.value !== 0) {
        // console.log('test 7');
        if (value.value !== resividualValue.value) {
          // console.log('test 8');
          if (fields.findIndex(i => i.resividual_qty) !== -1) {
            // console.log('test 9');
            if (newData.findIndex((item, i) => i === idx) === idx) {
              // console.log('test 10');
              remove(newData.findIndex((item, i) => i === idx));
              remove(fields.findIndex(i => i.resividual_qty) - 1);
            } else {
              // console.log('test 11');
              remove(fields.findIndex(i => i.resividual_qty));
              remove(idx - 1);
            }
            setSplitValue(values);
          } else {
            // console.log('test 12');
            remove(idx);
            setSplitValue(values);
          }
        }
      } else {
        // console.log('test 13');
        remove(idx);
        setSplitValue(values);
      }
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
          title: 'NOTES',
          html: '<b> Jumlah data pada Request Detail tidak sesuai dengan data pada RFID Detected. Lanjutkan proses ? <b>',
          text: 'Notes',
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
            setNotes(result.value);
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
    const body = {
      request_id: requestId,
      notes,
      details: [...data.details],
    };
    console.log('body', body);
    TransitApi.inbound(body)
      .then(res => {
        console.log('res', res);
        Swal.fire({ text: 'Sucessfully Saved', icon: 'success' });
        // setOnOpen(!onOpen);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.data?.message, icon: 'error' });
      });
  };

  const deleteDuplicates = (array, key) => {
    const data = new Set();
    return array.filter(obj => !data.has(obj[key]) && data.add(obj[key]));
  };

  return (
    <div className="bg-white p-5 rounded-[55px] shadow">
      <input type="hidden" {...register('filters')} />
      <input type="hidden" {...register('quantity')} />
      <input type="hidden" {...register('isSplitted')} />
      <input type="hidden" {...register('currentProductId')} />
      <input type="hidden" {...register('bay_level')} />
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
          {!loadingRequest ? <TableCh data={requestDetailData} /> : null}
        </fieldset>
        <fieldset className="border border-primarydeepo w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-primarydeepo font-semibold">RFID Detected</legend>
          <LoadingComponent visible={loadingRequest} />
          {!loadingRFID ? <TableCh data={data} /> : null}
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
                      <th className="text-semibold text-[#000] text-center w-60">PRODUCT</th>
                      <th className="text-semibold text-[#000] text-center w-20 ">QTY</th>
                      <th aria-label="Mute volume" className="w-24" />
                      <th aria-label="Mute volume" className="w-24" />
                      <th aria-label="Mute volume" className="w-24" />
                      <th aria-label="Mute volume" className="w-20" />
                      <th aria-label="Mute volume" className="w-24" />
                    </tr>
                  </thead>
                  <LoadingComponent loading={loadingTransit} />

                  <tbody>
                    {fields.length > 0 ? (
                      fields.map((item, index) => {
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
                                render={({ field }) => {
                                  return (
                                    <Select
                                      name={`details.${index}.rack`}
                                      idx={index}
                                      placeholder="Rack"
                                      booleans={isSplit}
                                      options={deleteDuplicates(
                                        storageData?.map(s => {
                                          return {
                                            label: s.rack_number,
                                            value: s.rack_number,
                                          };
                                        }),
                                        'label'
                                      )}
                                      onChangeValue={e => {
                                        field.onChange(e);
                                        onChangeValue(e);
                                      }}
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
                                      options={
                                        bayLevel.length === 0
                                          ? storageData?.map(s => {
                                              return {
                                                label: s.bay,
                                                value: s.bay,
                                              };
                                            })
                                          : bayLevel.map(i => {
                                              return {
                                                label: i.bay,
                                                value: i.bay,
                                              };
                                            })
                                      }
                                      onChangeValue={e => onChangeBay(e)}
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
                                      options={
                                        bayLevel.length === 0
                                          ? storageData?.map(s => {
                                              return {
                                                label: s.level,
                                                value: s.level,
                                              };
                                            })
                                          : bayLevel.map(i => {
                                              return {
                                                label: i.level,
                                                value: i.level,
                                              };
                                            })
                                      }
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
                                    if (index === 0) {
                                      setCounter(count => count + 1);
                                    } else if (index !== 0) {
                                      if (
                                        item.product_id !== currentProductId &&
                                        fields.filter(i => i.product_id === item.product_id).length === 1
                                      ) {
                                        setCounter(2);
                                        setValue('currentProductId', item.product_id);
                                      } else if (item.product_id === currentProductId) {
                                        setCounter(count => count + 1);
                                      }
                                    }

                                    onSplit(item.product_id, item.qty, index, item?.child_qty, item);
                                  }}
                                >
                                  Split
                                </Button>
                              ) : (
                                // item.is_latest ?
                                <Button
                                  px={6}
                                  size="sm"
                                  type="button"
                                  className="rounded-full bg-[#eb6058] hover:bg-[#f35a52] text-[#fff] hover:text-gray-600 font-bold"
                                  key={index}
                                  onClick={() => {
                                    const data = newData[newData.findIndex((item, i) => i === index)];
                                    const findData = fields
                                      .filter(i => i.qty)
                                      ?.find(i => i.product_id === data.product_id);

                                    if (findData.qty % counter !== 0) {
                                      setCounter(count => count - 2);
                                    } else {
                                      setCounter(count => {
                                        if (count > 2) return count - 1;
                                        return 2;
                                      });
                                    }

                                    onRemove(index, item.product_id, item, item?.child_qty);
                                  }}
                                >
                                  Delete
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="bg-gray-100 w-full border-2 border-solid border-[#f3f4f6] border-red-500">
                        <td className="w-10 text-center px-2  text-red-500 h-[170px]" colSpan={9} rowSpan={5} />
                      </tr>
                    )}
                  </tbody>
                </table>
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
                    onClick={() => {
                      setCounter(2);
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
