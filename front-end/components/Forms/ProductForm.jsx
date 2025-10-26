'use client'
import { createNewProduct, updateProduct } from '@/actions/products'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectImageUrlInput from '@/components/FormInput/SelectImageUrlInput'
import SelectInput from '@/components/FormInput/SelectInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useRouter } from 'next/navigation'
import React, {useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { fetchingData } from '@/actions/fetchingData'
import { useQuery } from '@tanstack/react-query'
import { makePostRequestImageUrl } from '@/lib/Api_Request'

export default function ProductForm({ isUpdate, initialData }) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl)
  const [isLoadingImageUrl, setIsLoadingImageUrl] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {...initialData,
      category:initialData?.category?._id,
      unit:initialData?.unit?._id,
      brand:initialData?.brand?._id,
    },
  })

  
  const { data: brandsData } = useQuery({
      queryKey: ['brandsData'],
      queryFn: () => fetchingData(`brands`),
})
const brandOptions =  brandsData?.map(({ _id, title }) => ({
   value: _id,
     label: title,
 }))
 const { data: unitsData } = useQuery({
      queryKey: ['unitsData'],
      queryFn: () => fetchingData(`units`),
    })
    const unitOptions =  unitsData?.map(({ _id, title }) => ({
      value: _id,
      label: title,
    }))
  let brandId =""
 if (isUpdate) {
  brandId =initialData?.brand?._id
 }else{
  brandId= watch('brand')
 }
  const { data: existCategoryData } = useQuery({
      queryKey: ['existCategoryData',brandId],
      queryFn: () => fetchingData(`categories?brand=${brandId}`,),
      enabled:!!brandId
    })
    const categoryOptions =  existCategoryData?.map(({ _id, title }) => ({
      value: _id,
      label: title,
    }))
 

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

  async function onSubmit(data) {
    data.imageUrl = imageUrl
    setIsLoading(true)
    if (isUpdate) {
      try {
        
        const response = await updateProduct(isUpdate, data)
        if (response.status === 200) {
        router.push('/dashboard/inventory/products')
        setIsLoading(false)
        reset()
        setImageUrl()
        toast.success('Product Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(response.error)
      
    }
    } else {
      try {
        
        const response = await createNewProduct(data)
        if (response.status === 200) {
        router.push('/dashboard/inventory/products')
        setIsLoading(false)
        reset()
        setImageUrl()
        toast.success('New Product Ceated Successfully')
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
        linkUrl="/dashboard/inventory/products"
        titleValue={isUpdate ? 'update product' : 'new product'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
     bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Product Title"
            register={register}
            name="title"
            errors={errors}
            className="w-full"
          />
          <SelectInput
            label="Select The Brand"
            name="brand"
            control={control}
            className="w-full"
            options={brandOptions}
            errors={errors}
            option="Brand"
          />
          <SelectInput
            label="Select The Category"
            name="category"
            control={control}
            className="w-full"
            options={categoryOptions}
            errors={errors}
            option="Category"
          />
          <SelectInput
            label="Select The Unit"
            name="unit"
            control={control}
            className="w-full"
            options={unitOptions}
            errors={errors}
            option="Unit"
          />
          <TextInput
            label="Product Buy Price"
            type="number"
            register={register}
            name="buyPrice"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Product Sale Price"
            type="number"
            register={register}
            name="salePrice"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Product SKU"
            register={register}
            name="sku"
            errors={errors}
            className="w-full"
          />
          <TextAreaInput
            label="Product Description"
            name="description"
            register={register}
            errors={errors}
          />
          <TextAreaInput
            label="Notes"
            name="notes"
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
            title={isUpdate ? 'Update product' : 'Create product'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating product ...' : 'Creating product ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/inventory/products" />
        </div>
      </form>
    </div>
  )
}
