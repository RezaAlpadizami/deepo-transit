import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Input, Button } from '@chakra-ui/react';
import * as yup from 'yup';
import Moment from 'moment';
import InputComponent from '../../../components/input-component';
import NoContent from './component/no-content';

// const state = [];
const product = yup.object({
  actual_qty: yup.string(),
});

const schema = yup.object({
  allocate: yup
    .array()
    .of(product)
    .min(1, 'must have at least one data')
    .test('allocate', 'should fill at least one rack', value => {
      return value.some(i => i.actual_qty);
    })
    .test('allocate', 'cannot process the value less than zero ', value => {
      if (value) {
        if (value.some(i => i.actual_qty < 0)) {
          return false;
        }
      }

      return true;
    })
    .test('allocate', 'actual quantity cannot be more than original quantity', value => {
      if (
        value
          .map(f => {
            if (f.actual_qty) {
              return Number(f.actual_qty) > f.qty;
            }
            return f;
          })
          .some(i => i === true)
      ) {
        return false;
      }

      return true;
    }),
});

function Allocate(props) {
  const { onAllocate, setOnAllocate, data, setAllocateData, productId, allocated } = props;
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: 'allocate',
  });
  const filter = allocated.filter(i => i.product_id === productId && i.actual_qty !== undefined);
  useEffect(() => {
    if (filter.length === 0) {
      setValue('allocate', data?.product_info);
    } else {
      setValue(
        'allocate',
        allocated.filter(i => i.product_id === productId)
      );
    }
  }, [data]);

  const onSubmit = dt => {
    const body = {
      allocate: dt.allocate.map(item => {
        return {
          product_info_id: item.id,
          storage_id: item.storage_id,
          product_id: item.product_id,
          actual_qty: item.actual_qty,
          qty: item.qty,
          rack: item.rack,
          bay: item.bay,
          level: item.level,
        };
      }),
    };

    if (body.allocate.filter(i => i.actual_qty !== undefined).length !== 0) {
      // state.push({
      //   isAllocate: true,
      //   product_id: productId,
      //   actual_qty: toCalculate(body, 'actual_qty'),
      //   source: filter.length,
      // });
      // setIsAllocate(Array.from(new Set(state.map(JSON.stringify))).map(JSON.parse));
      // activityStore.setIsAllocate(Array.from(new Set(state.map(JSON.stringify))).map(JSON.parse));
      setOnAllocate(!onAllocate);
      setAllocateData(
        body.allocate.map(i => {
          if (i.actual_qty === undefined) {
            i.isAllocate = false;
          } else {
            i.isAllocate = true;
          }
          return i;
        })
      );
    } else {
      setError('allocate', { type: 'server', message: 'at least submit one data' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-md font-bold py-2 px-4">Dashboard Transit</p>
      <div className="max-h-80 overflow-y-auto overflow-x-hidden p-5">
        <TableContainer>
          <Table>
            <Thead>
              <Tr className="bg-[#bbc9ff] text-bold text-[#000] w-full">
                <Th className="text-semibold text-[#000] text-center w-10 py-1.5 pl-2">NO</Th>
                <Th className="text-bold text-[#000] text-center">Inbound Date</Th>
                <Th className="text-bold text-[#000] text-center">Rack</Th>
                <Th className="text-bold text-[#000] text-center">Bay</Th>
                <Th className="text-bold text-[#000] text-center">Level</Th>
                <Th className="text-bold text-[#000] text-center">Qty</Th>
                <Th aria-label="Mute volume" className="w-20" />
              </Tr>
            </Thead>

            <Tbody>
              {fields.length > 0 ? (
                fields.map((item, index) => {
                  return (
                    <Tr key={item.id} className={`${index % 2 ? 'bg-gray-100' : ''} w-full`}>
                      <Td className="w-10 text-center px-2">
                        {index + 1}
                        <Controller
                          render={({ field }) => {
                            return <Input variant="unstyled" {...field} disabled className="hidden" value={index} />;
                          }}
                          name="index"
                          className="hidden"
                          control={control}
                        />
                      </Td>
                      <Td className="text-center px-2">
                        {Moment(item.date).format('DD MMM YYYY')}
                        <Controller
                          render={({ field }) => {
                            return <Input variant="unstyled" {...field} disabled className="hidden" />;
                          }}
                          name={`allocate.${index}.date`}
                          className="hidden"
                          control={control}
                        />
                      </Td>

                      <Td className="text-center px-2">
                        {item.rack}
                        <Controller
                          render={({ field }) => {
                            return <Input variant="unstyled" {...field} disabled className="hidden" />;
                          }}
                          name={`allocate.${index}.rack`}
                          className="hidden"
                          control={control}
                        />
                      </Td>
                      <Td className="text-center px-2">
                        {item.bay}
                        <Controller
                          render={({ field }) => {
                            return <Input variant="unstyled" {...field} disabled className="hidden" />;
                          }}
                          name={`allocate.${index}.bay`}
                          className="hidden"
                          control={control}
                        />
                      </Td>
                      <Td className="text-center px-2">
                        {item.level}
                        <Controller
                          render={({ field }) => {
                            return <Input variant="unstyled" {...field} disabled className="hidden" />;
                          }}
                          name={`allocate.${index}.level`}
                          className="hidden"
                          control={control}
                        />
                      </Td>
                      <Td className="text-center px-2">
                        {item.qty}
                        <Controller
                          render={({ field }) => {
                            return <Input variant="unstyled" {...field} disabled className="hidden" />;
                          }}
                          name={`allocate.${index}.qty`}
                          className="hidden"
                          control={control}
                        />
                      </Td>
                      <Td className="w-24 px-2">
                        <Controller
                          render={({ field }) => {
                            return (
                              <InputComponent
                                name={`allocate.${index}.actual_qty`}
                                idx={index}
                                placeholder="Qty"
                                type="number"
                                {...field}
                                className="w-16"
                                register={register}
                                errors={errors}
                                control={control}
                              />
                            );
                          }}
                          name={`allocate.${index}.actual_qty`}
                          control={control}
                        />
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

      <div className="  flex justify-between">
        {errors && (
          <span className="pl-10 text-[#a2002d]">{`${errors?.allocate ? errors?.allocate.message : ''}`}</span>
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
              setOnAllocate(!onAllocate);
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
  );
}

export default Allocate;
