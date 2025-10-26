
export default function InformationHeader ({data,fixedSize}) {
  return (
   <div className={`  p-1.5  rounded-t-lg  
      flex ${fixedSize}   
     justify-between items-center gap-1 sticky top-0  text-center
      text-gray-900  border-1 border-gray-400 bg-blue-50 `}>
     { data?.map(({ text, size }) => (
         <h2 key={ text } className={` text-center font-medium uppercase
           text-[13.5px]   ${size}`}>
            {text}
          </h2>
     ))}
   </div>
  )
}

