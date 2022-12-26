import React from 'react';
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import Select from '../../../components/select-component';

function TransitScreen(props) {
  const { data, register, control, setCounter, onSplit = () => {} } = props;
  return (
    <div className="overflow-y-auto modal-content py-4 text-left px-6">
      <p className="text-md font-bold">Dashboard Transit</p>
      <div className="flex-1" />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>SKU</Th>
              <Th>ProducT</Th>
              <Th>QTy</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((d, i) => {
              return (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>{d.product_sku}</Td>
                  <Td>{d.product_name}</Td>
                  <Td>{d.qty}</Td>
                  <Td>
                    <div className="w-20">
                      <Select
                        name="rack"
                        placeholder="Rack"
                        options={[
                          {
                            value: 'asd',
                            label: '123',
                          },
                        ]}
                        register={register}
                        control={control}
                      />
                    </div>
                  </Td>
                  <Td>
                    <div className="w-20">
                      <Select
                        name="rack"
                        placeholder="Rack"
                        options={[
                          {
                            value: 'asd',
                            label: '123',
                          },
                        ]}
                        register={register}
                        control={control}
                      />
                    </div>
                  </Td>
                  <Td>
                    <div className="w-20">
                      <Select
                        name="rack"
                        placeholder="Rack"
                        options={[
                          {
                            value: 'asd',
                            label: '123',
                          },
                        ]}
                        register={register}
                        control={control}
                      />
                    </div>
                  </Td>
                  <Td>{d.child_qty}</Td>
                  <Td>
                    {d.qty ? (
                      <Button
                        size="md"
                        className="text-[#fff] font-bold bg-[#29A373] rounded-2xl"
                        key={i}
                        onClick={() => {
                          setCounter(count => count + 1);
                          onSplit(d.product_id, d.qty);
                        }}
                        px={6}
                      >
                        Split
                      </Button>
                    ) : null}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TransitScreen;
