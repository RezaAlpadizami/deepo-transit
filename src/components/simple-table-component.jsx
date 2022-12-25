import React from 'react';
import { Button } from '@chakra-ui/react';
import { useTable, useRowSelect } from 'react-table';

import Select from './select-component';
import Input from './input-component';

function SimpleTable(props) {
  const { datas, columns: propsColumn = [], onSplit = () => {}, register, control } = props;

  // storage  register, control
  const data = React.useMemo(() => datas, [JSON.stringify(datas)]);

  const columns = React.useMemo(
    () =>
      propsColumn.map((d, i) => {
        return {
          Header: d.header,
          accessor: d.value,
          width: d.width,

          Cell: props => {
            const { value, row } = props;
            if (d.type === 'select') {
              return (
                <div className="w-20">
                  <Select
                    name="rack"
                    placeholder={d.placeholder}
                    options={
                      d.data.map(i => {
                        return {
                          value: i[d.name],
                          label: i[d.name],
                        };
                      }) || []
                    }
                    register={register}
                    control={control}
                  />
                </div>
              );
            }

            if (d.type === 'split' && row.original.request_number) {
              return (
                <Button
                  size="md"
                  className="text-[#fff] font-bold bg-[#29A373] rounded-2xl"
                  key={i}
                  onClick={() => {
                    onSplit(row.index + 1, row.original.id);
                  }}
                  px={6}
                >
                  Split
                </Button>
              );
            }

            if (d.type === 'input') {
              console.log('value', value);
              return (
                <div className="w-16">
                  <Input name={`${d.name}`} value={value} register={register} control={control} array key={i} />
                </div>
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
        <thead className="text-xs text-black uppercase bg-white border-b">
          {headerGroups.map((headerGroup, idxgroup) => (
            <tr key={idxgroup} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, columnidx) => (
                <th key={columnidx} {...column.getHeaderProps()} className="py-3 px-6" width={column.width}>
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
              <tr key={i} {...row.getRowProps()} className="bg-white border-1 border-b hover:bg-slate-100">
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

export default SimpleTable;
