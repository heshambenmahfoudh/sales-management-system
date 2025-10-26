'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import toast from 'react-hot-toast'
import { createNewProductQty } from '@/actions/productQuantities'
import { fetchingData } from '@/actions/fetchingData'
import { useRouter } from 'next/navigation'
import ListproductItem from '../ListproductItem'
import TextAreaInput from '../FormInput/TextAreaInput'
import LoadingFetchingPermission from '../LoadingFetchingPermission'
import SubmitButton from '@/components/FormInput/SubmitButton'
import { useQuery } from '@tanstack/react-query'

export default function ProductqtyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [productsData, setProductsData] = useState([])
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm()
  const router = useRouter()

const { data: warehousesData } = useQuery({
      queryKey: ['warehousesData'],
      queryFn: () => fetchingData(`warehouses`),
})
const warehouseOptions =  warehousesData?.map(({ _id, title }) => ({
   value: _id,
     label: title,
 }))
const order = watch('order')

async function handleSearchOrder() {
try {
  if (order) {
    setIsLoadingData(true)
    const data= await  fetchingData(`purchases/find/${order}?stored=false`)
    setProductsData(data)
    setIsLoadingData(false)
    if (!data) {
      setIsLoadingData(false)
      toast.error('Purchase order not Found')
    }
  }
} catch (error) {}
}

async function onSubmit(data) {
 try {
   setIsLoading(true)
   data.products =productsData
   const response = await createNewProductQty(data)
   if (response.status === 200) {
     router.push('/dashboard/inventory/products-quantitaies')
     setIsLoading(false)
     reset()
     toast.success('New Product Qty Ceated Successfully')
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
        linkUrl="/dashboard/inventory/products-quantitaies"
        titleValue='new Product Quantity'
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
   bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Order number"
            register={register}
            name="order"
            errors={errors}
            className="w-full"
           isRequired={false}
          />
           <div className="mt-7 flex justify-between gap-4 items-center">
                 <SubmitButton
                  handleClick={handleSearchOrder}
                  title={isLoadingData ?"Searching..." :'Search'}
                  isLoading={isLoadingData}
                  isDisabled= {!order}
                />
           </div>
           {isLoadingData ?  
           <div className='sm:col-span-2 '>
            <LoadingFetchingPermission />
            </div> :
          <ListproductItem 
                      data={ productsData} 
                      setData={setProductsData} 
                    />
            }
         
          <SelectInput
            label="Select The Warehouse"
            name="warehouse"
            control={control}
            className="w-full"
            options={warehouseOptions}
            errors={errors}
            option="Warehouse"
          />
          <TextInput
            label="Product Qty Date"
            type="date"
            name="date"
            register={register}
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
          <div className="mt-6 flex justify-between gap-4 items-center">
            <SubmitButton
              title="Create product quantity"
              isLoading={isLoading}
              loadingTitle="Creating ..."
            />
            <ButtonClose hrefUrl="/dashboard/inventory/products-quantitaies" />
          </div>
      </form>
    </div>
  )
}

