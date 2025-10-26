'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import FormHeader from '@/components/Headers/FormHeader'
import TextInput from '@/components/FormInput/TextInput'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import ButtonClose from '@/components/FormInput/CloseButton'
import { createNewEmployee, updateEmployee } from '@/actions/employees'
import toast from 'react-hot-toast'
import SelectImageUrlInput from '../FormInput/SelectImageUrlInput'

export default function EmployeeForm({ isUpdate, initialData }) {
   const [imageUrl, setImageUrl] = useState(initialData?.imageUrl)
   const [isLoading, setIsLoading] = useState(false)
   const [isLoadingImageUrl, setIsLoadingImageUrl] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {...initialData,
      date:initialData?.date?.slice(0,10)
    },
  })

   async function handleUploadImageUrl(e) {
      const result = await makePostRequestImageUrl(e, setIsLoadingImageUrl)
      if (result?.status === 200) {
        setImageUrl(result?.data)
        toast.success('Upload imageUrl Successfully')
      } else {
        setImageUrl('')
        toast.error('Failed to Upload imageUrl')
      }
    }
  async function onSubmit(data) {
    setIsLoading(true)
    data.imageUrl = imageUrl
    if (isUpdate) {
      try {
        const response = await updateEmployee(isUpdate, data)
        if (response.status === 200) {
        router.push('/dashboard/employees')
        setImageUrl("")
        setIsLoading(false)
        reset()
        toast.success('Employee Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
  } else {
    try {
      const response = await createNewEmployee(data)
      if (response.status === 200) {
        router.push('/dashboard/employees')
        setImageUrl("")
        setIsLoading(false)
        reset()
        toast.success('New Employee Created Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    }
  }

  return (
    <div>
      <FormHeader
        linkUrl="/dashboard/employees"
        titleValue={isUpdate ? 'update employee' : 'new employee'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
             bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Employee Name"
            register={register}
            name="name"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Employee Phone"
            register={register}
            name="phone"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Employee Address"
            register={register}
            name="address"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Employee Id Number"
            register={register}
            name="idNumber"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Employee Salary"
            register={register}
            type="number"
            name="salary"
            errors={errors}
            className="w-full"
          />
          <TextInput
          label="Employee Received Salary Date"
            type="date"
            register={register}
            name="date"
            errors={errors}
            className="w-full"
          />

          <TextAreaInput
            label="Notes"
            name="notes"
            register={register}
            errors={errors}
          />
           <SelectImageUrlInput
                      register={register}
                      errors={errors}
                      chaneValue={handleUploadImageUrl}
                      imageUrl={imageUrl}
                      setImageUrl={setImageUrl}
                      isLoadingImageUrl={isLoadingImageUrl}
                    />
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update employee' : 'Create employee'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating employee ...' : 'Creating employee ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/employees" />
        </div>
      </form>
    </div>
  )
}
