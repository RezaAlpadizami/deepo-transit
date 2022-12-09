import React from 'react';
import { FormControl } from '@chakra-ui/react';

const inputDetailComponent = props => {
  const { label, value, customStyleLabel, customStyleSpan } = props;
  return (
    <FormControl className="flex-auto w-full mt-3">
      <label
        className={
          customStyleLabel ? `block mb-2 ${customStyleLabel}` : `text-sm text-[#212121] block mb-2 ml-1 font-bold`
        }
      >
        {label}
      </label>
      <span
        className={
          customStyleSpan ? `mt-2 mb-3 ${customStyleSpan}` : `d-block text-muted mt-2 mb-3 ml-2.5 text-gray-500`
        }
        style={{ fontSize: '14px' }}
      >
        {value}
      </span>
    </FormControl>
  );
};

export default inputDetailComponent;
