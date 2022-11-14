import React from 'react';
import { Textarea } from '@chakra-ui/react';

function InputComponent(props) {
  const {
    name,
    label,
    maxLength = 100,
    disabled,
    type = 'text',
    register,
    errors,
    hidden = false,
    placeholder,
  } = props;

  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-sm font-light text-gray-600 block ml-1">
          {label}
        </label>
        <div className="mt-1 flex  shadow-sm">
          <Textarea
            {...register(name)}
            bg="white"
            size="sm"
            width="auto"
            type={type}
            isDisabled={disabled}
            maxLength={maxLength}
            hidden={hidden}
            name={name}
            id={name}
            isInvalid={errors[name]}
            className="w-full text-sm rounded-md border-gray-300 px-3 py-1"
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
