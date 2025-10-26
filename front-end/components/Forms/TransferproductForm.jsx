'use client'
import React, { useEffect, useState } from 'react'
import {  useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { fetchingData } from '@/actions/fetchingData'
import { createNewTransferProduct } from '@/actions/productTransfers'
import ButtonClose from '../FormInput/CloseButton'
import SelectInput from '../FormInput/SelectInput'
import TextAreaInput from '../FormInput/TextAreaInput'
import FormHeader from '../Headers/FormHeader'
import TextInput from '../FormInput/TextInput'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'
import SubmitButton from '../FormInput/SubmitButton'

export default function TransferproductForm({ isUpdate, initialData  }) {
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
     date:initialData?.date?.slice(0,10),
   unit:initialData?.unit?._id,
   fromWarehouse:initialData?.fromWarehouse?._id,
   toWarehouse:initialData?.toWarehouse?._id,
  },
})

const {data:user} =  useQuery({
     queryKey: ['sessionUser'],
     queryFn:getServerUser,
})

let sku = watch('sku')
const { data: warehousesData } = useQuery({
      queryKey: ['warehousesData'],
      queryFn: () => fetchingData(`warehouses`),
})
const warehouseOptions =  warehousesData?.map(({ _id, title }) => ({
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
 
const warehouse = watch('fromWarehouse')
const product = watch('product')

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
  
const { data: existProductQtyData } = useQuery({
    queryKey: ['existProductQtyData',product,warehouse],
    queryFn: () => fetchingData(
    `products/products-quantities?product=${product}&&warehouse=${warehouse}`,
  ),
  enabled:!!warehouse
})

useEffect(() => {
  if (!isUpdate) {
     setValue('responsibleName',user?.name)
  }
}, [user])

useEffect(() => {
  if (existProductQtyData?.[0]) {
     setValue('buyPrice',existProductQtyData?.[0]?.buyPrice)
     setValue('salePrice',existProductQtyData?.[0]?.salePrice)
    }else{
      setValue('buyPrice',0)
      setValue('salePrice',0)
  }
}, [existProductQtyData])


async function onSubmit(data) {
  try {
    setIsLoading(true)
    const response = await createNewTransferProduct(data)
  if (response.status === 200) {
      router.push('/dashboard/inventory/products-transfers')
      setIsLoading(false)
      reset()
      toast.success('New Transfer Product Created Successfully')
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
      linkUrl="/dashboard/inventory/products-transfers"
      titleValue={isUpdate ? 'transfer product data' : 'new transfer product'}
    />
    <form
      className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
   bg-white shadow-md max-w-4xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:gap-y-4 
      gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">

          
        <SelectInput
                             label="Select The Product SKU"
                             name="sku"
                             control={control}
                             className="w-full"
                             options={skuOptions}
                             errors={errors}
                                   isRequired={false}
                             option="Product Sku"
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
          label="Select From Warehouse"
          name="fromWarehouse"
          control={control}
          className="w-full"
          options={warehouseOptions}
          errors={errors}
          option="Warehouse"
          />
         <TextInput
           label="Product Buy Price"
          type='number'
          register={register}
          name="buyPrice"
          errors={errors}
          className="w-full"
          />
         <TextInput
           label="Product Sale Price"
          type='number'
          register={register}
          name="salePrice"
          errors={errors}
          className="w-full"
          />
         <TextInput
           label="Product Qty"
          type='number'
          register={register}
          name="qty"
          errors={errors}
          className="w-full"
          />
          <SelectInput
          label="Select To Warehouse"
          name="toWarehouse"
          control={control}
          className="w-full"
          options={warehouseOptions}
          errors={errors}
          option="Warehouse"
          />
        
        <TextInput
          label="Transfer Date"
          type='date'
          register={register}
          name="date"
          errors={errors}
          className="w-full"
          />
            <TextInput
            label="Responsible Name"
            register={register}
            name="responsibleName"
            errors={errors}
            className="w-full"
            readOnly={true}
            />
        <TextAreaInput
          label="Notes"
          name="notes"
          register={register}
          errors={errors}
        />
      </div>
      {!isUpdate ?(
        <div className="flex justify-between items-center gap-4 mt-6 ">
        <SubmitButton
          title='Create transfer product'
          isLoading={isLoading}
          loadingTitle= 'Creating ...'
        />
        <ButtonClose hrefUrl="/dashboard/inventory/products-transfers" />
      </div>
      ): <div className="flex justify-between items-center gap-4 mt-6 ">
       <div></div>
        <ButtonClose hrefUrl="/dashboard/inventory/products-transfers" />
      </div>}
      
    </form>
    </div>
    
  )
}



