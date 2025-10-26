'use client'
import React from 'react'
import { Controller } from 'react-hook-form'
import Select from 'react-select'

export default function SelectInput({
  label,
  name,
  control,
  isRequired = true,
  className = 'sm:col-span-2',
  options = [],
  defaultValue = null,
  option,
  errors,
}) {

  const customClass={
    control:(base,state) => ({
    ...base,
    border:'2px solid #d1d5db ',
    height:"44px",
    borderRadius:"30px",
    fontSize:'15px',
    borderRadius:"7px",
    outline:"none",
    width:"100%",
    marginTop:"8px",
    backgroundColor:state.isSelected && "white",
    boxShadow:state.isFocused?"blue":"gray"
    ,
    "&:hover":{
     borderColor:'#93c5fd'
    },
    focus:'#93c5fd',
  }),
  
}
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-[14px] font-medium 
        leading-5 text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="mt-1">
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={{
            required: isRequired ? `${label} is required` : false,
          }}
          render={({ field }) => (
            <Select
              {...field}
              options={options}
              placeholder={`Select ${option}`}
              styles={customClass}
              value={options.find((opt) => opt.value === field.value) || null}
              onChange={(selectedOption) =>
                field.onChange(selectedOption ? selectedOption.value : '')
              }
              isClearable
            />
          )}
        />
        {errors?.[name] && (
          <span className="text-sm text-red-600">{errors[name]?.message}</span>
        )}
      </div>
    </div>
  )
}


