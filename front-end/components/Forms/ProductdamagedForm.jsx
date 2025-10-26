'use client'
import React, { useEffect, useState } from 'react'
import ButtonClose from '@/components/FormInput/CloseButton'
import SubmitButton from '@/components/FormInput/SubmitButton'
import FormHeader from '@/components/Headers/FormHeader'
import TextInput from '@/components/FormInput/TextInput'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createNewProductDamaged } from '@/actions/productdamaged'
import { fetchingData } from '@/actions/fetchingData'
import { useForm } from 'react-hook-form'
import SelectInput from '../FormInput/SelectInput'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'

export default function ProductdamagedForm({ initialData, isUpdate }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
     control,
     handleSubmit,
     setValue,
     watch,
     reset,
     formState: { errors },
   } = useForm({
     defaultValues: {...initialData,
     product:initialData?.product?._id,
     unit:initialData?.unit?._id,
     date:initialData?.date?.slice(0,10),
     fromWarehouse:initialData?.fromWarehouse?._id,
    },
  })
  
  
const {data:user} =  useQuery({
     queryKey: ['sessionUser'],
     queryFn:getServerUser,
})



 const { data: unitsData } = useQuery({
      queryKey: ['unitsData'],
      queryFn: () => fetchingData(`units`),
})

const unitOptions =  unitsData?.map(({ _id, title }) => ({
   value: _id,
     label: title,
 }))

 const { data: warehousesData } = useQuery({
   queryKey: ['warehousesData'],
   queryFn: () => fetchingData(`warehouses`),
})

const warehouseOptions =  warehousesData?.map(({ _id, title }) => ({
    value: _id,
    label: title,
}))

const sku =    watch('sku')
 
const { data: productsSkuData } = useQuery({
      queryKey: ['productsSkuData'],
      queryFn: () => fetchingData(`products?sku=true`),
})
const skuOptions =  productsSkuData?.map(({sku }) => ({
   value: sku,
     label: sku,
}))

  
const { data: existProductData } = useQuery({
   queryKey: ['existProductBySkuData',sku],
   queryFn: () =>  fetchingData(`products?sku=${sku ||''}`),
 })
const productOptions =  existProductData?.map(({ _id, title }) => ({
    value: _id,
    label: title,
}))

useEffect(() => {
  if (!isUpdate) {
    setValue("responsibleName",user?.name)
  }
}, [user])



   
async function onSubmit(data) {
    try {
      
      setIsLoading(true)
      const response = await createNewProductDamaged(data)
    if (response.status === 200) {
      router.push('/dashboard/inventory/products-damaged')
      setIsLoading(false)
      reset()
      toast.success('New Product Damaged Created Successfully')
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
        linkUrl="/dashboard/inventory/products-damaged"
        titleValue={isUpdate ? 'Product Damaged Data' : 'new Product Damaged'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
     bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 
        md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1 mt-3">
         
        
          <SelectInput
            label="Search Product by SKU"
            name="sku"
            control={control}
            className="w-full"
            options={skuOptions}
            errors={errors}
            option="Product Sku"
            isRequired={false}
          />
        
          <SelectInput
            label="Select The Product"
            name="product"
            control={control}
            className="w-full"
            options={productOptions}
            errors={errors}
            option="Product"
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
          <SelectInput
            label="Product Damaged From Warehouse"
            name="fromWarehouse"
            control={control}
            className="w-full"
            options={warehouseOptions}
            errors={errors}
            option="Warehouse"
          />
          <TextInput
            label="Product Damaged Qty"
            type="number"
            name="qty"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Product Damaged Date"
            type="date"
            name="date"
            register={register}
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="Responsibe Name"
            register={register}
            name="responsibleName"
            errors={errors}
            className="w-full"
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
              title="Create product damaged"
              isLoading={isLoading}
              loadingTitle="Creating ..."
            />
            <ButtonClose hrefUrl="/dashboard/inventory/products-damaged" />
          </div>
        ):<div className="mt-6 flex justify-between gap-4 items-center">
            <div></div>
            <ButtonClose hrefUrl="/dashboard/inventory/products-damaged" />
          </div>}
      </form>
    </div>
  )}