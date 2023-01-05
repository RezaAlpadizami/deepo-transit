import { Button } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Screen() {
  const navigate = useNavigate();
  return (
    <div className="absolute right-0 bottom-0 left-0 top-0 bg-white grid place-content-center justify-center mx-auto text-center h-full">
      <h1 className="mb-3 font-semibold tracking-wide" style={{ fontSize: '50px', color: '#d2d2d2' }}>
        ...Ooops
      </h1>
      <p className="mb-4 tracking-wide" style={{ color: '#676464' }}>
        Kamu belum menentukan Area kerja kamu
      </p>
      <p className="mb-4 tracking-wide" style={{ color: '#676464' }}>
        Pastikan kamu sudah memilih area kerja kamu untuk akses ke halaman ini.
      </p>
      <div className="grid place-content-center mt-10">
        <Button px={8} onClick={() => navigate('/')} colorScheme="red" variant="solid">
          Pilih Area
        </Button>
      </div>
    </div>
  );
}

export default Screen;
