/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { useTable, useRowSelect, usePagination, useSortBy } from 'react-table';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import XLSX from 'xlsx';
import Moment from 'moment';
import { saveAs } from 'file-saver';
import Toolbar from './action-toolbar-component';
import { hasProperty } from '../utils/helper';
import { Checkbox } from './checkbox-component';
import TableComponent from './table-component';
import LoadingHover from './loading-component';

function DataTable(props) {
  const {
    data: propsData = [],
    columns: propsColumn = [],
    onChangePage = () => {},
    totalData = 0,
    limit = 10,
    loading = false,
    toolbar,
    noToolbar,
    to,
    api,
    checkbox,
    name,
  } = props;

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingHover, setLoadingHover] = useState(false);

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
          Cell: props => {
            const { value } = props;
            if (d.type === 'date') {
              return Moment(value).format('DD MMM YYYY');
            }
            return value;
          },
        };
      }),
    [JSON.stringify(propsColumn)]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    getToggleHideAllColumnsProps,
    allColumns,
  } = useTable({ columns, data }, useSortBy, usePagination, useRowSelect, hooks => {
    if (checkbox) {
      hooks.visibleColumns.push(column => {
        return [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <Checkbox {...getToggleAllRowsSelectedProps()} style={{ width: '15px', height: '15px' }} />
            ),
            Cell: ({ row }) => (
              <Checkbox {...row.getToggleRowSelectedProps()} style={{ width: '15px', height: '15px' }} />
            ),
          },
          ...column,
        ];
      });
    }
  });

  const changePage = page => {
    setPage(page);
    onChangePage(page);
  };

  const isActionToolbarExclude = action => {
    let force = false;
    let exclude = false;
    if (toolbar) {
      if (hasProperty(toolbar, 'action')) {
        force = true;
        if (
          !hasProperty(toolbar.action, action) ||
          (hasProperty(toolbar.action, action) && toolbar.action[action] === false)
        ) {
          exclude = true;
        } else {
          exclude = false;
        }
      }
    }
    return [force, exclude];
  };
  const checkPermissionAction = action => {
    let act;
    switch (action) {
      case 'view':
        act = 'view';
        break;
      case 'delete':
        act = 'delete';
        break;
      case 'save-to-excel':
        act = 'SaveDataToExcel';
        break;
      case 'copy-to-clipboard':
        act = 'CopyToClipboard';
        break;
      case 'show-hide-column':
        act = 'ShowHideColumn';
        break;
      default:
        break;
    }
    return act;
  };

  const enableAction = action => {
    const actions = {
      view: 'view',
      delete: 'delete',
      'save-to-excel': 'download',
      'show-hide-column': 'showHideColumn',
      'copy-to-clipboard': 'copyClipboard',
    };
    if (Object.keys(actions).includes(action)) {
      const [force, status] = isActionToolbarExclude(action);
      if (!force) {
        return checkPermissionAction(action);
      }
      return !status;
    }
    return false;
  };
  const shouldRenderToolbar = () => {
    if (!noToolbar && toolbar) {
      return (
        enableAction('view') ||
        enableAction('save-to-excel') ||
        enableAction('copy-to-clipboard') ||
        enableAction('edit') ||
        enableAction('delete') ||
        enableAction('add') ||
        enableAction('show-hide-column')
      );
    }
    return false;
  };

  const deleteData = () => {
    Promise.allSettled([
      selectedFlatRows.map(d => {
        return new Promise((resolve, reject) => {
          api
            .delete(d.values.id)
            .then(r => resolve(r))
            .catch(e => reject(e));
        });
      }),
    ]).then(result => {
      const success = [];
      const failed = [];
      result.forEach(r => {
        if (r.status === 'fulfilled') {
          success.push(true);
          setLoadingHover(false);
        } else {
          result.reason.data.error.api.map(m => failed.push(m));
        }
      });

      if (success.length > 0) {
        Swal.fire({ text: 'Data Deleted Successfully', icon: 'success' });
      } else if (failed.length > 0) {
        Swal.fire({ text: 'Something Went Wrong', icon: 'success' });
      }
    });
  };

  const download = () => {
    setLoadingHover(true);
    const wb = XLSX.utils.table_to_book(document.getElementById('mytable'), {
      sheet: `${name}`,
    });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    function s2ab(data) {
      const buf = new ArrayBuffer(data.length);
      const view = new Uint8Array(buf);
      // eslint-disable-next-line no-bitwise, no-plusplus
      for (let i = 0; i < data.length; i++) view[i] = data.charCodeAt(i) & 0xff;
      return buf;
    }
    setTimeout(() => {
      setLoadingHover(false);
    }, 500);
    return saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${name}.xlsx`);
  };

  return (
    <>
      <LoadingHover visible={loadingHover} />
      {download && (
        <div style={{ display: 'none' }}>
          <TableComponent
            id="mytable"
            data={data}
            columns={allColumns.filter(i => i.id !== 'selection' && i.isVisible === true)}
            keys={data.filter(i => i[columns.map(i => i.accessor)])}
            header={propsColumn.filter(i => i.value)}
          />
        </div>
      )}

      {shouldRenderToolbar() && (
        <Toolbar
          selectedData={selectedFlatRows}
          defaultShow={propsColumn}
          getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
          columns={allColumns}
          navTo={{ path: to, id: selectedFlatRows?.find(i => i)?.original.id }}
          copyItem={allColumns.filter(i => i.id !== 'selection' && i.isVisible === true)}
          copyClipboard={enableAction('copy-to-clipboard')}
          view={enableAction('view')}
          onDelete={enableAction('delete') && deleteData}
          onDownload={enableAction('save-to-excel') && download}
          onShowHideColumn={enableAction('show-hide-column')}
        />
      )}
      <div className="overflow-x-auto relative border-1 mt-4">
        <table
          {...getTableProps()}
          className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400 border"
        >
          <thead className="text-xs text-black uppercase bg-thead dark:bg-gray-700 dark:text-gray-400">
            {headerGroups.map((headerGroup, idxgroup) => (
              <tr key={idxgroup} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnidx) => (
                  <th key={columnidx} {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 px-6">
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
                // setSelectedData(selectedFlatRows);
                return (
                  <tr
                    key={i}
                    {...row.getRowProps()}
                    className={`${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } border-b hover:bg-slate-100 dark:bg-gray-900 dark:border-gray-700`}
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

        <nav
          className="flex justify-between items-center bg-white pl-4 border-x border-b"
          aria-label="Table navigation"
        >
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
            {Array(
              lastPage > 7 && lastPage - page <= 3 ? 5 : lastPage > 7 && page > 4 ? 3 : lastPage > 7 ? 5 : lastPage
            )
              .fill('')
              .map((_, i) => {
                const p = lastPage > 7 && lastPage - page <= 3 ? lastPage - 4 : lastPage > 7 && page > 4 ? page - 1 : 1;
                return (
                  <li key={i}>
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
    </>
  );
}

export default observer(DataTable);
