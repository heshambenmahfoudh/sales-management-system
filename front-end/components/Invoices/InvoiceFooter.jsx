'use client'

import { getServerUser } from "@/actions/auth"
import { useQuery } from "@tanstack/react-query"


export default function InvoiceFooter() {
  const { data: invoiceData } = useQuery({
      queryKey: ['invoiceData'],
      queryFn: () =>  fetchingData("settings/setting-invoice")
  })
    const {data:user} =  useQuery({
    queryKey: ['sessionUser'],
    queryFn:getServerUser,
  })
    
return (
   
     <div className=" flex justify-between items-start  mt-6 pt-4 border-t">
         <div>
            <h5 className="font-medium mb-2">Terms & Conditions</h5>
            <p className="text-[12px] w-[404px] font-normal capitalize">
              {invoiceData?.shopterms}
            </p>
         </div>
         <div className='flex  gap-1.5 items-center'>
              <h5 className="font-medium ">Printed By </h5>
              <span className="capitalize">{user?.name}</span>
         </div>
    </div>
  )
}
