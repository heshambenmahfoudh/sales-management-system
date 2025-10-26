'use client'
import { createNewEmployeeWithdrawls } from '@/actions/employees'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SubmitButton from '../FormInput/SubmitButton'
import { fetchingData } from '@/actions/fetchingData'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'

export default function WithdrawalsForm({ isUpdate, initialData }) {
 
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialData,
      date: initialData?.date?.slice(0, 10),
      safe: initialData?.safe?._id,
      employee: initialData?.employee?._id,
    },
  })
const {data:user} =  useQuery({
     queryKey: ['sessionUser'],
     queryFn:getServerUser,
})
 const { data: employeesData } = useQuery({
      queryKey: ['employeesData'],
      queryFn: () => fetchingData(`employees`),
})
const employeeOptions =  employeesData?.map(({ _id, name }) => ({
   value: _id,
     label: name,
 }))
 const { data: safesData } = useQuery({
      queryKey: ['safesData'],
      queryFn: () => fetchingData(`safes`),
})
const safeOptions =  safesData?.map(({ _id, title }) => ({
   value: _id,
     label: title,
 }))
  useEffect(() => {
    if (!isUpdate) {
      setValue('responsible',user?.name)
    }
  }, [user])

  async function onSubmit(data) {
    try {
      
      setIsLoading(true)
      const response = await createNewEmployeeWithdrawls(data)
    if (response.status === 200) {
      router.push('/dashboard/employees/financial-withdrawals')
      setIsLoading(false)
      reset()
      toast.success('New Employee Withdrawls Created Successfully')
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
        linkUrl="/dashboard/employees/financial-withdrawals"
        titleValue={isUpdate ? 'withdrawals data' : 'new withdrawals'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
         bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <SelectInput
            label="Select The Employee"
            name="employee"
            control={control}
            className="w-full"
            options={employeeOptions}
            errors={errors}
            option="Employee"
          />
          <TextInput
            label="Withdrawls Mony"
            type="number"
            name="mony"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Withdrawls Date"
            type="date"
            name="date"
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
            name="responsible"
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextAreaInput
            label="Notes"
            register={register}
            name="notes"
            errors={errors}
          />
        </div>
        {!isUpdate ? (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <SubmitButton
              title="Create employee withdrawls"
              isLoading={isLoading}
              loadingTitle="Creating ..."
            />
            <ButtonClose hrefUrl="/dashboard/employees/financial-withdrawals" />
          </div>
        ) : (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <div></div>
            <ButtonClose hrefUrl="/dashboard/employees/financial-withdrawals" />
          </div>
        )}
      </form>
    </div>
  )
}

