import React, { useRef } from 'react';
import { Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

function InputComponent(props) {
  const {
    name,
    label,
    maxLength = '100',
    disabled,
    type = 'text',
    register,
    errors,
    value = '',
    hidden = false,
    placeholder,
    icon,
    addOnleft,
    addOnRight,
    readOnly = false,
    array,
    key,
    control,
    idx,
  } = props;
  const ref = useRef(null);

  const handleClick = () => {
    ref.current.focus();
  };

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
              <Controller
                name={name}
                render={({ field: { onChange, value, name } }) => {
                  return (
                    <Input
                      name={name}
                      bg="white"
                      width="auto"
                      size="sm"
                      type={type}
                      disabled={disabled}
                      placeholder={placeholder}
                      selected={value}
                      value={value}
                      onChange={onChange}
                      maxLength={maxLength}
                      id={name}
                      readOnly={readOnly}
                      variant={disabled ? 'filled' : 'outline'}
                      className={`${
                        disabled ? 'bg-gray-200' : ''
                      } w-full text-sm rounded-full border-gray-400 pl-12 py-5`}
                    />
                  );
                }}
                refs={register}
                control={control}
              />
            </InputGroup>
          ) : addOnRight ? (
            <InputGroup>
              <Controller
                name={name}
                render={({ field: { onChange, value, name } }) => {
                  return (
                    <Input
                      name={name}
                      bg="white"
                      width="auto"
                      size="sm"
                      ref={ref}
                      type={type}
                      disabled={disabled}
                      placeholder={placeholder}
                      selected={value}
                      autoComplete="off"
                      value={value}
                      onChange={onChange}
                      maxLength={maxLength}
                      id={name}
                      readOnly={readOnly}
                      variant={disabled ? 'filled' : 'outline'}
                      className={`${
                        disabled ? 'bg-gray-200' : ''
                      } w-full text-sm rounded-full border-gray-400 pl-6 py-5`}
                    />
                  );
                }}
                refs={register}
                control={control}
              />
              <InputRightElement fontSize="md" className="mx-2 cursor-pointer" onClick={handleClick}>
                {icon}
              </InputRightElement>
            </InputGroup>
          ) : array && key ? (
            <Input
              {...register(`${name}_${key}`)}
              bg="white"
              size="sm"
              width="auto"
              type={type}
              value={value}
              disabled={disabled}
              maxLength={maxLength}
              hidden={hidden}
              name={name}
              id={name}
              variant={disabled ? 'filled' : 'outline'}
              className={`${disabled ? 'bg-gray-200' : ''} w-full text-sm rounded-full border-gray-400 px-5 py-5`}
              placeholder={placeholder}
              readOnly={readOnly}
            />
          ) : (
            <Controller
              name={name}
              render={({ field: { onChange, value, name } }) => {
                return (
                  <Input
                    name={name}
                    bg="white"
                    width="auto"
                    size="sm"
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    selected={value}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    id={name}
                    readOnly={readOnly}
                    variant={disabled ? 'filled' : 'outline'}
                    className={`${disabled ? 'bg-gray-200' : ''} w-full text-sm rounded-full border-gray-400 px-5 py-5`}
                  />
                );
              }}
              refs={register}
              control={control}
            />
          )}
        </div>
      </div>
      {errors &&
        (Array.isArray(errors[name]?.message) ? (
          errors[name]?.message.map(m => <span className="error d-block">{m.toLowerCase()}</span>)
        ) : errors?.allocate?.length ? (
          <span className="text-red-700 ml-1">
            {errors?.allocate?.map(i => {
              return i[name.split('.')[2]]?.message.split('.')[1];
            })[idx] ||
              errors?.allocate?.map(i => {
                return i[name.split('.')[2]]?.message;
              })}
          </span>
        ) : errors?.details?.length ? (
          <span className="text-red-700 ml-1">
            {
              errors?.details?.map(i => {
                if (i) {
                  return i[[name.split('.')[2]]]?.message;
                }
                return i;
              })[idx]
            }
          </span>
        ) : (
          <span className="text-red-700 ml-1">
            {errors[name]?.message.replace(name, label?.toLowerCase() || name.toLowerCase())}
          </span>
        ))}
    </div>
  );
}

export default InputComponent;
