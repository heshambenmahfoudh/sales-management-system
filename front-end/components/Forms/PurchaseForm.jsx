'use client'
import { fetchingData } from '@/actions/fetchingData'
import { createNewPurchase } from '@/actions/purchases'
import {  useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormHeader from '../Headers/FormHeader'
import SelectInput from '../FormInput/SelectInput'
import TextInput from '../FormInput/TextInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import ListproductItem from '../ListproductItem'
import TextAreaInput from '../FormInput/TextAreaInput'
import ButtonClose from '../FormInput/CloseButton'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'

export default function PurchaseForm({ isUpdate, initialData }) {
const [listProduct, setListProduct] = useState([])
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
    supplier:initialData?.supplier?._id,
    date:initialData?.date?.slice(0,10),
  },
})

const {data:user} =  useQuery({
  queryKey: ['sessionUser'],
  queryFn:getServerUser,
})

const sku =watch('sku')
const productId = watch('product')
const unitId = watch('unit')
const newPrice = watch('price')
const newQty = watch('qty')
const newPay = watch('pay')
  
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

const { data: unitsData } = useQuery({
  queryKey: ['unitsData'],
  queryFn: () => fetchingData(`units`),
})
const unitOptions =  unitsData?.map(({ _id, title }) => ({
  value: _id,
  label: title,
}))

const { data: suppliersData } = useQuery({
    queryKey: ['suppliersData'],
    queryFn: () => fetchingData(`suppliers`),
})
const supplierOptions =  suppliersData?.map(({ _id, name }) => ({
  value: _id,
  label: name,
}))

const { data: existProductDataBy } = useQuery({
   queryKey: ['existProductDataBy',productId],
   queryFn: () => fetchingData(`products/find/${productId}`,
   )
   , enabled:!!productId
})
 
let totalItemsPrice = 0
let totalPrice = 0
let qty = parseInt(newQty)
let balance = 0

function handleNewProduct() {
  if (!existProductDataBy) return null
  setListProduct((prev) => [
    ...prev,
    {
      ...existProductDataBy,
      proQty: qty,
      qty,
      price: newPrice,
      totalPrice: newPrice * qty,
    },
  ])
  reset()
}

const total = watch('totalItemsPrice')
const payMony = watch('pay')

listProduct?.forEach((item) => {
  let qty =  item?.qty ||0
  let itemPrice = item?.price || 0
  totalItemsPrice += itemPrice * qty
  balance = totalItemsPrice - newPay
  totalPrice = itemPrice * qty
  return { totalItemsPrice, totalPrice, balance }
})
  
useEffect(() => {
 if (existProductDataBy ) {
       setValue('product',existProductDataBy?._id)
       setValue('price',existProductDataBy?.buyPrice)
     }else{
       reset()
     }
}, [existProductDataBy,setValue])


useEffect(() => {
      setValue('totalItemsPrice',totalItemsPrice)
      setValue('balance',balance)
}, [total,payMony,listProduct,setValue])
  
  const isDisabled =  
      !productId 
  || !unitId 
  || !newPrice 
  || !newQty

  async function onSubmit(data) {
    try {
      setIsLoading(true)
      data.products= listProduct
        const response = await createNewPurchase(data)
        if (response.status === 200) {
          router.push('/dashboard/purchases')
          setIsLoading(false)
          reset()
          toast.success('New Purchase Created Successfully')
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
      linkUrl="/dashboard/purchases"
      titleValue={isUpdate ? 'purchase data' : 'new purchase'}
    />
    <form
      className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
   bg-white shadow-md max-w-4xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:gap-y-4 
      gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
         <SelectInput
                     label="Search Product by SKU"
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
                           isRequired={false}
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
          isRequired={false}
          />
         <TextInput
           label="Product Qty"
          type='number'
          register={register}
          name="qty"
          errors={errors}
          className="w-full"
          isRequired={false}
          />
          
         <TextInput
           label="Product Price"
          type='number'
          register={register}
          name="price"
          errors={errors}
          className="w-full"
          isRequired={false}
          />
          <div className="mt-2 flex justify-between sm:col-span-2 gap-4 items-center">
            <SubmitButton
            handleClick={handleNewProduct}
            title='Add'
            isLoading={false}
            isDisabled= {isDisabled}
            />
          </div>
         
        <ListproductItem 
          data={
            listProduct} 
          setData={setListProduct} />
          <SelectInput
          label="Select The Supplier"
          name="supplier"
          control={control}
          className="w-full"
          options={supplierOptions}
          errors={errors}
          option="Supplier"
        />
        <TextInput
          label="Purchase Date"
          type='date'
          register={register}
          name="date"
          errors={errors}
          className="w-full"
          />
        <TextInput
          label="Purchase Total"
          type='number'
          register={register}
          name="totalItemsPrice"
          errors={errors}
          className="w-full"
          readOnly={true}
          />
        <TextInput
          label="Purchase Pay"
          type='number'
          register={register}
          name="pay"
          errors={errors}
          className="w-full"
          />
        <TextInput
          label="Purchase Balance"
          type='number'
          register={register}
          name="balance"
          errors={errors}
          className="w-full"
          readOnly={true}
          />
            <TextInput
            label="Responsible Name"
            register={register}
            name="resposibleName"
            errors={errors}
            className="w-full"
            readOnly={true}
            defaultValue={!isUpdate && user?.name}
            />
            {balance > 0 && (
            <TextInput
            label="Purchase Maturity Date"
            type='date'
            register={register}
            name="dateMaturity"
            errors={errors}
            className="w-full"
            />
          )}
        <TextAreaInput
          label="Notes"
          name="notes"
          register={register}
          errors={errors}
        />
      </div>
      <div className="flex justify-between items-center gap-4 mt-6 ">
        <SubmitButton
          title='Create purchase'
          isLoading={isLoading}
          loadingTitle= 'Creating purchase ...'
        />
        <ButtonClose hrefUrl="/dashboard/purchases" />
      </div>
    </form>
    </div>
  )
}




