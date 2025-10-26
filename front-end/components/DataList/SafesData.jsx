'use client'
import DataTable from "../DataTable"
import TextInputSearch from "../FormInput/TextInputSearch"
import FixedHeader from "../Headers/FixedHeader"
import { useForm } from "react-hook-form"
import {  safeColumn } from "@/app/(dummy)/data"
import { useMemo } from "react"

export default function SafesData({data,permission}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm()
 
  const search = watch('search')
  const newData = useMemo(()=>{
    return data?.length >0 && data?.filter((item) =>{
      const searchValue = search === "" || 
      Object.values(item)?.join()?.
      toLowerCase()?.
      includes(search?.toLowerCase())
      return searchValue 
    })
  },[data,search])
  return (
     <div>
    <FixedHeader
        linkUrl="/dashboard/safes/new"
        textValue="Safes"
        numberData={newData?.length | 0}
        isHidden={!permission?.safesDataCreate}
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
                      </div>
                   )}
                 </div>
            <DataTable
                     data={newData}
                     columns={safeColumn}
                     onUpdated={permission?.safesDataUpdate}
                     onDeleted={permission?.safesDataDelete}
                     linkToUpdate="/dashboard/safes/update/"
                     linkToCreate="/dashboard/safes/new"
                     titleToCreate="safes"
                     endPoint="safes"
                     resourceName="Safe"
                   />
        </div>
  )
}
