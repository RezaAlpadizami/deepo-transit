import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { useTable, useSortBy } from 'react-table';
import { observer } from 'mobx-react-lite';

function DataTable(props) {
  const {
    data: propsData = [],
    column: propsColumn = [],
    onChangePage = () => {},
    totalData = 0,
    limit = 10,
    loading = false,
  } = props;

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    setLastPage(Math.ceil(totalData / limit));
  }, [totalData, limit]);

  const data = React.useMemo(() => propsData, [JSON.stringify(propsData)]);

  const columns = React.useMemo(
    () =>
      propsColumn.map(d => {
        return {
          Header: d.header,
          accessor: d.value,
        };
      }),
    [JSON.stringify(propsColumn)]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

  const changePage = page => {
    setPage(page);
    onChangePage(page);
  };

  return (
    <div className="overflow-x-auto relative border-1 mt-4">
      <table
        {...getTableProps()}
        className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400 border"
      >
        <thead className="text-xs text-black uppercase bg-thead dark:bg-gray-700 dark:text-gray-400">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 px-6">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {!loading && (
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={`${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } border-b hover:bg-slate-100 dark:bg-gray-900 dark:border-gray-700`}
                >
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="py-2 px-6">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {loading && (
        <div className="w-full">
          <div className="">
            <div className=" border-b border-x border-gray-300 p-3 bg-white">
              <div className="animate-pulse rounded-full w-64 bg-slate-200 h-3" />
            </div>
            <div className="border-b border-x border-gray-300 p-3 bg-gray-50">
              <div className="rounded-full bg-slate-200 h-3 w-80" />
            </div>
            <div className=" border-b border-x border-gray-300 p-3 bg-white">
              <div className="animate-pulse rounded-full w-52 bg-slate-200 h-3" />
            </div>
            <div className="border-b border-x border-gray-300 p-3 bg-gray-50">
              <div className="rounded-full bg-slate-200 h-3 w-60" />
            </div>
            <div className=" border-b border-x border-gray-300 p-3 bg-white">
              <div className="animate-pulse rounded-full w-64 bg-slate-200 h-3" />
            </div>
            <div className="border-b border-x border-gray-300 p-3 bg-gray-50">
              <div className="rounded-full bg-slate-200 h-3 w-56" />
            </div>
          </div>
        </div>
      )}

      <nav className="flex justify-between items-center bg-white pl-4 border-x border-b" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {limit * (page - 1) + 1}-{page * limit}
          </span>{' '}
          of <span className="font-semibold text-gray-900 dark:text-white">{totalData}</span>
        </span>
        <ul className="inline-flex items-center text-sm -space-x-px">
          <li>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => (page === 1 ? {} : changePage(page - 1))}
              className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white disabled:text-gray-300 disabled:hover:bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          </li>
          {lastPage > 7 && page > 4 && (
            <>
              <li>
                <button
                  type="button"
                  onClick={() => changePage(1)}
                  className="py-2 px-3 leading-tight text-gray-500 bg-white  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="py-2 px-3 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  ...
                </button>
              </li>
            </>
          )}
          {Array(lastPage > 7 && lastPage - page <= 3 ? 5 : lastPage > 7 && page > 4 ? 3 : lastPage > 7 ? 5 : lastPage)
            .fill('')
            .map((_, i) => {
              const p = lastPage > 7 && lastPage - page <= 3 ? lastPage - 4 : lastPage > 7 && page > 4 ? page - 1 : 1;
              return (
                <li>
                  <button
                    type="button"
                    disabled={page === i + p}
                    onClick={() => changePage(i + p)}
                    className={`${
                      page === i + p ? 'bg-gray-200' : 'bg-white'
                    } py-2 px-3 leading-tight text-gray-500  hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                  >
                    {i + p}
                  </button>
                </li>
              );
            })}
          {lastPage > 7 && lastPage - page > 3 && (
            <>
              <li>
                <button
                  type="button"
                  className="py-2 px-3 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  ...
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => changePage(lastPage)}
                  className="py-2 px-3 leading-tight text-gray-500 bg-white  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {lastPage}
                </button>
              </li>
            </>
          )}
          <li>
            <button
              type="button"
              disabled={page === lastPage}
              onClick={() => (page === lastPage ? {} : changePage(page + 1))}
              className="block py-2 px-3 leading-tight text-gray-500 bg-white disabled:text-gray-300 disabled:hover:bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default observer(DataTable);
