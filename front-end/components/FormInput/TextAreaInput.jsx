import React from 'react'
export default function TextAreaInput({
  label,
  register,
  name,
  errors,
  type = 'text',
  className = 'col-span-full',
  defaultValue,
  readonly = false,
  isRequired = true,
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block w-fit ml-0.5  text-[14px] font-medium leading-5 text-gray-700 mb-1 "
      >
        {label}
      </label>
      {register ? (
        <div className="mt-1">
          <textarea
            {...register(`${name}`, { required: isRequired })}
            type={type}
            name={name}
            id={name}
            readOnly={readonly}
            defaultValue={defaultValue}
            autoComplete={name}
            className="
          p-2 text-15 border-[2px] border-gray-300
            rounded-md focus:outline-none min-h-[110px] 
            focus:border-blue-300 w-full
            mt-1 placeholder:text-gray-500"
            placeholder={`${label.toLowerCase()}`}
          ></textarea>
          {errors[`${name}`] && (
            <span className="text-sm text-red-600 ">{label} is required</span>
          )}
        </div>
      ) : (
        <div className="mt-1">
          <textarea
            name={name}
            id={name}
            readOnly={true}
            defaultValue={defaultValue}
            autoComplete={name}
            className="
          p-2 text-15 border-[2px] border-gray-300
            rounded-md focus:outline-none min-h-[110px] 
            focus:border-blue-300 w-full
            mt-1 placeholder:text-gray-500"
            placeholder={`${label.toLowerCase()}`}
          ></textarea>
        </div>
      )}
    </div>
  )
}
