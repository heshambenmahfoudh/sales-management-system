'use client'
import { fetchingData } from '@/actions/fetchingData'
import { createNewSale } from '@/actions/sales'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SubmitButton from '@/components/FormInput/SubmitButton'
import ButtonClose from '@/components/FormInput/CloseButton'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import ListproductItem from '../ListproductItem'
import FormHeader from '../Headers/FormHeader'
import SelectInput from '@/components/FormInput/SelectInput'
import CheckBoxInput from '@/components/FormInput/CheckBoxInput'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'

export default function SaleForm() {
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
} = useForm()

const {data:user} =  useQuery({
  queryKey: ['sessionUser'],
  queryFn:getServerUser,
})
  

const unitId = watch('unit')
const productId = watch('product')
const newPrice = watch('price')
const newQty = watch('qty')
const newPay = watch('pay')
const isCach = watch('isCach')
const sku = watch('sku')

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

const { data: customersData } = useQuery({
  queryKey: ['customersData'],
  queryFn: () => fetchingData(`customers`),
})
const customerOptions =  customersData?.map(({ _id, name }) => ({
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
  const itemPrice = item?.price ||0
  const itemQty = item?.qty||0
        totalItemsPrice += itemPrice * itemQty
        balance = totalItemsPrice - newPay
        totalPrice = itemPrice * itemQty
        return { totalItemsPrice, totalPrice, balance }
})
      
useEffect(() => {
 if (existProductDataBy ) {
   setValue('product',existProductDataBy?._id)
   setValue('price',existProductDataBy?.salePrice)
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
  const response = await createNewSale(data)
    if (response.status === 200) {
      router.push('/dashboard/sales')
      setIsLoading(false)
      reset()
      toast.success('New Sale Created Successfully')
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
      linkUrl="/dashboard/sales"
      titleValue='new sale'
    />
    <form
      className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
   bg-white shadow-md max-w-4xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:gap-y-4 
           gap-y-2.5 md:grid-cols-2 grid-cols-1 mt-3">
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
          data={listProduct} 
          setData={setListProduct} />
        <CheckBoxInput
              label="Cash Customer"
              name="isCach"
              register={register}
              className='w-fit flex flex-row-reverse items-center gap-2'
        />
        {isCach ?  
        <TextInput
          label="Cash Customer"
          name="cashCustomer"
          register={register}
          errors={errors}
          className="w-full"
          isRequired={isCach &&true}
        />
          :
        <SelectInput
              label="Select The Customer"
              name="customer"
              control={control}
              className="w-full"
              options={customerOptions}
              errors={errors}
              option="Customer"
              isRequired={isCach ?false:true}
        />
          }
        <TextInput
          label="Sale Total"
          type='number'
          register={register}
          name="totalItemsPrice"
          errors={errors}
          className="w-full"
          readOnly={true}
          />
        <TextInput
          label="Sale Pay"
          type='number'
          register={register}
          name="pay"
          errors={errors}
          className="w-full"
          />
            <TextInput
            label="Sale Balance"
            type='number'
            register={register}
            name="balance"
            errors={errors}
            className="w-full"
            readOnly={true}
            />
            {balance > 0 && !isCach &&(
              <TextInput
              label="Sale Maturity Date"
              type='date'
              register={register}
              name="dateMaturity"
              errors={errors}
              className="w-full"
              />
            )}
              <TextInput
                label="Sale Date"
                type='date'
                register={register}
                name="date"
                errors={errors}
                className="w-full"
                />
            <TextInput
            label="Responsible Name"
            register={register}
            name="resposibleName"
            errors={errors}
            className="w-full"
            readOnly={true}
            defaultValue={user?.name}
            />
        <TextAreaInput
          label="Notes"
          name="notes"
          register={register}
          errors={errors}
        />
      </div>
       <div className="flex justify-between items-center gap-4 mt-6 ">
       <SubmitButton
         title='Create sale'
         isLoading={isLoading}
         loadingTitle='Creating sale ...'
       />
       <ButtonClose hrefUrl="/dashboard/sales" />
     </div>
    </form>
    </div>
  )
}
