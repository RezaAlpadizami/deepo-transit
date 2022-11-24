import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { Button, Modal, ModalContent, useDisclosure, ModalOverlay, ModalHeader, ModalBody } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DocumentDownloadIcon, EyeIcon, TrashIcon, ClipboardListIcon, ViewGridIcon } from '@heroicons/react/solid';
import ShowHide from './show-hide-component';
import DeletedList from './delete-list-component';
import { getNestedObject } from '../utils/helper';

const button = 'border-black border-2 ml-3';

function ActionToolbar(props) {
  const {
    onDownload,
    view,
    onDelete,
    copyClipboard,
    onShowHideColumn,
    selectedData,
    navTo,
    getToggleHideAllColumnsProps,
    columns,
    copyItem,
  } = props;

  const navigate = useNavigate();
  const { onClose, isOpen, onOpen } = useDisclosure();
  const [showHide, setShowHide] = useState(false);
  const onView = () => {
    if (navTo) {
      navigate(`${navTo?.path}/${navTo?.id}/show`);
    }
  };

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
    <>
      {onDownload && (
        <Button leftIcon={<DocumentDownloadIcon size="xl" className="w-5 " />} className={button} onClick={onDownload}>
          Save to Excel
        </Button>
      )}
      {view && (
        <Button
          leftIcon={<EyeIcon size="xl" className="w-5" />}
          className={button}
          onClick={onView}
          disabled={selectedData.length !== 1}
        >
          View
        </Button>
      )}
      {onDelete && (
        <Button
          leftIcon={<TrashIcon size="xl" className="w-5" />}
          className={button}
          onClick={onOpen}
          disabled={selectedData.length === 0}
        >
          Delete
        </Button>
      )}
      {copyClipboard && (
        <Button
          leftIcon={<ClipboardListIcon size="xl" className="w-5" />}
          className={button}
          onClick={onCopy}
          disabled={selectedData.length === 0}
        >
          Copy to Clipboard
        </Button>
      )}
      {onShowHideColumn && (
        <>
          <Button
            leftIcon={<ViewGridIcon size="xl" className="w-5" />}
            className={button}
            onClick={() => setShowHide(!showHide)}
          >
            Show/Hide Columns
          </Button>
          <ShowHide
            getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
            visible={showHide}
            columns={columns.filter(i => i.id !== 'selection')}
            onClose={() => setShowHide(!showHide)}
          />
        </>
      )}
      <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent
          className={`max-w-[70%] max-h-[70%] absolute py-10 ${
            selectedData.length === 1
              ? 'h-[30%]'
              : selectedData.length >= 2 && selectedData.length <= 5
              ? 'h-[40%]'
              : 'h-[60%] overflow-y-scroll'
          } `}
        >
          <ModalHeader>
            <div className="flex">
              <p className="text-sm font-semibold ml-5"> Are you sure want to delete this data ?</p>
              <div className="flex-1" />
              <Button
                className="rounded-full bg-[#aaa] outline outline-offset-2 outline-[#1F2022]"
                colorScheme="blue"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full bg-[#232323] text-[#fff]"
                variant="blue"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                Delete Data
              </Button>
            </div>
          </ModalHeader>
          <ModalBody className="mx-auto">
            <DeletedList datas={selectedData} columnsData={columns} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ActionToolbar;
