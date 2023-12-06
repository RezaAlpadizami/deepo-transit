import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import LottiesAnimation from './lotties-animation-component';
import StopScanAnimation from '../assets/lotties/Stop-scan.json';

function FilePicker({ onFileSelect }) {
  const [pollRate] = useState(1);
  const [intervalId, setIntervalId] = useState(null);
  const [isScanning, setIsScanning] = useState(() => {
    return localStorage.getItem('isScanning') === 'true' || false;
  });
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_UI_PATH}dummy-data.txt`);
        const text = await response.text();

        if (text !== fileContent) {
          setFileContent(text);
          onFileSelect(text);
          localStorage.setItem('fileContent', text);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    if (isScanning) {
      const newIntervalId = setInterval(fetchData, pollRate * 1000);
      setIntervalId(newIntervalId);

      fetchData();
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isScanning, pollRate]);

  const toggleScan = () => {
    const newIsScanning = !isScanning;
    setIsScanning(newIsScanning);
    localStorage.setItem('isScanning', newIsScanning.toString());
  };

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
