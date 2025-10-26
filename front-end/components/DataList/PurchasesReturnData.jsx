'use client'
import DataTable from "../DataTable"
import TextInputSearch from "../FormInput/TextInputSearch"
import FixedHeader from "../Headers/FixedHeader"
import { useForm } from "react-hook-form"
import {  purchaseReturnColumn } from "@/app/(dummy)/data"
import { useMemo } from "react"
import { spliteObject } from "@/lib/spliteItem"

export default function PurchasesReturnData({data,permission}) {
  
  const {
    register,
    watch,
    formState: { errors },
  } = useForm()
   const search = watch('search')
   const fromDate = watch('fromDate')
   const toDate = watch('toDate')
   const newData = useMemo(()=>{
     return data?.length >0 && data?.filter((item) =>{
       const searchValue = search === "" || 
       Object.values(spliteObject(data))?.join()?.
       toLowerCase()?.
       includes(search?.toLowerCase())
       const existDate = new Date(item?.date) 
       const rangeDate = (!fromDate || new Date(fromDate) <= existDate) && 
       (!toDate ||  existDate <= new Date(toDate))
       return searchValue && rangeDate
     })
   },[data,search ,fromDate,toDate])
  return (
     <div>
      <FixedHeader
              linkUrl="/dashboard/purchases/return/new"
              textValue="Purchases Return"
              numberData={newData?.length | 0}
              isHidden={
                !permission?.purchasesReturnCreate
              }
            />
             <div className=' overflow-auto md:mt-6 mt-4  md:mx-5 mx-3 '>
                   {data?.length > 0 && (
                      <div className="grid gap-x-3 md:gap-y-4 gap-y-0.1 
                      md:grid-cols-4 grid-cols-1  ">
                          <TextInputSearch
                             register={register}
                             name='search'
                             className="w-full"
                             placeholder='Search Data'
                          />
                          <div className="flex items-center">
                               <TextInputSearch
                                 type='date'
                                  register={register}
                                  name='fromDate'
                                  className="w-full"
                                  placeholder='Enter from date'
                                  />
                              <TextInputSearch
                                  type='date'
                                  register={register}
                                  name='toDate'
                                  className="w-full"
                                  placeholder='Enter to date'
                              />
                          </div>
                      </div>
                   )}
                 </div>
         <DataTable
                   data={newData}
                   columns={purchaseReturnColumn}
                   onDeleted={permission?.purchasesReturnDelete}
                   onViewInvoice={
                     permission?.purchasesReturnViewInvoice
                   }
                   linkToCreate="/dashboard/purchases/return/new"
                   titleToCreate="returns purchases"
                   linkViewInvoice="/dashboard/purchases/return/invoice/"
                   endPoint="purchases/purchases-return"
                   resourceName="Purchase Return"
                 />
        </div>
  )
}
