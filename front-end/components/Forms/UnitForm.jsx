'use client'
import { createNewUnit, updateUnit } from '@/actions/units'
import ButtonClose from '@/components/FormInput/CloseButton'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SubmitButton from '../FormInput/SubmitButton'

export default function UnitForm({ isUpdate, initialData }) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })
  const router = useRouter()

  async function onSubmit(data) {
    setIsLoading(true)
    if (isUpdate) {
      try {
        
        const response = await updateUnit(isUpdate, data)
        if (response.status === 200) {
        reset()
        setIsLoading(false)
        toast.success('Unit Updated Successfully')
        router.push('/dashboard/inventory/units')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    } else {
      try {
        
        const response = await createNewUnit(data)
        if (response.status === 200) {
        reset()
        setIsLoading(false)
        toast.success('New Unit Created Successfully')
        router.push('/dashboard/inventory/units')
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
        linkUrl="/dashboard/inventory/units"
        titleValue={isUpdate ? 'update unit' : 'new unit'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
       bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Unit title"
            register={register}
            name="title"
            errors={errors}
            className="w-full"
          />
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update unit' : 'Create unit'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating unit ...' : 'Creating unit ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/inventory/units" />
        </div>
      </form>
    </div>
  )
}

