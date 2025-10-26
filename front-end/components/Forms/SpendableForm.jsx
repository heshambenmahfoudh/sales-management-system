'use client'
import { createNewSpendable } from '@/actions/spendables'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { fetchingData } from '@/actions/fetchingData'
import SubmitButton from '../FormInput/SubmitButton'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'

export default function SpendableForm({ isUpdate, initialData }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialData,
      typespendable: initialData?.typespendable?._id,
      safe: initialData?.safe?._id,
    },
  })


const {data:user} =  useQuery({
     queryKey: ['sessionUser'],
     queryFn:getServerUser,
})
 const { data: typeSpendablesData } = useQuery({
      queryKey: ['typeSpendablesData'],
      queryFn: () => fetchingData(`type-spendables`),
})
const typeSpendableOptions =  typeSpendablesData?.map(({ _id, title }) => ({
   value: _id,
     label: title,
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
    setValue("name",user?.name)
  }
  }, [user])

  async function onSubmit(data) {
    setIsLoading(true)
  
      try {
        
        const response = await createNewSpendable(data)
        if (response.status === 200) {
        router.push('/dashboard/spendables')
        setIsLoading(false)
        reset()
        toast.success('New Spendable Created Successfully')
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
        linkUrl="/dashboard/spendables"
        titleValue={isUpdate ? 'update spendable' : 'new spendable'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
     bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <SelectInput
            label="Select The Type Spendable"
            name="typespendable"
            control={control}
            className="w-full"
            options={typeSpendableOptions}
            errors={errors}
            option="Type Spendable"
          />
          <TextInput
            label="Spendable Mony"
            register={register}
            type="number"
            name="mony"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Spendable Date"
            register={register}
            type="date"
            name="date"
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
            label="Spendable Responsible name"
            register={register}
            name="name"
            errors={errors}
            className="w-full"
          />
          <TextAreaInput
            label="Notes"
            name="notes"
            register={register}
            errors={errors}
          />
        </div>
          <div className="mt-6 flex justify-between gap-4 items-center">
            <SubmitButton
              title={isUpdate ? 'Update spendable' : 'Create spendable'}
              isLoading={isLoading}
              loadingTitle={
                isUpdate ? 'Updating spendable ...' : 'Creating spendable ...'
              }
            />
            <ButtonClose hrefUrl="/dashboard/spendables" />
          </div>
      </form>
    </div>
     )
}
