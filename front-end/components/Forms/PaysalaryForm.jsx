'use client'
import { getServerUser } from '@/actions/auth'
import { createNewPaySalaryEmployee } from '@/actions/employees'
import { fetchingData } from '@/actions/fetchingData'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function PaysalaryForm({ isUpdate, initialData }) {
  const [isLoading, setIsLoading] = useState(false)
 
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialData,
      givingDate: initialData?.givingDate?.slice(0, 10),
      employee: initialData?.employee?._id,
      safe: initialData?.safe?._id,
    },
  })
  const router = useRouter()

 const {data:user} =  useQuery({
     queryKey: ['sessionUser'],
     queryFn:getServerUser,
})
 const { data: safesData } = useQuery({
      queryKey: ['safesData'],
      queryFn: () => fetchingData(`safes`),
})
const safeOptions =  safesData?.map(({ _id, title }) => ({
   value: _id,
     label: title,
 }))
 const { data: employeesData } = useQuery({
  queryKey: ['employeesData'],
  queryFn: () => fetchingData(`employees`),
})

 const employeeOptions =  employeesData?.map(({ _id, name }) => ({
  value: _id,
  label: name,
}))

const employee = watch('employee')

   const { data: existWithdrawls } = useQuery({
      queryKey: ['existWithdrawls',employee],
      queryFn: () => fetchingData(`employees/withdrawals?employeeName=${employee}&&pay=false
        `,),
        enabled:!!employee
    })
   const { data: existEmployee } = useQuery({
      queryKey: ['existEmployee',employee],
      queryFn: () => fetchingData(`employees/find/${employee}`),
      enabled:!!employee
    })
  useEffect(() => {
    if( existEmployee) {
   setValue('netWithdrawals', existWithdrawls)
      setValue('netSalary', existEmployee?.salary - existWithdrawls)
      setValue('salary', existEmployee?.salary)
      setValue('netSalary', existEmployee?.salary - existWithdrawls)
      setValue('dueDate', existEmployee?.date?.slice(0, 10))
    }else{
     
      reset()
    }
  }, [existEmployee, setValue])
 
    useEffect(() => {
      if (!isUpdate) {
        setValue("responsibleName",user?.name)
      }
    }, [user])

  async function onSubmit(data) {
    try {
      
      setIsLoading(true)
      const response = await createNewPaySalaryEmployee(data)
    if (response.status === 200) {
      router.push('/dashboard/employees/paying-salaries')
      setIsLoading(false)
      reset()
      toast.success('New Pay Salary Created Successfully')
    } else {
      setIsLoading(false)
      toast.error(response.error)
    }
  } catch (error) {
    setIsLoading(false)
  }
  }

  return (
    <div>
      <FormHeader
        linkUrl="/dashboard/employees/paying-salaries"
        titleValue={isUpdate ? 'pay salary data' : 'new pay salary'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
           bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <SelectInput
            label="Select The Employee Name"
            name="employee"
            control={control}
            className="w-full"
            options={employeeOptions}
            errors={errors}
            option="Employee"
          />
          <TextInput
            label="Employee Salary"
            register={register}
            type="number"
            name="salary"
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextInput
            label="Net Withdrawals"
            type="number"
            name="netWithdrawals"
            register={register}
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextInput
            label="Net Salary"
            type="number"
            register={register}
            name="netSalary"
            errors={errors}
            className="w-full"
            readOnly={true}
          />

          <TextInput
            label="Due Date"
            type="date"
            name="dueDate"
            register={register}
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextInput
            label="Giving Date"
            type="date"
            name="givingDate"
            register={register}
            errors={errors}
            className="w-full"
          />
            <SelectInput
            label="Select The Safe"
            name="safe"
            control={control}
            className="w-full"
            options={safeOptions}
            errors={errors}
            option="Safe"
            />
          <TextInput
            label="Responsible Name"
            register={register}
            name="responsibleName"
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextAreaInput
            label="Notes"
            name="notes"
            register={register}
            errors={errors}
          />
        </div>
        {!isUpdate ? (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <SubmitButton
              title="Create pay salary"
              isLoading={isLoading}
              loadingTitle="Creating ..."
            />
            <ButtonClose hrefUrl="/dashboard/employees/paying-salaries" />
          </div>
        ) : (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <div></div>
            <ButtonClose hrefUrl="/dashboard/employees/paying-salaries" />
          </div>
        )}
      </form>
    </div>
  )
}

