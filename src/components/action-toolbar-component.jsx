import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DocumentDownloadIcon, EyeIcon, TrashIcon, ClipboardListIcon, ViewGridIcon } from '@heroicons/react/solid';
import ShowHide from './show-hide-component';
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
  const [showHide, setShowHide] = useState(false);

  const onView = () => {
    if (navTo) {
      navigate(`${navTo?.path}/${navTo?.id}/show`);
    }
  };

  const confirmationDelete = () => {
    Swal.fire({
      title: `Delete Data`,
      text: 'Are You sure want to delete this data?',
      padding: 20,
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonColor: '#246EE5',
      cancelButtonColor: '#FFFFFF',
      confirmButtonText: `<p class="text-[#246EE5] rounded-[8px] text-[#FFFFFF] bg-[#246EE5] px-5 py-2 m-2 hover:bg-blue-700">Delete</p>`,
      cancelButtonText: `<p class="text-[#246EE5] rounded-[8px] text-[#246EE5] border border-[#246EE5] px-5 py-2 hover:bg-gray-200">Cancel</p>`,
      reverseButtons: true,
    }).then(confirmation => {
      if (confirmation.isDismissed) return;
      if (confirmation.isConfirmed) onDelete();
    });
  };
  const onCopy = () => {
    let text = '';
    copyItem.forEach(val => {
      text += `${val.header}\t`;
    });
    selectedData.forEach(i => {
      text += '\n';
      const props = { ...i.original };
      copyItem.forEach(col => {
        const getValue = getNestedObject(props, col.value.split('.'));
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
    Swal.fire({
      customClass: {
        container: 'popup-info-confirmation',
      },
      icon: 'info',
      text: 'Copy to Clipboard',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
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
          onClick={confirmationDelete}
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
    </>
  );
}

export default ActionToolbar;
