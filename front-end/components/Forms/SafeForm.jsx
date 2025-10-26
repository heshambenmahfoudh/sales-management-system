'use client'
import { createNewSafe, updateSafe } from '@/actions/safes'
import ButtonClose from '@/components/FormInput/CloseButton'
import SubmitButton from '@/components/FormInput/SubmitButton'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function SafeForm({ isUpdate, initialData }) {
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
        
        const response = await updateSafe(isUpdate, data)
        if (response.status === 200) {
          router.push('/dashboard/safes')
        setIsLoading(false)
        reset()
        toast.success('Safe Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    } else {
      try {
        
        const response = await createNewSafe(data)
        if (response.status === 200) {
        router.push('/dashboard/safes')
        setIsLoading(false)
        reset()
        toast.success('New Safe Created Successfully')
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
        linkUrl="/dashboard/safes"
        titleValue={isUpdate ? 'update safe' : 'new safe'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
        bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Safe Tile"
            register={register}
            name="title"
            errors={errors}
            className="w-full"
          />
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update safe' : 'Create safe'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating safe ...' : 'Creating safe ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/safes" />
        </div>
      </form>
    </div>
  )
}
