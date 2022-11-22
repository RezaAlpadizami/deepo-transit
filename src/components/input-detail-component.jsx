import React from 'react';
import { FormControl } from '@chakra-ui/react';

const inputDetailComponent = props => {
  const { label, value } = props;
  return (
    <FormControl className="flex-auto w-full mt-3">
      <label className="text-sm font-normal text-[#212121] block ml-1 mb-3">{label}</label>
      <span className="d-block text-[#7A7A7A] text-muted mb-3 ml-3">{value}</span>
    </FormControl>
  );
};

export default inputDetailComponent;
