import React, { useContext, useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Input, Button, Fade } from '@chakra-ui/react';
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
import Context from '../../../context';
import LoadingHover from '../../../components/loading-hover-component';

const swalButton = Swal.mixin({
  customClass: {
    confirmButton: 'rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold w-20',
    cancelButton:
      'ml-4 rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold w-20',
  },
  buttonsStyling: false,
});

function Screen() {
  const storage = yup.object({
    rack: yup.string().test('rack', 'rack is required', value => {
      if (value) {
        return true;
      }
      return false;
    }),

    level: yup
      .string()
      .test('level', 'level is required', value => {
        if (value) {
          return true;
        }
        return false;
      })
      .test('level', 'cannot select the same level with the same bay in one rack', (value, context) => {
        const parentsData = context.from[1].value;

        const { details, onChangeRack, onChangeBay, onChangeLevel } = parentsData;
        const comparison = details.filter(i => i.rack !== '' && i.bay !== '' && i.level !== '');

        const failed = [];
        const success = [];
        comparison.map((i, idx) => {
          if (i.product_id !== onChangeRack.item.product_id) {
            if (i.rack === onChangeRack.rack) {
              if (i.bay === onChangeBay.bay) {
                if (i.rack === onChangeLevel.level) {
                  failed.push({ state: false, index: idx });
                } else {
                  success.push({ state: true, index: idx });
                }
              }
            }
          }
          return i;
        });

        if (failed.every(i => i.state === true)) {
          return true;
        }
        if (success.every(i => i.state === false)) {
          return false;
        }
        return false;
      }),

    bay: yup
      .string()
      .test('bay', 'bay is required', value => {
        if (value) {
          return true;
        }
        return false;
      })
      .test('bay', 'cannot select the same bay at the same level in one rack', (value, context) => {
        const parentsData = context.from[1].value;

        const { details, onChangeBay, onChangeRack, onChangeLevel } = parentsData;
        const comparison = details.filter(i => i.rack !== '' && i.bay !== '' && i.level !== '');

        const failed = [];
        const success = [];
        comparison.map((i, idx) => {
          if (i.product_id !== onChangeRack.item.product_id) {
            if (i.rack === onChangeRack.rack) {
              if (i.bay === onChangeBay.bay) {
                if (i.rack === onChangeLevel.level) {
                  failed.push({ state: false, index: idx });
                } else {
                  success.push({ state: true, index: idx });
                }
              }
            }
          }
          return i;
        });

        if (failed.every(i => i.state === true)) {
          return true;
        }
        if (success.every(i => i.state === false)) {
          return false;
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
      .test('details', 'total of splitted quantity must be the same with the actual quantity', (value, context) => {
        let pass = true;

        const { isSplitted, currentProductId } = context.parent;

        if (isSplitted) {
          if (value.length > 0) {
            const val = toCalculate(
              value.filter(i => i.product_id === currentProductId),
              'child_qty'
            );

            if (value.filter(i => i.qty).find(i => i.product_id === currentProductId)?.qty === val) {
              return pass;
            }
            pass = false;
          }
        } else {
          pass = true;
        }

        return pass;
      }),
  });

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

  const { store } = useContext(Context);

  const { currentProductId } = watch();
  const { fields, append, remove, insert, update } = useFieldArray({
    control,
    name: 'details',
  });

  const [requestDetailData, setRequestDetailData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [rfidData, setRfidData] = useState([]);
  const [newData, setNewData] = useState([]);

  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingTransit, setLoadingTransit] = useState(false);
  const [loadingHover, setLoadingHover] = useState(false);
  const [loadingRFID, setLoadingRFID] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [onOpen, setOnOpen] = useState(false);
  const [error, setErrors] = useState(false);

  const [requestId, setRequestId] = useState('');
  const [notes, setNotes] = useState('');
  const [totalRequest, setTotalRequest] = useState(0);
  const [totalRFID, setTotalRFID] = useState(0);
  const [counter, setCounter] = useState(2);
  const [timer, setTimer] = useState();
  const [splitValue, setSplitValue] = useState({});
  const [filterParams, setFilterParams] = useState({
    warehouse_id: store?.getWarehouseId(),
  });
  const [filterBay, setFilterBay] = useState({
    warehouse_id: store?.getWarehouseId(),
  });
  useEffect(() => {
    if (store?.getRequestNumber()) {
      setRequestId(store?.getRequestNumber());
    }
  }, [store]);

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
          // setTransitData(res.detail);
          setValue('activity_date_from', res?.activity_date ? Moment(res?.activity_date).toDate() : null);
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

  useEffect(() => {
    if (isSplit) {
      setValue('isSplitted', isSplit);
      setNewData(
        fields.map((item, index) => {
          if (splitValue.product_id === item.product_id) {
            item.index = index;

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
    if (newData.filter(i => i.child_qty).length === 0) {
      setIsSplit(false);
      setValue('isSplitted', false);
    }
  }, [newData]);

  const getTransit = () => {
    setTimer(
      setInterval(() => {
        TransitApi.get({ warehouse_id: store?.getWarehouseId() })
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
      setTotalRFID();
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

  useEffect(() => {
    Promise.allSettled([
      StorageApi.get({ warehouse_id: store?.getWarehouseId() }).then(res => res),
      // StorageApi.get(filterParams).then(res => res),
      // StorageApi.get(filterBay).then(res => res),
    ])
      .then(result => {
        setStorageData(result[0].value.data);
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

  const onRemove = (idx, id) => {
    const fieldLength = fields.filter(i => i.product_id === id).length;
    const dataIndex = newData[newData.findIndex((item, i) => i === idx)];
    const findData = fields.filter(i => i.qty)?.find(i => i.product_id === dataIndex.product_id);

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
      delete findData.child_qty;
      setSplitValue(findData);
      remove(idx);
      setCounter(2);
    } else if (findData.qty % findData.child_qty === 0) {
      if (findData.qty % value.value !== 0) {
        remove(idx);
        remove(idx - 1);
        setSplitValue(values);
      } else {
        if (dt.length === 0) {
          delete findData.child_qty;
          setSplitValue(findData);
        } else {
          setSplitValue(value);
        }
        remove(idx);
      }
    } else if (findData.qty % findData.child_qty !== 0) {
      const resividualValue = {
        product_id: findData.product_id,
        value: Math.floor(findData.qty / dt.length),
        resividual_qty: Math.floor(findData.qty / dt.length),
      };
      if (findData.qty % value.value !== 0) {
        if (value.value !== resividualValue.value) {
          if (fields.findIndex(i => i.resividual_qty) !== -1) {
            if (newData.findIndex((item, i) => i === idx) === idx) {
              remove(newData.findIndex((item, i) => i === idx));
              remove(fields.findIndex(i => i.resividual_qty) - 1);
            } else {
              remove(fields.findIndex(i => i.resividual_qty));
              remove(idx - 1);
            }
            setSplitValue(values);
          } else {
            remove(idx);
            setSplitValue(values);
          }
        }
      } else {
        remove(idx);
        setSplitValue(values);
      }
    }
  };

  const onSubmitRFID = () => {
    let pass = onOpen;
    if (totalRFID === totalRequest) {
      append(rfidData);
      setOnOpen(!pass);
      setErrors(false);
      pass = true;
    } else {
      setErrors(true);
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
            setNotes(result.value);
            append(rfidData);
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
    }
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
          message: `this storage combination cannot be done in ${data.details
            .find(
              i =>
                i.product_id ===
                data.details.find((i, idx) => idx === datas.findIndex(i => i === undefined))?.product_id
            )
            ?.product_sku.toUpperCase()} `,
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
        const body = {
          request_id: requestId,
          notes,
          detail: data.details.map(i => {
            return {
              product_id: i.product_id,
              warehouse_id: store?.getWarehouseId(),
              storage_id: storageData.find(f => f.rack_number === i.rack && f.bay === i.bay && f.level === i.level)?.id,
              qty: i.child_qty ? i.child_qty : i.qty,
            };
          }),
        };

        TransitApi.inbound(body)
          .then(() => {
            Swal.fire({ text: 'Sucessfully Saved', icon: 'success' });
            setOnOpen(!onOpen);
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
    setIsScanned(false);
    setRequestDetailData([]);
    setRfidData([]);
    setTotalRequest(0);
    setTotalRFID(0);
    setRequestId('');
    setValue('activity_date_from', null);
    setValue('request_number', '');
    setTimeout(() => {
      setLoadingRequest(false);
      setLoadingRFID(false);
    }, 500);
  };
  return (
    <div className="bg-white p-5 rounded-[55px] shadow px-6 pb-11">
      <input type="hidden" {...register('filters')} />
      <input type="hidden" {...register('isSplitted')} value={isSplit} />
      <input type="hidden" {...register('currentProductId')} />
      <input type="hidden" {...register('onChangeRack')} />
      <input type="hidden" {...register('onChangeBay')} />
      <input type="hidden" {...register('onChangeLevel')} />
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
              className={`${scanning ? 'bg-[#ffc108]' : 'bg-processbtnfrom'} h-10 w-15 stroke-[#fff] mx-auto`}
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
            <div className="font-bold">{totalRequest}</div>
            <div className="font-bold">{totalRFID}</div>
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
              Next
            </Button>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-[#a2002d] pl-10">
          {totalRequest !== totalRFID
            ? 'The amount of data in Request Detail does not match the data in RFID Detected.'
            : ''}
        </p>
      )}
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
        </Fade>
      )}
      {onOpen && (
        <div
          className=" main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded z-50 bg-cyan-500 h-20">
            <form onSubmit={handleSubmit(onFinalSubmit)}>
              <p className="text-md font-bold py-2 px-4">Dashboard Transit</p>

              <TableContainer className="overflow-y-auto h-40 px-6 py-2">
                <Table>
                  <Thead>
                    <Tr className="bg-[#bbc9ff] text-bold text-[#000]">
                      <Th className="text-semibold text-[#000] text-center w-10 py-1.5 pl-2">NO</Th>
                      <Th className="text-semibold text-[#000] text-center w-20">SKU</Th>
                      <Th className="text-semibold text-[#000] text-center w-60">PRODUCT</Th>
                      <Th className="text-semibold text-[#000] text-center w-20 ">QTY</Th>
                      <Th aria-label="Mute volume" className="w-24" />
                      <Th aria-label="Mute volume" className="w-24" />
                      <Th aria-label="Mute volume" className="w-24" />
                      <Th aria-label="Mute volume" className="w-20" />
                      <Th aria-label="Mute volume" className="w-24" />
                    </Tr>
                  </Thead>
                  <LoadingComponent loading={loadingTransit} />

                  <Tbody>
                    {fields.length > 0 ? (
                      fields.map((item, index) => {
                        return (
                          <Tr key={item.id} className={`${index % 2 ? 'bg-gray-100' : ''} w-full`}>
                            <Td className="w-10 text-center px-2">
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
                            <Td className="w-24 px-2">
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
                                        onChangeValue(e, item, index);
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
                            </Td>
                            <Td className="w-24 px-2">
                              <Controller
                                {...register(`details.${index}.bay`)}
                                render={({ field }) => {
                                  return (
                                    <Select
                                      name={`details.${index}.bay`}
                                      idx={index}
                                      placeholder="Bay"
                                      booleans={isSplit}
                                      options={deleteDuplicates(
                                        storageData.map(i => {
                                          return {
                                            label: i.bay,
                                            value: i.bay,
                                          };
                                        }),
                                        'label'
                                      )}
                                      onChangeValue={e => {
                                        field.onChange(e);
                                        onChangeBay(e, item, index);
                                      }}
                                      register={register}
                                      control={control}
                                      errors={errors}
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
                                  return (
                                    <Select
                                      name={`details.${index}.level`}
                                      idx={index}
                                      placeholder="Level"
                                      booleans={isSplit}
                                      options={deleteDuplicates(
                                        storageData.map(i => {
                                          return {
                                            label: i.level,
                                            value: i.level,
                                          };
                                        }),
                                        'label'
                                      )}
                                      onChangeValue={e => {
                                        field.onChange(e);
                                        onChangeLevel(e, item, index);
                                      }}
                                      register={register}
                                      control={control}
                                      errors={errors}
                                    />
                                  );
                                }}
                                name={`details.${index}.level`}
                                control={control}
                              />
                            </Td>
                            <Td className="w-20 px-4">
                              <Controller
                                render={({ field }) => {
                                  return <Input type="number" {...field} className="w-16" />;
                                }}
                                name={`details.${index}.child_qty`}
                                control={control}
                              />
                            </Td>
                            <Td className="w-20 px-4">
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
                            </Td>
                          </Tr>
                        );
                      })
                    ) : (
                      <tr className="bg-gray-100 w-full border-2 border-solid border-[#f3f4f6] border-red-500">
                        <td className="w-10 text-center px-2  text-red-500 h-[170px]" colSpan={9} rowSpan={5} />
                      </tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>

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
