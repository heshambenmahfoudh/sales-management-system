'use client'
import React, { useEffect, useState } from 'react'
import { fetchingData } from '@/actions/fetchingData'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createNewPurchaseReturn } from '@/actions/purchases'
import SubmitButton from '@/components/FormInput/SubmitButton'
import TextInput from '@/components/FormInput/TextInput'
import SelectInput from '@/components/FormInput/SelectInput'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import { statusOptions } from '@/app/(dummy)/data'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'
import ListproductItem from '../ListproductItem'
import LoadingFetchingPermission from '../LoadingFetchingPermission'
import FormHeader from '../Headers/FormHeader'
import ButtonClose from '../FormInput/CloseButton'

export default function PurchasereturnForm() {
const [isLoading, setIsLoading] = useState(false)
const [isLoadingData, setIsLoadingData] = useState(false)
const [purchaseData, setPurchaseData] = useState([])
 
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

const { data: warehousesData } = useQuery({
     queryKey: ['warehousesData'],
     queryFn: () => fetchingData(`warehouses`),
})
const warehouseOptions =  warehousesData?.map(({ _id, title }) => ({
    value: _id,
    label: title,
}))

let order = watch('order')

async function handleSearchOrder() {
  try {
  if (order) {
      setIsLoadingData(true)
      const data= await  fetchingData(`purchases/find/${order}`)
      setPurchaseData(data)
      calculationData()
      setIsLoadingData(false)
  if (!productsData) {
    setIsLoadingData(false)
    toast.error('Purchase order not Found')
  }
}
} catch (error) {}
}

let totalItemsPrice = 0,
    totalPrice = 0,
    pay = 0,
    balance = 0

function calculationData(){
  purchaseData?.length > 0 &&
  purchaseData?.forEach((item) => {
    let qty =  item?.qty ||0
    let itemPrice = item?.price || 0
    totalItemsPrice += qty* itemPrice
    totalPrice = qty * itemPrice
    pay = item?.pay
    return { totalItemsPrice, balance, pay, totalPrice }
  })
}

useEffect(() => {
  calculationData()
  setValue('resposibleName',user?.name)
  if (purchaseData) {
      setValue('supplier',purchaseData?.[0]?.supplier?.name)
      setValue('totalItemsPrice',totalItemsPrice)
      setValue('pay',pay)
    }else{
      setValue('totalItemsPrice',0)
      setValue('pay',0)
      setValue('supplier','')
    }
  }, [purchaseData,totalItemsPrice])
  
  
async function onSubmit(data) {
  try {
    setIsLoading(true)
    data.purchases = purchaseData
      const response = await createNewPurchaseReturn(data)
      if (response.status === 200) {
        router.push('/dashboard/purchases/return')
        setIsLoading(false)
        reset()
        toast.success('New Purchase Return Created Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
}

console.log('purchaseData',purchaseData)

  return (
    <div>
    <FormHeader
      linkUrl="/dashboard/purchases/return"
      titleValue='new purchase return'
    />
    <form
      className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 
      rounded-md bg-white shadow-md max-w-4xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 
      md:grid-cols-2 grid-cols-1  mt-3">
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
                title={isLoadingData ? "Searching..." :'Search'}
                isLoading={isLoadingData}
                isDisabled= {!order}
              />
         </div>
         {isLoadingData ?  
         <div className='sm:col-span-2 '>
            <LoadingFetchingPermission />
          </div> :
         <ListproductItem 
            data={ purchaseData} 
            setData={setPurchaseData} 
          />
          }
        <TextInput
          label="Purchase Return Total"
          type='number'
          register={register}
          name="totalItemsPrice"
          errors={errors}
          className="w-full"
          readOnly={true}
        />
        <TextInput
          label="Purchase Return Pay"
          type='number'
          register={register}
          name="pay"
          errors={errors}
          className="w-full"
          readOnly={true}
          />
        <TextInput
          label="Purchase Return Date"
          type="date"
          name="date"
          register={register}
          errors={errors}
          className="w-full"
        />
       <TextInput
          label="Supplier"
          name="supplier"
          register={register}
          errors={errors}
          className="w-full"
          readOnly={true}
        />
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
        label="Responsible Name"
        register={register}
        name="resposibleName"
        errors={errors}
        className="w-full"
        readOnly={true}
      />
      <SelectInput
        label="Select The Status"
        name="status"
        control={control}
        className="w-full"
        options={statusOptions}
        errors={errors}
        option="Status"
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
            title="Create purchase return"
            isLoading={isLoading}
            loadingTitle="Creating ..."
            />
          <ButtonClose hrefUrl="/dashboard/purchases/return" />
        </div>
    </form>
    </div>
  )
}
