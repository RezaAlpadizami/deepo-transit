import React, { useState } from 'react';

import Swal from 'sweetalert2';
import copy from 'copy-to-clipboard';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import {
  addIcon,
  editIcon,
  deleteIcon,
  saveExcelIcon,
  copyClipboardIcon,
  showHideTableIcon,
} from '../assets/images/index';
import ShowHide from './show-hide-component';
import DeletedList from './delete-list-component';
import { getNestedObject } from '../utils/helper';

const button = `hover:bg-secondarydeepo hover:outline-none text-black outline outline-offset-0 outline-[#A6A9B6] bg-[#fff] text-sm rounded-xl px-4 text-black hover:text-white`;
const disableButton =
  'text-black outline outline-offset-0 outline-[#A6A9B6] bg-[#fff] text-sm rounded-xl px-4 text-black';

function ActionToolbar(props) {
  const {
    onDownload,
    onDelete,
    copyClipboard,
    onShowHideColumn,
    selectedData,
    navTo,
    getToggleHideAllColumnsProps,
    columns,
    copyItem,
    onAdd,
    onEdit,
    displayName,
  } = props;

  const navigate = useNavigate();
  const [onOpen, setOnOpen] = useState(false);
  const [showHide, setShowHide] = useState(false);

  const onCopy = () => {
    let text = '';
    copyItem.forEach(val => {
      text += `${val.Header}\t`;
    });
    selectedData.forEach(i => {
      text += '\n';
      const props = { ...i.original };
      copyItem.forEach(col => {
        const getValue = getNestedObject(props, col.id.split('.'));
        text += `${
          getValue
            ? getValue
                .toString()
                .replace(/(?:\r\n|\r|\n)/gm, '')
                .trim()
            : '-'
        }\t`;
      });
    });
    copy(text, {
      format: 'text/plain',
    });
    const Toast = Swal.mixin({
      toast: true,
      width: '18%',
      position: 'top-end',
      showConfirmButton: false,
      background: '#FFC000',
      padding: '1 0',
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'warning',
      iconColor: '#998032',
      title: '<h5>Copy to Clipboard</h5>',
    });
  };

  return (
    <div className="flex gap-4 bg-white py-6 px-6 rounded-t-3xl overflow-x-auto">
      {onAdd && (
        <Button
          type="button"
          onClick={() => navigate(`${navTo?.path}/add`)}
          className="hover:bg-secondarydeepo hover:outline-none outline outline-offset-0 outline-[#aaa] bg-[#fff] text-sm rounded-xl px-4 text-black hover:text-white"
        >
          <div className="hover:text-red-200 h-4 w-4 mr-2">
            <img src={addIcon} alt="add icon" className="mr-2 drop-shadow-md" />
          </div>
          Add {displayName}
        </Button>
      )}
      {onDownload && (
        <Button className={button} onClick={onDownload}>
          <div className="hover:text-red-200 h-3.5 w-3.5 mr-2">
            <img src={saveExcelIcon} alt="add icon" className="mr-2 drop-shadow-md" />
          </div>
          Save to Excel
        </Button>
      )}
      {onEdit && (
        <Button
          className={`${selectedData.length !== 1 ? disableButton : button}`}
          onClick={() => navigate(`${navTo?.path}/${selectedData?.find(i => i).original.id}/edit`)}
          disabled={selectedData?.find(i => i)?.original.status !== 'PENDING' || selectedData.length !== 1}
        >
          <div className="hover:text-red-200 h-5 w-5 mr-2">
            <img src={editIcon} alt="add icon" className="mr-2 drop-shadow-md" />
          </div>
          Update
        </Button>
      )}
      {onDelete && (
        <Button
          className={`${selectedData.length === 0 ? disableButton : button}`}
          onClick={() => setOnOpen(!onOpen)}
          disabled={selectedData?.some(i => i?.original.status !== 'PENDING') || selectedData.length === 0}
        >
          <div className="hover:text-red-200 h-5 w-5 mr-2">
            <img src={deleteIcon} alt="add icon" className="mr-2 drop-shadow-md" />
          </div>
          Delete
        </Button>
      )}

      {copyClipboard && (
        <Button
          className={`${selectedData.length === 0 ? disableButton : button}`}
          onClick={onCopy}
          disabled={selectedData.length === 0}
        >
          {' '}
          <div className="hover:text-red-200 h-5 w-5 mr-2">
            <img src={copyClipboardIcon} alt="add icon" className="mr-2 drop-shadow-md" />
          </div>
          Copy to Clipboard
        </Button>
      )}
      {onShowHideColumn && (
        <>
          <Button className={button} onClick={() => setShowHide(!showHide)}>
            <div className="hover:text-red-200 h-5 w-5 mr-2">
              <img src={showHideTableIcon} alt="add icon" className="mr-2 drop-shadow-md" />
            </div>
            Show / Hide Column(s)
          </Button>
          <ShowHide
            getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
            visible={showHide}
            columns={columns.filter(i => i.id !== 'selection')}
            onClose={() => setShowHide(!showHide)}
          />
        </>
      )}
      {onOpen && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded-xl z-50 overflow-y-auto py-4 px-2">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-MD font-bold">Are you sure to delete this data ?</p>
                <div className="flex-1" />
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
                  onClick={() => setOnOpen(!onOpen)}
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
                  onClick={() => {
                    onDelete();
                    setOnOpen(!onOpen);
                  }}
                >
                  Delete
                </Button>
              </div>
              <div className={`my-5 ${selectedData.length > 5 ? 'overflow-y-auto' : ''} flex justify-center `}>
                <DeletedList datas={selectedData} columnsData={columns} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionToolbar;
