export default function TextInputSearch({
    label,
    register,
    name,
    type = 'text',
    className = 'sm:col-span-2',
    defaultValue,
    placeholder,
    disabled = false,
    readOnly = false,
    isRequired = true}) {
    return (
      <div className={className}>
        <label
          htmlFor={name}
          className="block w-fit ml-0.5 text-[14px]
           font-medium leading-5 text-gray-700  "
        >
          {label}
        </label>
          <div >
            <input
              {...register(`${name}`, { required: isRequired })}
              type={type}
              name={name}
              id={name}
              defaultValue={defaultValue}
              disabled={disabled}
              readOnly={readOnly}
              autoComplete={name}
              className="
          p-2 text-15 border-[2px]  border-gray-300 bg-white/80
            rounded-md focus:outline-none
            focus:border-blue-300 w-full
            mt-1 placeholder:text-gray-500"
              placeholder={label ? `${label?.toLowerCase()}` : placeholder}
            />
          </div>
      </div>
    )
  }
  