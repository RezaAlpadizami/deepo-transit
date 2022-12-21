import { Button } from '@chakra-ui/react';
import React from 'react';
import { useTable, useRowSelect } from 'react-table';

// import SelectComponent from './select-component';

function ModalTable(props) {
  const { datas, columns: propsColumn = [], onSplit = () => {} } = props;
  // storage  register, control
  const data = React.useMemo(() => datas, [JSON.stringify(datas)]);

  const columns = React.useMemo(
    () =>
      propsColumn.map((d, i) => {
        return {
          Header: d.header,
          accessor: d.value,
          Cell: props => {
            const { value, row } = props;

            if (d.type === 'split') {
              return (
                <Button key={i} onClick={() => onSplit(row.original.id, row.original.id)} px={8}>
                  Split
                </Button>
              );
            }
            return value;
          },
        };
      }),
    [JSON.stringify(propsColumn)]
  );

  const { getTableProps, getTableBodyProps, rows, prepareRow, headerGroups } = useTable(
    { columns, data },
    useRowSelect
  );
  return (
    <div className="overflow-x-auto relative px-6 pb-11 bg-white rounded-b-3xl">
      <table {...getTableProps()} className="table-auto w-full text-sm text-left text-gray-500 border-t">
        <thead className="text-xs text-black uppercase bg-thead">
          {headerGroups.map((headerGroup, idxgroup) => (
            <tr key={idxgroup} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, columnidx) => (
                <th key={columnidx} {...column.getHeaderProps()} className="py-3 px-6">
                  <div className="flex">{column.render('Header')}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                key={i}
                {...row.getRowProps()}
                className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}border-b hover:bg-slate-100`}
              >
                {row.cells.map((cell, idx) => (
                  <td key={idx} {...cell.getCellProps()} className="py-2 px-6">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ModalTable;
