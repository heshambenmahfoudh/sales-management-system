'use client'
import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import { createNewDepositeMony } from '@/actions/safes'
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
import toast from 'react-hot-toast'

export default function DepositemonyForm({ isUpdate, initialData }) {
  
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
      safe: initialData?.safe?._id,
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
    if (!isUpdate) {
      setValue("name",user?.name)
      setValue("typeDeposite",'manual deposite')
    }
  }, [user,initialData])

  async function onSubmit(data) {
    setIsLoading(true)
      try {
        const response = await createNewDepositeMony(data)
        if (response.status === 200) {
        router.push('/dashboard/safes/deposits')
        setIsLoading(false)
        reset()
        toast.success('New Deposite Mony Created Successfully')
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
        linkUrl="/dashboard/safes/deposits"
        titleValue={
          isUpdate? 'mony deposite data'
            : 'new mony deposite'
        }
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
        bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Deposite Name"
            register={register}
            name="name"
            errors={errors}
            className="w-full"
            readOnly={true}
            />
          <TextInput
            label="Deposite Mony"
            type="number"
            name="mony"
            register={register}
            errors={errors}
            className="w-full"
            readOnly={isUpdate}
            />
          <TextInput
            label="Deposite Type"
            name="typeDeposite"
            register={register}
            errors={errors}
            className="w-full"
            readOnly={true}
            />
          <TextInput
            label="Deposite Date"
            type="date"
            name="date"
            register={register}
            errors={errors}
            className="w-full"
            readOnly={isUpdate}
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
            readonly={isUpdate}
          />
        </div>
        {!isUpdate? (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <SubmitButton
              title='Create deposite mony'
              isLoading={isLoading}
              loadingTitle= 'Creating ...'
            />
            <ButtonClose hrefUrl="/dashboard/safes/deposits" />
          </div>
        ):<div className="mt-6 flex justify-between gap-4 items-center">
        <div></div>
        <ButtonClose hrefUrl="/dashboard/safes/deposits" />
      </div>}
      </form>
    </div>
  )
}

