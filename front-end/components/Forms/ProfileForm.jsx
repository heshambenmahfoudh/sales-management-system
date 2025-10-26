'use client'
import {  updateUserProfile } from "@/actions/users"
import { useStateContext } from "@/contexts/ContextProvider"
import { useState } from "react"
import { useForm } from "react-hook-form"
import SubmitButton from "../FormInput/SubmitButton"
import FormHeader from "../Headers/FormHeader"
import TextInput from "../FormInput/TextInput"
import SelectImageUrlInput from "../FormInput/SelectImageUrlInput"
import toast from "react-hot-toast"
import { makePostRequestImageUrl } from "@/lib/Api_Request"
import { useQueryClient } from "@tanstack/react-query"

export default function ProfileForm({session}) {
  const [imageUrl, setImageUrl] = useState(session &&session?.imageUrl)
  const [isLoadingImageUrl, setIsLoadingImageUrl] = useState()
  const { isLoading, setIsLoading } = useStateContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:session
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
  
  const query = useQueryClient()
  const defaultPassword ='***************'
  async function onSubmit(data) {
    try {
    setIsLoading(true)
    if (data.password === defaultPassword) {
      data.password ='***************'
    }
    data.imageUrl=imageUrl
    const updatedUser = await updateUserProfile(session?.id ,data)
      if (updatedUser?.status === 200) {
        setIsLoading(false)
          query.invalidateQueries({ queryKey: ['sessionUser'] })
        toast.success( 'User Profile Updated successfully')
      }else{
        setIsLoading(false)
        toast.error(updatedUser?.error)
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(updatedUser?.error)

    }
      
  }

  return (
    <div>
      <FormHeader titleValue="update user profile" isHidden={true} />
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
            register={register}
            name="email"
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextInput
            label="Password"
            type='password'
            register={register}
            name="password"
            errors={errors}
            className="w-full"
            defaultValue={defaultPassword}
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
            title="Update profile"
            isLoading={isLoading}
            loadingTitle="Updating profile ..."
          />
        </div>
      </form>
    </div>
  )
}