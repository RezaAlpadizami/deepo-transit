import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

function TableCh(props) {
  const { data } = props;
  return (
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
                <Td>{d.product_sku}</Td>
                <Td>{d.product_name}</Td>
                <Td>{d.qty}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default TableCh;
