'use client'
import { useStateContext } from "@/contexts/ContextProvider"
import {  useState } from "react"
import FormHeader from "../Headers/FormHeader"
import TextInput from "../FormInput/TextInput"
import TextAreaInput from "../FormInput/TextAreaInput"
import SelectImageUrlInput from "../FormInput/SelectImageUrlInput"
import SubmitButton from "../FormInput/SubmitButton"
import {  updateSettingInvoice } from "@/actions/invoice"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { makePostRequestImageUrl } from "@/lib/Api_Request"
import {  useQueryClient } from "@tanstack/react-query"

export default function InvoiceForm({initialData}) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl)
  const [isLoadingImageUrl, setIsLoadingImageUrl] = useState(false)
  const { isLoading, setIsLoading } = useStateContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:initialData
  })
  

 async function handleUploadImageUrl(e) {
  try {
    const result = await makePostRequestImageUrl(e, setIsLoadingImageUrl)
    if (result?.status === 200) {
      setImageUrl(result?.data)
      toast.success('Upload imageUrl Successfully')
    } else {
      setImageUrl('')
      toast.error('Failed to Upload imageUrl')
    }
  } catch (error) {}
  }
const query = useQueryClient()
  async function onSubmit(data) {
    
    try {
        setIsLoading(true)
        data.imageUrl = imageUrl
        const updated = await updateSettingInvoice(initialData?._id, data)
        if (updated?.status === 200 ) {
        setIsLoading(false)
         query.invalidateQueries({ queryKey: ['invoiceData'] })
         toast.success('Update Setting invoice Successfully')
        } else {
        setIsLoading(false)
      toast.error(updated?.error)
      }
    } catch (error) {
      setIsLoading(false)
    }

  }

  return (
    <div>
      <FormHeader
        linkUrl="/dashboard/settings/setting-invoice"
        titleValue='update setting invoice'
        isHidden={true}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
   bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Shop Name"
            register={register}
            name="shopName"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Shop Address"
            register={register}
            name="shopAddress"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Shop Phone One"
            register={register}
            name="shopPhoneOne"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Shop Phone Two"
            register={register}
            name="shopPhoneTwo"
            errors={errors}
            className="w-full"
          />

          <TextAreaInput
            label="Shpo Terms"
            name="shopterms"
            register={register}
            errors={errors}
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
            title='Update invoice data'
            isLoading={isLoading}
            loadingTitle='Updating invoice ...'
          />
        </div>
      </form>
    </div>
  )
}
