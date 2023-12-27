import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import LottiesAnimation from './lotties-animation-component';
import StopScanAnimation from '../assets/lotties/Stop-scan.json';
import Context from '../context';
import LabelRegistrationApi from '../services/api-label-registration';

function FilePicker({ onFileChange, isScanning, toggleScan, dynamicPath, dataRfid }) {
  const [watchingFile, setWatchingFile] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [timeoutCheck, setTimeoutCheck] = useState(null);
  const { registrationStore } = useContext(Context);
  const navigate = useNavigate();

  const rfidNumberToCheck = {
    rfid_number: dataRfid?.map(item => item.rfid_number),
  };

  useEffect(() => {
    getDataLabelRegistered();
  }, [rfidNumberToCheck]);

  const getDataLabelRegistered = () => {
    const rfidNumber = {
      rfid_number:
        (dataRfid?.map(item => item.rfid_number) || []).length > 0 ? dataRfid.map(item => item.rfid_number) : [''],
    };
    LabelRegistrationApi.get({ rfid_number: rfidNumber.rfid_number })
      .then(res => {
        registrationStore.setDataListRegistered(res?.data);
      })
      .catch(error => {
        Swal.fire({
          text: error?.message || error?.originalError || 'Please check your path file',
          icon: 'error',
        });
        clearTimeout(timeoutId);
        clearTimeout(timeoutCheck);
        navigate('/setting-path');
      });
  };

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_UI_URL_PATH}${dynamicPath}`);
  //     const text = await response.text();
  //     await onFileChange(text);
  //   } catch (error) {
  //     console.log('errorres', error);
  //     if (error) {
  //       Swal.fire({ text: 'Your file path is not correct', icon: 'error' });
  //       clearTimeout(timeoutId);
  //       clearTimeout(timeoutCheck);
  //       navigate('/setting-path');
  //     }
  //   } finally {
  //     if (watchingFile) {
  //       setTimeoutId(setTimeout(fetchData, 1000));
  //     }
  //   }
  // };

  // const checkLabelAlreadyRegistered = () => {
  //   LabelRegistrationApi.validationRegister(rfidNumberToCheck)
  //     .then(res => {
  //       registrationStore.setLabelRegistered(res?.data?.data);
  //     })
  //     .catch(error => {
  //       Swal.fire({ text: error?.message || error?.originalError || 'Please check your path file', icon: 'error' });
  //       clearTimeout(timeoutId);
  //       clearTimeout(timeoutCheck);
  //       navigate('/setting-path');
  //     })
  //     .finally(() => {
  //       if (watchingFile) {
  //         setTimeoutCheck(setTimeout(checkLabelAlreadyRegistered, 2000));
  //       }
  //     });
  // };

  useEffect(() => {
    let isMounted = true;
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
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_UI_URL_PATH}${dynamicPath}`);
          const text = await response.text();
          await onFileChange(text);
        } catch (error) {
          console.log('errorres', error);
          if (error) {
            Swal.fire({ text: 'Your file path is not correct', icon: 'error' });
            clearTimeout(timeoutId);
            clearTimeout(timeoutCheck);
            navigate('/setting-path');
            return;
          }
        } finally {
          if (isMounted && watchingFile) {
            setTimeoutId(setTimeout(fetchData, 1000));
          }
        }
      };
      const checkLabelAlreadyRegistered = () => {
        LabelRegistrationApi.validationRegister(rfidNumberToCheck)
          .then(res => {
            registrationStore.setLabelRegistered(res?.data?.data);
          })
          .catch(error => {
            Swal.fire({ text: error?.message || error?.originalError || 'Please check your path file', icon: 'error' });
            navigate('/setting-path');
          })
          .finally(() => {
            if (isMounted && watchingFile) {
              setTimeoutCheck(setTimeout(checkLabelAlreadyRegistered, 2000));
            }
          });
      };
      fetchData();
      checkLabelAlreadyRegistered();
    }
    return () => {
      isMounted = false;
      cleanup();
    };
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
