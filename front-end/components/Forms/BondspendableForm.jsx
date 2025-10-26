'use client'
import React, { useEffect, useState } from 'react'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createNewBondSpendable } from '@/actions/spendables'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { useQuery } from '@tanstack/react-query'

export default function BondspendableForm({ isUpdate, initialData }) {
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
    defaultValues: { ...initialData, date: initialData?.date?.slice(0, 10),
      safe: initialData?.safe?._id
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
        setValue("spendableResponsible",user?.name)
      }
    }, [user])

  async function onSubmit(data) {
    try {
      
      setIsLoading(true)
      const response = await createNewBondSpendable(data)
    if (response.status === 200) {
      router.push('/dashboard/spendables/bonds-spendables')
      setIsLoading(false)
      reset()
      toast.success('New Bond Spendable Created Successfully')
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
        linkUrl="/dashboard/spendables/bonds-spendables"
        titleValue={
          isUpdate ? 'Bond Spendable data' : 'new Bond Spendable'
        }
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
            bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Spendable Responsible Name"
            register={register}
            name="spendableResponsible"
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextInput
            label="Spendable To Name"
            register={register}
            name="spendableTo"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Spendable Mony"
            type="number"
            name="mony"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Spendable Date"
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
        {!isUpdate ? (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <SubmitButton
              title="Create bond spendable"
              isLoading={isLoading}
              loadingTitle="Creating ..."
            />
            <ButtonClose hrefUrl="/dashboard/spendables/bonds-spendables" />
          </div>
        ) : (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <div></div>
            <ButtonClose hrefUrl="/dashboard/spendables/bonds-spendables" />
          </div>
        )}
      </form>
    </div>
  )
}
