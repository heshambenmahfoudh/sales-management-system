'use client'
import { createNewSupplier, updateSupplier } from '@/actions/suppliers'
import ButtonClose from '@/components/FormInput/CloseButton'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SubmitButton from '../FormInput/SubmitButton'

export default function SupplierForm({ isUpdate, initialData }) {
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
        
        const response = await updateSupplier(isUpdate, data)
        if (response.status === 200) {
        router.push('/dashboard/suppliers')
        setIsLoading(false)
        reset()
        toast.success('Supplier Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    } else {
      try {
        
        const response = await createNewSupplier(data)
        if (response.status === 200) {
        router.push('/dashboard/suppliers')
        setIsLoading(false)
        reset()
        toast.success('New Supplier Created Successfully')
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
        linkUrl="/dashboard/suppliers"
        titleValue={isUpdate ? 'update supplier' : 'new supplier'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
         bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Supplier Name"
            register={register}
            name="name"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Supplier Phone"
            register={register}
            name="phone"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Supplier Email Address"
            type="email"
            name="email"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Supplier Address"
            register={register}
            name="address"
            errors={errors}
            className="w-full"
          />
          <TextAreaInput
            label="Supplier Notes"
            name="notes"
            register={register}
            errors={errors}
          />
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update supplier' : 'Create supplier'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating supplier ...' : 'Creating supplier ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/suppliers" />
        </div>
      </form>
    </div>
  )
}
