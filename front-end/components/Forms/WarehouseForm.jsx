'use client'
import { createNewWarehouse, updateWarehouse } from '@/actions/warehouses'
import { wareHousesTypeOptions } from '@/app/(dummy)/data'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SubmitButton from '../FormInput/SubmitButton'

export default function WarehouseForm({ isUpdate, initialData }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    control,
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
        
        const response = await updateWarehouse(isUpdate, data)
        if (response.status === 200) {
        router.push('/dashboard/inventory/warehouses')
        setIsLoading(false)
        reset()
        toast.success('Warehouse Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    } else {
      try {
        
        const response = await createNewWarehouse(data)
        if (response.status === 200) {
        router.push('/dashboard/inventory/warehouses')
        setIsLoading(false)
        reset()
        toast.success('New Warehouse Ceated Successfully')
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
        linkUrl="/dashboard/inventory/warehouses"
        titleValue={isUpdate ? 'update warehouse' : 'new warehouse'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
   bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <SelectInput
            label="Select The wareHouse type"
            name="warehouseType"
            control={control}
            className="w-full"
            options={wareHousesTypeOptions}
            errors={errors}
            option="warehouseType"
          />
          <TextInput
            label="Warehouse Title"
            register={register}
            name="title"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Warehouse Location"
            register={register}
            name="location"
            errors={errors}
            className="w-full"
          />

          <TextAreaInput
            label="Description"
            name="description"
            register={register}
            errors={errors}
          />
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update warehouse' : 'Create warehouse'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating warehouse ...' : 'Creating warehouse ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/inventory/warehouses" />
        </div>
      </form>
    </div>
  )
}
