import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import LottiesAnimation from './lotties-animation-component';
import StopScanAnimation from '../assets/lotties/Stop-scan.json';

function FilePicker({ onFileChange, isScanning, toggleScan, dynamicPath }) {
  const [watchingFile, setWatchingFile] = useState(false);
  const [rfidDetected, setRfidDetected] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_UI_URL_PATH}${dynamicPath}`);
      const text = await response.text();
      setRfidDetected(text);
      await onFileChange(text);
    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      if (watchingFile) {
        setTimeout(fetchData, 1000);
      }
    }
  };

  useEffect(() => {
    if (isScanning) {
      setWatchingFile(true);
      fetchData();
    } else {
      setWatchingFile(false);
    }

    return () => {
      clearTimeout();
    };
  }, [isScanning, dynamicPath, rfidDetected]);

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
