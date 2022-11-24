/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';

function DeletedList(props) {
  const { datas, columnsData } = props;

  const columns = useMemo(() => datas, []);
  const data = useMemo(() => columnsData, []);

  return (
    <table className="table-auto">
      <thead className=" bg-thead dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {data.map((col, idx) => {
            return (
              <th key={idx} className="uppercase text-base px-5">
                {col.Header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className={`${columns.lenght > 5 ? 'overflow-y-scroll' : 'overflow-y-hidden'}`}>
        {columns.map((col, columnindx) => {
          return (
            <tr key={columnindx}>
              {col.cells.map((cell, idx) => (
                <td
                  key={idx}
                  className={`text-base px-5 text-center  border-b hover:bg-slate-100 dark:bg-gray-900 dark:border-gray-700 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } `}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DeletedList;
