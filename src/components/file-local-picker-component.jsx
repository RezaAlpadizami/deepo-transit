import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@chakra-ui/react';
import labelRegistrationApi from '../services/api-label-registration';
import LottiesAnimation from './lotties-animation-component';
import StopScanAnimation from '../assets/lotties/Stop-scan.json';
import Context from '../context';

function FilePicker({ onFileChange, isScanning, toggleScan, dynamicPath, dataRfid, getDataLabelRegistered }) {
  const [watchingFile, setWatchingFile] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [timeoutCheck, setTimeoutCheck] = useState(null);
  const { registrationStore } = useContext(Context);

  const rfidNumberToCheck = {
    rfid_number: dataRfid?.map(item => item.rfid_number),
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_UI_URL_PATH}${dynamicPath}`);
      const text = await response.text();
      await onFileChange(text);
    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      if (watchingFile) {
        setTimeoutId(setTimeout(fetchData, 1000));
      }
    }
  };

  const checkLabelAlreadyRegistered = () => {
    labelRegistrationApi
      .validationRegister(rfidNumberToCheck)
      .then(res => {
        registrationStore.setLabelRegistered(res?.data?.data);
      })
      .catch(error => {
        console.log('error', error);
      })
      .finally(() => {
        if (watchingFile) {
          setTimeoutCheck(setTimeout(checkLabelAlreadyRegistered, 2000));
        }
      });
  };

  useEffect(() => {
    const cleanup = () => {
      setWatchingFile(false);
      if (timeoutId || timeoutCheck) {
        clearTimeout(timeoutId);
        clearTimeout(timeoutCheck);
      }
    };

    if (!isScanning) {
      cleanup();
    } else {
      setWatchingFile(true);
      fetchData();
      checkLabelAlreadyRegistered();
      getDataLabelRegistered();
    }
  }, [isScanning, dynamicPath, watchingFile]);

  return (
    <div className="flex flex-col gap-2">
      <Button
        _hover={{
          shadow: 'md',
          transform: 'translateY(-5px)',
          transitionDuration: '0.2s',
          transitionTimingFunction: 'ease-in-out',
        }}
        type="button"
        size="sm"
        px={12}
        className="relative rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-semibold"
        onClick={toggleScan}
      >
        {isScanning ? <LottiesAnimation visible={isScanning} animationsData={StopScanAnimation} width={120} /> : 'Scan'}
      </Button>
    </div>
  );
}

export default FilePicker;
