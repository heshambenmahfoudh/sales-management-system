'use client'
import { fetchingData } from '@/actions/fetchingData'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default  function InvoiceHeader() {
  const { data } = useQuery({
    queryKey: ['invoiceData'],
    queryFn: () =>  fetchingData("settings/setting-invoice")
 })
  const [timeNow, setTimeNow] = useState('')
  
  const date= new Date()
  const dateNow = date.toLocaleDateString('en-GB')  
  const dayNow = date.toLocaleDateString('en-GB',{weekday:'long'}) 
    useEffect(() => {
      const intervalTimeNow=setTimeNow(date.toLocaleTimeString('en-GB') )
      const timeInterval = setInterval(intervalTimeNow,1000)
      return ()=> clearInterval(timeInterval)
    }, [])
    
  return (
     <div
      className="flex justify-between items-end h-[90px] border-b-[1px] print:border-b-[1px]
          border-gray-400 print:mb-8 print:pb-4 pb-4 m-auto "
    >
       
        <div className='flex flex-col justify-start   items-start'>
            <h2 className="font-medium text-[17px]  text-end capitalize">
              {data?.shopName}
            </h2>
            <h2 className=" text-[13px] text-end capitalize">
              {data?.shopAddress}
            </h2>
                <div className='capitalize text-[13px] text-center'>
              <span>{data?.shopPhoneOne }</span> {" - "} 
              <span>{data?.shopPhoneTwo }</span>
            </div>
        </div>
     
        <div className="w-[70px] h-[70px] relative bg-gray-200 rounded-full">
            <img
              src={data?.imageUrl}
              className=" object-contain w-full h-full  "
              alt="Image-Invoice"
            />
      </div>
      <div className="flex justify-start leading-4  flex-col items-start  gap-1">
        <p className="text-[13px] font-medium uppercase text-start">
          <span className="capitalize">Date</span> : {dateNow}
        </p>
        <p className="text-[13px] font-medium uppercase text-start">
          <span className="capitalize">Time</span> : {timeNow}
        </p>
        <p className="text-[13px] font-medium capitalize">
          <span className="capitalize">Day</span> : {dayNow}
        </p>
      </div>
    </div>
  )
}
