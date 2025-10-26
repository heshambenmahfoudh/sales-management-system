'use client'
import React, { useState } from 'react'
import ButtonClose from '@/components/FormInput/CloseButton'
import SubmitButton from '@/components/FormInput/SubmitButton'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { createNewCustomer, updateCustomer } from '@/actions/customers'
import toast from 'react-hot-toast'

export default function CustomerForm({ isUpdate, initialData }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })
  async function onSubmit(data) {
    setIsLoading(true)
    if (isUpdate) {
      try {
        
        const response = await updateCustomer(isUpdate, data)
        if (response.status === 200) {
        router.push('/dashboard/customers')
        setIsLoading(false)
        reset()
        toast.success('Customer Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    } else {
      try {
        
        const response = await createNewCustomer(data)
        if (response.status === 200) {
        router.push('/dashboard/customers')
        setIsLoading(false)
        reset()
        toast.success('New Customer Created Successfully')
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
        linkUrl="/dashboard/customers"
        titleValue={isUpdate ? 'update customer' : 'new customer'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
           bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Customer Name"
            register={register}
            name="name"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Customer Phone"
            register={register}
            name="phone"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Customer Email Address"
            type="email"
            register={register}
            name="email"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Customer Address"
            register={register}
            name="address"
            errors={errors}
            className="w-full"
          />
          <TextAreaInput
            label="Notes"
            register={register}
            name="notes"
            errors={errors}
          />
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update customer' : 'Create customer'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating customer ...' : 'Creating customer ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/customers" />
        </div>
      </form>
    </div>
  )
}

