'use client'
import React, {  useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createNewUser, updateUser } from '@/actions/users'
import toast from 'react-hot-toast'
import FormHeader from '@/components/Headers/FormHeader'
import TextInput from '@/components/FormInput/TextInput'
import SelectImageUrlInput from '@/components/FormInput/SelectImageUrlInput'
import SelectInput from '@/components/FormInput/SelectInput'
import { roleOptions } from '@/app/(dummy)/data'
import SubmitButton from '../FormInput/SubmitButton'
import { makePostRequestImageUrl } from '@/lib/Api_Request'

export default function UserForm({ isUpdate, initialData }) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingImageUrl, setIsLoadingImageUrl] = useState(false)

  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })

 async function handleUploadImageUrl(e) {
    const result = await makePostRequestImageUrl(e, setIsLoadingImageUrl)
    if (result?.status === 200) {
      setImageUrl(result?.data)
      toast.success('Upload imageUrl Successfully')
    } else {
      setImageUrl('')
      toast.error('Failed to Upload imageUrl')
    }
  }

 const defaultPassword ='***************'
async function onSubmit(data) {

  setIsLoading(true)
  if (data.password === defaultPassword) {
      data.password ='***************'
    }
    data.imageUrl = imageUrl
    setIsLoading(true)
    if (isUpdate) {
      try {
        
        const response = await updateUser(isUpdate, data)
        if (response.status === 200) {
        setIsLoading(false)
        reset()
        setImageUrl()
        toast.success('User Updated User Successfully')
        router.push('/dashboard/users')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    } else {
      try {
        
        const response = await createNewUser(data)
        if (response.status === 200) {
        setIsLoading(false)
        reset()
        setImageUrl()
        toast.success('New User Ceated Successfully')
        router.push('/dashboard/users')
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
        linkUrl="/dashboard/users"
        titleValue={isUpdate ? 'update user' : 'new user'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
         bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Full Name"
            register={register}
            name="name"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Email Address"
            type="email"
            register={register}
            name="email"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Password"
            type="password"
            register={register}
            name="password"
            errors={errors}
            className="w-full"
            defaultValue={isUpdate &&defaultPassword}
          />
          <SelectInput
            label="Select The Role"
            name="role"
            control={control}
            className="w-full"
            options={roleOptions}
            errors={errors}
            option="Role"
          />
          <SelectImageUrlInput
            register={register}
            errors={errors}
            chaneValue={handleUploadImageUrl}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            isLoadingImageUrl={isLoadingImageUrl}
          />
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update user' : 'Create user'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating user ...' : 'Creating user ...'
            }
          />
        </div>
      </form>
    </div>
  )
}
