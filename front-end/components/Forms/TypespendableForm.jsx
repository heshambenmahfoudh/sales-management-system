'use client'
import {
  createNewTypeSpendable,
  updateTypeSpendable,
} from '@/actions/spendables'
import ButtonClose from '@/components/FormInput/CloseButton'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SubmitButton from '../FormInput/SubmitButton'

export default function TypespendableForm({ isUpdate, initialData }) {
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
        
        const response = await updateTypeSpendable(isUpdate, data)
        if (response.status === 200) {
          router.push('/dashboard/spendables/type-spendables')
        setIsLoading(false)
        reset()
        toast.success('Type Spendable Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    } else {
      try {
        const response = await createNewTypeSpendable(data)
        if (response.status === 200) {
        router.push('/dashboard/spendables/type-spendables')
        setIsLoading(false)
        reset()
        toast.success('New Type Spendable Ceated Successfully')
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
        linkUrl="/dashboard/spendables/type-spendables"
        titleValue={isUpdate ? 'update type spendables' : 'new type spendables'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
   bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Type Spendable Tile"
            register={register}
            name="title"
            errors={errors}
            className="w-full"
          />
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update type spendable' : 'Create type spendable'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating ...' : 'Creating ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/spendables/type-spendables" />
        </div>
      </form>
    </div>
  )
}
