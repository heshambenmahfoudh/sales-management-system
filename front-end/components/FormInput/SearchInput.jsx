export default function SearchInput ({placeholder,value,name}) {
  return (
     <input 
         type='text'
         name={name}
         placeholder={placeholder}
         value={value}
       className="p-0.5 border-[1px]  border-none bg-gray-100
              rounded-md focus:outline-none
              focus:border-blue-300  placeholder:text-gray-400 placeholder:font-medium 
               w-full
         text-[14px] text-black   "
        />
  )
}
