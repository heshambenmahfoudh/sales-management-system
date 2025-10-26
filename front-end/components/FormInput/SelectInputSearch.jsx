'use client'
import React from 'react'
import { Controller } from 'react-hook-form'
import Select from 'react-select'


export default function SelectInputSearch({
  label,
  name,
  control,
  isRequired = true,
  className = 'sm:col-span-2 ',
  options = [],
  defaultValue = null,
  option,
}) {
  const customClass = {
    control: (base, state) => ({
      ...base,
      border: '2px solid #d1d5db ',
      height: '44px',
      fontSize: '15px',
      fontWieght: '600',
      borderRadius: '7px',
      outline: 'none',
      width: '100%',
      marginTop: '4px',
      backgroundColor: 'white',
      // backgroundColor:state.isSelected && "white",
      boxShadow: state.isFocused ? 'blue' : 'black',
      '&:hover': {
        borderColor: '#93c5fd',
      },
      focus: 'black',
    }),
  }
  return (
    <div className={className}>
      <div>
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
              className="text-[16px]  text-black!"
              value={options.find((opt) => opt.value === field.value) || null}
              onChange={(selectedOption) =>
                field.onChange(selectedOption ? selectedOption.value : '')
              }
              isClearable
            />
          )}
        />
      </div>
    </div>
  )
}
