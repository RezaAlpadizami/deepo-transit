import React from 'react';
import { Textarea } from '@chakra-ui/react';

function InputComponent(props) {
  const {
    name,
    label,
    maxLength = 255,
    disabled,
    type = 'text',
    register,
    errors,
    hidden = false,
    placeholder,
    value,
  } = props;

  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-md font-light text-gray-600 block ml-1">
          {label}
        </label>
        <div className="mt-1 flex shadow-sm">
          <Textarea
            {...register(name)}
            bg={`${disabled ? '#EDEDED' : 'white'}`}
            size="sm"
            width="auto"
            type={type}
            disabled={disabled}
            maxLength={maxLength}
            hidden={hidden}
            value={value}
            name={name}
            id={name}
            isInvalid={errors[name]}
            className="w-full h-28 text-md rounded-2xl border-gray-300 px-3 py-1"
            focusBorderColor="#3f44c2"
            placeholder={placeholder}
          />
        </div>
      </div>
      {errors[name] && (
        <span className="text-red-700 text-xs ml-1">{errors[name]?.message.replace(name, label.toLowerCase())}</span>
      )}
    </div>
  );
}

export default InputComponent;
