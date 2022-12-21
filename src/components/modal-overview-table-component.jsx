import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge } from '@chakra-ui/react';

const th = 'text-[#797979] font-bold';
const td = 'font-semibold text-sm';
function ModalTable(props) {
  const { datas } = props;
  const onProgress = () => {};
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th className={`${th}`}>Request Number</Th>
            <Th className={`${th}`}>User</Th>
            <Th className={`${th}`}>Activity</Th>
            <Th className={`${th}`}>Date</Th>
            <Th className={`${th}`}>Notes</Th>
            <Th className={`${th}`}>Status</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {datas?.map((d, i) => {
            return (
              <Tr>
                <Td className={`${td}`}>{`000${i + 1}/NOV/2022`}</Td>
                <Td className={`${td}`}>{d.request_by}</Td>
                <Td className={`${td}`}>{d.status}</Td>
                <Td className={`${td}`}>{d.id}</Td>
                <Td className={`${td}`}>{d.status}</Td>
                <Td className={`${td}`}>{d.status}</Td>
                <Badge
                  onClick={() => onProgress(i, d.id)}
                  size="sm"
                  px={4}
                  className="bg-[#29AE73] rounded-full font-bold text-[#fff] mt-4 pointer-events-auto"
                >
                  Process
                </Badge>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default ModalTable;
