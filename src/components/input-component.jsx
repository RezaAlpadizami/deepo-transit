import React from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';

function InputComponent(props) {
  const {
    name,
    label,
    maxLength = '100',
    disabled,
    type = 'text',
    register,
    errors,
    value,
    hidden = false,
    placeholder,
    icon,
    addOnleft,
    readOnly = false,
  } = props;

  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-sm font-light text-black block ml-1">
          {label}
        </label>
        <div className="mt-1 flex">
          {addOnleft ? (
            <InputGroup>
              <InputLeftElement fontSize="md" pointerEvents="none" className="ml-2">
                {icon}
              </InputLeftElement>
              <Input
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
                variant={disabled ? 'filled' : 'outline'}
                className={`${disabled ? 'bg-gray-200' : ''} w-full text-sm rounded-full border-gray-400 pl-12 py-5`}
                placeholder={placeholder}
              />
            </InputGroup>
          ) : (
            <Input
              {...register(name)}
              bg="white"
              size="sm"
              width="auto"
              type={type}
              value={value}
              isDisabled={disabled}
              maxLength={maxLength}
              hidden={hidden}
              name={name}
              id={name}
              variant={disabled ? 'filled' : 'outline'}
              className={`${disabled ? 'bg-gray-200' : ''} w-full text-sm rounded-full border-gray-400 px-5 py-5`}
              placeholder={placeholder}
              readOnly={readOnly}
            />
          )}
        </div>
      </div>
      {errors &&
        (Array.isArray(errors[name]?.message) ? (
          errors[name]?.message.map(m => <span className="error d-block">{m.toLowerCase()}</span>)
        ) : (
          <span className="text-red-700 ml-1">
            {errors[name]?.message.replace(name, label?.toLowerCase() || name.toLowerCase())}
          </span>
        ))}
    </div>
  );
}

export default InputComponent;
