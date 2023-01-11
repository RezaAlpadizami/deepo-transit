import React, { useEffect, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Input, Button } from '@chakra-ui/react';
import * as yup from 'yup';
import Moment from 'moment';
import InputComponent from '../../../components/input-component';
import Context from '../../../context';

const product = yup.object({
  actual_qty: yup.string(),
});
// actual quantity must be less or equal than qty it self
const schema = yup.object({
  allocate: yup.array().of(product).min(1, 'must have at least one data'),
});
function Allocate(props) {
  const { onAllocate, setOnAllocate, data, setAllocateData, productId, allocateData } = props;
  const { boundActivity } = useContext(Context);
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
  const filter = allocateData.filter(i => i.product_id === productId && i.actual_qty !== undefined);

  useEffect(() => {
    setValue(
      'allocate',
      data.map((item, idx) => {
        if (allocateData.filter(i => i.product_id === productId && i.actual_qty !== undefined).length > 0) {
          const actual = [];

          filter.map(i => {
            actual.push(i.actual_qty);
            return i;
          });

          item.actual_qty = actual[idx];
        }
        return item;
      })
    );
  }, [data]);

  const onSubmit = data => {
    const body = {
      allocate: data.allocate.map(item => {
        return {
          inbound_date: Moment(item.date).format('YYYY-MM-DD'),
          rack: item.rack,
          bay: item.bay,
          level: item.level,
          qty: 0,
          actual_qty: item.actual_qty,
          product_id: productId,
        };
      }),
    };

    if (body.allocate.filter(i => i.qty !== undefined).length !== 0) {
      boundActivity.setAllocate([{ isAllocate: true, product_id: productId }]);
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
            {/* <LoadingComponent loading={loadingTransit} /> */}

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
                <Tr className="bg-gray-100 w-full border-2 border-solid border-[#f3f4f6] border-red-500">
                  <Td className="w-10 text-center px-2  text-red-500 h-[170px]" colSpan={9} rowSpan={5} />
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </div>

      <div className="  flex justify-between">
        {errors && (
          <span className="pl-10 text-[#a2002d]">{`${
            errors?.allocate?.type === 'server' ? errors?.allocate.message : ''
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
