import React, { useState } from 'react';

import Moment from 'moment';
import { useToast, Button, useMediaQuery } from '@chakra-ui/react';
import copy from 'copy-to-clipboard';

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

const button = `hover:bg-secondarydeepo hover:outline-none text-black outline outline-offset-0 outline-[#A6A9B6] bg-[#fff] text-xs rounded-xl px-3 hover:text-white ml-3`;
const disableButton =
  'text-black outline outline-offset-0 outline-[#A6A9B6] bg-[#fff] text-sm rounded-xl px-2 text-black ml-3';

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
  const [isLarge] = useMediaQuery('(min-width: 800px)');
  const [onOpen, setOnOpen] = useState(false);
  const [showHide, setShowHide] = useState(false);
  const toast = useToast();

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

        const getVal =
          typeof getValue === 'number'
            ? getValue
            : Moment(getValue, Moment.ISO_8601, true).isValid()
            ? Moment(getValue).format('DD-MMM-YYYY')
            : getValue;

        text += `${
          getVal
            ? getVal
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
    toast({
      title: 'Copied !',
      status: 'success',
      variant: 'subtle',
      position: 'top',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <div className={`flex bg-white ${isLarge ? 'py-6 px-6 rounded-t-3xl' : 'py-2 px-2 rounded-t-xl overflow-y-auto'} `}>
      {onAdd && (
        <Button
          type="button"
          size="sm"
          onClick={() => navigate(`${navTo?.path}/add`)}
          className="hover:bg-secondarydeepo hover:outline-none outline outline-offset-0 outline-[#aaa] bg-[#fff] text-xs rounded-xl px-2 text-black hover:text-white"
        >
          {isLarge && (
            <div className="hover:text-red-200 h-4 w-4 mr-2">
              <img src={addIcon} alt="add icon" className="mr-2 drop-shadow-md" />
            </div>
          )}
          {isLarge ? `Add ${displayName}` : 'Add'}
        </Button>
      )}
      {onDownload && (
        <Button size="sm" className={button} onClick={onDownload}>
          <div className={`${isLarge ? 'h-3.5 w-3.5 mr-2' : ''} hover:text-red-200 `}>
            <img src={saveExcelIcon} alt="add icon" className={`${isLarge ? '' : 'h-4 pl-1'} mr-2 drop-shadow-md`} />
          </div>
          {isLarge ? 'Save to Excel' : ''}
        </Button>
      )}
      {onEdit && (
        <Button
          size="sm"
          className={`${selectedData.length !== 1 ? disableButton : button}`}
          onClick={() => navigate(`${navTo?.path}/${selectedData?.find(i => i).original.id}/edit`)}
          disabled={selectedData.length !== 1}
        >
          <div className={`${isLarge ? 'h-5 w-5 mr-2' : ''} hover:text-red-200`}>
            <img src={editIcon} alt="add icon" className={`${isLarge ? '' : 'h-4 pl-1'} mr-2 drop-shadow-md`} />
          </div>
          {isLarge ? 'Update' : ''}
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          className={`${selectedData.length === 0 ? disableButton : button}`}
          onClick={() => setOnOpen(!onOpen)}
          disabled={selectedData.length === 0}
        >
          <div className={`${isLarge ? 'h-5 w-5 mr-2' : ''} hover:text-red-200`}>
            <img src={deleteIcon} alt="add icon" className={`${isLarge ? '' : 'h-4 pl-1'} mr-2 drop-shadow-md`} />
          </div>
          {isLarge ? 'Delete' : ''}
        </Button>
      )}

      {copyClipboard && (
        <Button
          size="sm"
          className={`${selectedData.length === 0 ? disableButton : button}`}
          onClick={onCopy}
          disabled={selectedData.length === 0}
        >
          <div className={`${isLarge ? 'h-5 w-5 mr-2' : ''} hover:text-red-200`}>
            <img
              src={copyClipboardIcon}
              alt="add icon"
              className={`${isLarge ? '' : 'h-4 pl-1'} mr-2 drop-shadow-md`}
            />
          </div>
          {isLarge ? 'Copy to Clipboard' : ''}
        </Button>
      )}
      {onShowHideColumn && (
        <>
          <Button size="sm" className={button} onClick={() => setShowHide(!showHide)}>
            <div className={`${isLarge ? 'h-5 w-5 mr-2' : ''} hover:text-red-200`}>
              <img
                src={showHideTableIcon}
                alt="add icon"
                className={`${isLarge ? '' : 'h-4 pl-1'} mr-2 drop-shadow-md`}
              />
            </div>
            {isLarge ? 'Show / Hide Column(s)' : ''}
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
                <p className={`${isLarge ? 'text-md' : 'text-sm'} font-bold`}>Are you sure to delete this data ?</p>
                <div className="flex-1" />
                <Button
                  _hover={{
                    shadow: 'md',
                    transform: 'translateY(-5px)',
                    transitionDuration: '0.2s',
                    transitionTimingFunction: 'ease-in-out',
                  }}
                  type="button"
                  size={`${isLarge ? 'sm' : 'xs'} `}
                  px={isLarge ? 8 : 4}
                  className={`${
                    isLarge ? '' : 'text-sm'
                  } rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#184D47] font-bold`}
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
                  size={`${isLarge ? 'sm' : 'xs'} `}
                  px={isLarge ? 8 : 4}
                  className={`${
                    isLarge ? '' : 'text-sm'
                  } ml-4 rounded-full bg-[#eb6058] drop-shadow-md text-[#fff] hover:text-[#E4E4E4] hover:bg-[#b74b44] font-bold`}
                  onClick={() => {
                    onDelete();
                    setOnOpen(!onOpen);
                  }}
                >
                  Delete
                </Button>
              </div>
              <div
                className={`my-5 ${
                  selectedData.length > 5 ? 'overflow-y-auto' : ''
                } flex justify-center overflow-x-auto `}
              >
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
