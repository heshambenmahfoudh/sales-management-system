'use client'
import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import { createNewBondRecivable } from '@/actions/spendables'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function BondrecivableForm({ isUpdate, initialData }) {
 
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
    defaultValues: { ...initialData, date: initialData?.date?.slice(0, 10) ,

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
      setValue("receivableResponsible",user?.name)
    }
  }, [user])

  async function onSubmit(data) {
    try {
      
      setIsLoading(true)
      const response = await createNewBondRecivable(data)
    if (response.status === 200) {
      router.push('/dashboard/spendables/bonds-receivables')
      setIsLoading(false)
      reset()
      toast.success('New Bond Recivable Created Successfully')
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
        linkUrl="/dashboard/spendables/bonds-receivables"
        titleValue={
          isUpdate ? 'Bond Receivable data' : 'new Bond Receivable'
        }
        
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
          bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Recivable From Name"
            register={register}
            name="rceivableFrom"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Recivable Responsible Name"
            register={register}
            name="receivableResponsible"
            errors={errors}
            className="w-full"
            readOnly={true}
            
          />
          <TextInput
            label="Recivable Mony"
            type="number"
            name="mony"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Recivable Date"
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
              title="Create bond recivable"
              isLoading={isLoading}
              loadingTitle="Creating ..."
            />
            <ButtonClose hrefUrl="/dashboard/spendables/bonds-receivables" />
          </div>
        ) : (
          <div className="mt-6 flex justify-between gap-4 items-center">
            <div></div>
            <ButtonClose hrefUrl="/dashboard/spendables/bonds-receivables" />
          </div>
        )}
      </form>
    </div>
  )
}

