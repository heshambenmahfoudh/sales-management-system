'use client'
import DataTable from "../DataTable"
import TextInputSearch from "../FormInput/TextInputSearch"
import FixedHeader from "../Headers/FixedHeader"
import { useForm } from "react-hook-form"
import { bulledMonyColumn } from "@/app/(dummy)/data"
import { useMemo } from "react"
import { spliteObject } from "@/lib/spliteItem"

export default function PulledsMonyData({data,permission}) {
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
     Object.values(spliteObject(item))?.join()?.
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
        linkUrl="/dashboard/safes/pulled/new"
        textValue="Mony Pulled"
        numberData={newData?.length | 0}
        isHidden={!permission?.safesPulledCreate}
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
              columns={bulledMonyColumn}
              onView={permission?.safesPulledView}
              onDeleted={permission?.safesPulledDelete}
              linkToView="/dashboard/safes/pulled/view/"
              linkToCreate="/dashboard/safes/pulled/new"
              titleToCreate="mony pulled"
              endPoint="mony-pulleds"
              resourceName="Mony pulled"
            />
          </div>
  )
}
