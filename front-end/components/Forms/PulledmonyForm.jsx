'use client'
import SelectInput from '@/components/FormInput/SelectInput'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SubmitButton from '@/components/FormInput/SubmitButton'
import ButtonClose from '@/components/FormInput/CloseButton'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { fetchingData } from '@/actions/fetchingData'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'
import { createNewPulledMony } from '@/actions/safes'

export default function PulledmonyForm({ isUpdate, initialData }) {
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
    },
  })
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
 
  useEffect(() => {
    if (!isUpdate) {
        setValue('typePulled', 'manual pulled')
        setValue("name",user?.name)
      }
    }, [user])

  async function onSubmit(data) {
    setIsLoading(true)
 
      try {
        
        const response = await createNewPulledMony(data)
        if (response.status === 200) {
        router.push('/dashboard/safes/pulled')
        setIsLoading(false)
        reset()
        toast.success('New Pulled Mony Ceated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)}
  }

  return (
    <div>
      <FormHeader
        linkUrl="/dashboard/safes/pulled"
        titleValue={
          isUpdate? 'mony pulled data'
            : 'new mony pulled'
        }
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
      bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Pulled Name"
            register={register}
            name="name"
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextInput
            label="Pulled Mony"
            type="number"
            name="mony"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Pulled Type"
            name="typePulled"
            register={register}
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextInput
            label="Pulled Date"
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
            option="safe"
          />
          <TextAreaInput
            label="Notes"
            name="notes"
            register={register}
            errors={errors}
          />
        </div>
        {(initialData?.typePulled || 'manual pulled') === 'manual pulled' ? (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <SubmitButton
              title={isUpdate ? 'Update pulled mony' : 'Create pulled mony'}
              isLoading={isLoading}
              loadingTitle={
                isUpdate ? 'Updating ...' : 'Creating ...'
              }
            />
            <ButtonClose hrefUrl="/dashboard/safes/pulled" />
          </div>
        ) : (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <div></div>
            <ButtonClose hrefUrl="/dashboard/safes/pulled" />
          </div>
        )}
      </form>
    </div>
  )
}

