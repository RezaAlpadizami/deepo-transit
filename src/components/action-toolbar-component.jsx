import React, { useState } from 'react';

import Moment from 'moment';
import copy from 'copy-to-clipboard';
import { useNavigate } from 'react-router-dom';
import { useToast, Button, useMediaQuery } from '@chakra-ui/react';

import ShowHide from './show-hide-component';
import DeletedList from './delete-list-component';
import { getNestedObject } from '../utils/helper';

const button = `hover:bg-[#50B8C1] hover:outline-none text-[#50B8C1] outline outline-offset-0 outline-[#50B8C1] bg-[#fff] text-xs rounded-md px-4 hover:text-white ml-3`;

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
    <div className={`flex ${isLarge ? 'py-6 px-6 rounded-t-3xl' : 'py-2 px-2 rounded-t-xl overflow-y-auto'} `}>
      {onAdd && (
        <Button type="button" size="sm" onClick={() => navigate(`${navTo?.path}/add`)} className={button}>
          +Add
        </Button>
      )}
      {onDownload && (
        <Button size="sm" className={button} onClick={onDownload}>
          Save
        </Button>
      )}
      {onEdit && (
        <Button
          size="sm"
          className={button}
          onClick={() => navigate(`${navTo?.path}/${selectedData?.find(i => i).original.id}/edit`)}
          isDisabled={selectedData.length !== 1}
        >
          Update
        </Button>
      )}
      {onDelete && (
        <Button size="sm" className={button} onClick={() => setOnOpen(!onOpen)} isDisabled={selectedData.length === 0}>
          Delete
        </Button>
      )}

      {copyClipboard && (
        <Button size="sm" className={button} onClick={onCopy} isDisabled={selectedData.length === 0}>
          Copy
        </Button>
      )}
      {onShowHideColumn && (
        <>
          <Button size="sm" className={button} onClick={() => setShowHide(!showHide)}>
            Show / Hide
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
