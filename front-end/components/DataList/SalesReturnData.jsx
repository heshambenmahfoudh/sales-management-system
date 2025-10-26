'use client'
import DataTable from "../DataTable"
import TextInputSearch from "../FormInput/TextInputSearch"
import FixedHeader from "../Headers/FixedHeader"
import { useForm } from "react-hook-form"
import {
         saleCashReturnColumn,
         saleDelayReturnColumn
       } from "@/app/(dummy)/data"
import { useMemo } from "react"
import { spliteObject } from "@/lib/spliteItem"
import CheckBoxInput from "../FormInput/CheckBoxInput"

export default function SalesReturnData({data,permission}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm()
   const search = watch('search')
   const fromDate = watch('fromDate')
   const toDate = watch('toDate')
     const customerCash = watch('isCash')
   const newData = useMemo(()=>{
     return data?.length >0 && data?.filter((item) =>{
       const searchValue = search === "" || 
       Object.values(spliteObject(item))?.join()?.
       toLowerCase()?.
       includes(search?.toLowerCase())
           const existCustomerCash =
          customerCash ? item?.cashCustomer : item?.customer
       const existDate = new Date(item?.date) 
       const rangeDate = (!fromDate || new Date(fromDate) <= existDate) && 
       (!toDate ||  existDate <= new Date(toDate))
       return searchValue && existCustomerCash &&rangeDate
     })
   },[data,search ,customerCash,fromDate,toDate])
  return (
     <div>
      <FixedHeader
             linkUrl="/dashboard/sales/return/new"
             textValue="Sales Return"
             numberData={newData?.length | 0}
             isHidden={!permission?.salesReturnCreate}
           />
            <div className=' overflow-auto md:mt-6 mt-4  md:mx-5 mx-3 '>
                  {data?.length > 0 && (
                     <div className="grid gap-x-3 md:gap-y-4 gap-y-0.1 
                            md:grid-cols-4 grid-cols-1">
                          <div className="flex items-center md:col-span-2 gap-x-2">
                             <TextInputSearch
                                register={register}
                                name='search'
                                className="w-full"
                                placeholder='Search Data'
                              />
                               <CheckBoxInput
                                  label="Customer Cash"
                                  name="isCash"
                                  register={register}
                                  className='min-w-[120px] flex flex-row-reverse items-center gap-2'
                                />
                         </div>
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
                columns={customerCash ? saleCashReturnColumn  : saleDelayReturnColumn }
                onDeleted={permission?.salesReturnDelete}
                onViewInvoice={permission?.salesReturnViewInvoice}
                linkToCreate="/dashboard/sales/return/new"
                titleToCreate="retruns sales"
                linkViewInvoice="/dashboard/sales/return/invoice/"
                endPoint="sales/sales-return"
                resourceName="Sale Return"
           />
        </div>
  )
}
