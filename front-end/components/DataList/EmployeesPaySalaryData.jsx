'use client'
import { paySalaryColumn } from "@/app/(dummy)/data"
import DataTable from "../DataTable"
import TextInputSearch from "../FormInput/TextInputSearch"
import FixedHeader from "../Headers/FixedHeader"
import { useForm } from "react-hook-form"
import { useMemo } from "react"
import { spliteObject } from "@/lib/spliteItem"

export default function EmployeesPaySalaryData({data,permission}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm()
   const search = watch('search')
   const newData = useMemo(()=>{
     return data?.length >0 && data?.filter((item) =>{
       const searchValue = search === "" || 
       Object.values(spliteObject(item))?.join()?.
       toLowerCase()?.
       includes(search?.toLowerCase())
       return searchValue 
     })
   },[data,search])
  return (
     <div>
        <FixedHeader
               linkUrl="/dashboard/employees/paying-salaries/new"
               textValue="Pay Salaries"
               numberData={newData?.length | 0}
               isHidden={!permission?.employeesPaySalaryDataCreate}
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
                    columns={paySalaryColumn}
                    onView={permission?.employeesPaySalaryDataView}
                    onDeleted={permission?.employeesPaySalaryDataDelete}
                    linkToView="/dashboard/employees/paying-salaries/view/"
                    linkToCreate="/dashboard/employees/paying-salaries/new"
                    titleToCreate="pay salaries"
                    endPoint="employees/pay-salaries"
                    resourceName="Pay Salary"
                  />
        </div>
  )
}
