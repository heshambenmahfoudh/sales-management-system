'use client'
import { fetchingData } from '@/actions/fetchingData'
import { createNewTransferMony } from '@/actions/safes'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SubmitButton from '../FormInput/SubmitButton'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'

export default function TransfermonyForm({ isUpdate, initialData }) {
 
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialData,
      from_safe: initialData?.from_safe?._id,
      to_safe: initialData?.to_safe?._id,
      date: initialData?.date?.slice(0, 10),
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
    setValue('name', user?.name)
  }, [user])

  async function onSubmit(data) {
    try {
      
      setIsLoading(true)
      const response = await createNewTransferMony(data)
    if (response.status === 200) {
      router.push('/dashboard/safes/transfers')
      setIsLoading(false)
      reset()
      toast.success('New Transfer Mony Created Successfully')
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
        linkUrl="/dashboard/safes/transfers"
        titleValue={
          isUpdate ? 'transfer mony data' : 'new transfer mony'
        }
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
      bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <SelectInput
            label="Tranfer From Safe"
            name="from_safe"
            control={control}
            className="w-full"
            options={safeOptions}
            errors={errors}
            option="the safe"
          />
          <SelectInput
            label="Tranfer To Safe"
            name="to_safe"
            control={control}
            className="w-full"
            options={safeOptions}
            errors={errors}
            option="the safe"
          />
          <TextInput
            label="Tranfer Mony"
            type="number"
            name="mony"
            register={register}
            errors={errors}
            className="w-full"
            readOnly={isUpdate}
            />
          <TextInput
            label="Transfer Date"
            type="date"
            name="date"
            register={register}
            errors={errors}
            className="w-full"
            readOnly={isUpdate}
            />
          <TextInput
            label="Responsible Name"
            register={register}
            name="name"
            errors={errors}
            className="w-full"
            readOnly={true}
            />
          <TextAreaInput
            label="Notes"
            name="notes"
            register={register}
            errors={errors}
            readOnly={isUpdate}
          />
        </div>
        {!isUpdate ? (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <SubmitButton
              title="Create transfer mony"
              isLoading={isLoading}
              loadingTitle="Creating ..."
            />
            <ButtonClose hrefUrl="/dashboard/safes/transfers" />
          </div>
        ) : (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <div></div>
            <ButtonClose hrefUrl="/dashboard/safes/transfers" />
          </div>
        )}
      </form>
    </div>
  )
}

