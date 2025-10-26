'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SubmitButton from '@/components/FormInput/SubmitButton'
import ButtonClose from '@/components/FormInput/CloseButton'
import FormHeader from '@/components/Headers/FormHeader'
import TextInput from '@/components/FormInput/TextInput'
import { useForm } from 'react-hook-form'
import { createNewBrand, updateBrand } from '@/actions/brands'
import toast from 'react-hot-toast'

export default function BrandForm({ isUpdate, initialData }) {
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
      const response = await updateBrand(isUpdate, data)
      if (response.status === 200) {
        router.push('/dashboard/inventory/brands')
        setIsLoading(false)
        reset()
        toast.success('Brand Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    }catch(error){
      setIsLoading(false)
    }
    } else {
      try {
        
        const response = await createNewBrand(data)
        if (response.status === 200) {
        setIsLoading(false)
        reset()
        toast.success('New Brand Ceated Successfully')
        router.push('/dashboard/inventory/brands')
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
        linkUrl="/dashboard/inventory/brands"
        titleValue={isUpdate ? 'update brand' : 'new brand'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
       bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Brand Title"
            name="title"
            register={register}
            errors={errors}
            className='w-full'
          />

          
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update brand' : 'Create brand'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating brand ...' : 'Creating brand ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/inventory/brands" />
        </div>
      </form>
    </div>
  )
}

