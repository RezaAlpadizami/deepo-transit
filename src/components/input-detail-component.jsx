import React from 'react';
import { FormControl } from '@chakra-ui/react';

const inputDetailComponent = props => {
  const { label, value } = props;
  return (
    <FormControl className="flex-auto w-full mt-3">
      <label className="text-lg text-[#212121] block mb-2 ml-1 font-bold">{label}</label>
      <span className="d-block text-lg mt-2 mb-3 ml-2.5 text-gray-500" style={{ fontSize: '14px' }}>
        {value}
      </span>
    </FormControl>
  );
};

export default inputDetailComponent;
