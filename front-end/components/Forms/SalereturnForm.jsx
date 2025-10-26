'use client'
import { fetchingData } from '@/actions/fetchingData'
import { createNewSaleReturn } from '@/actions/sales'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormHeader from '../Headers/FormHeader'
import TextInput from '../FormInput/TextInput'
import SubmitButton from '../FormInput/SubmitButton'
import LoadingFetchingPermission from '../LoadingFetchingPermission'
import ListproductItem from '../ListproductItem'
import SelectInput from '../FormInput/SelectInput'
import TextAreaInput from '../FormInput/TextAreaInput'
import ButtonClose from '../FormInput/CloseButton'
import { statusOptions } from '@/app/(dummy)/data'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'


export default function SalereturnForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [saleData, setSaleData] = useState([])
   
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

let order  = watch('order')

async function handleSearchOrder() {
  try {
  if (order) {
  setIsLoadingData(true)
      const data= await fetchingData(`sales/find/${order}`)
      setSaleData(data)
      calculationData()
      setIsLoadingData(false)
  if (!data) {
    setIsLoadingData(false)
    toast.error('Sale order not Found')
  }
}
} catch (error) {}
}


let totalItemsPrice = 0,
    totalPrice = 0,
    pay = 0
function calculationData(){
  saleData?.length > 0 &&
  saleData?.forEach((item) => {
    const itemQty = item?.qty
    const itemPrice = item?.price
    totalPrice = itemQty * itemPrice
    totalItemsPrice +=  totalPrice
    pay = item?.pay
    
    return { totalItemsPrice, pay, totalPrice }
  })
}

useEffect(() => {
  calculationData()
  if (saleData) {
       setValue('customer',saleData?.[0]?.customer?.name || saleData?.[0]?.cashCustomer)
      setValue('totalItemsPrice',totalItemsPrice)
      setValue('pay',pay)
    }else{
      setValue('customer','')
      setValue('totalItemsPrice',0)
      setValue('pay',0)

    }
}, [totalItemsPrice,pay,saleData])

async function onSubmit(data) {
    try {
      setIsLoading(true)
      data.sales = saleData
        const response = await createNewSaleReturn(data)
        if (response.status === 200) {
          router.push('/dashboard/sales/return')
          setIsLoading(false)
          reset()
          toast.success('New Sale Return Created Successfully')
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
      linkUrl="/dashboard/sales/return"
      titleValue='new sale return'
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
         data={saleData} 
             setData={setSaleData} />
          }
        
        <TextInput
          label="Sale Date"
          type="date"
          name="date"
          register={register}
          errors={errors}
          className="w-full"
        />
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
          readOnly={true}
          />
      <TextInput
       label="Sale Customer"
       register={register}
       name="customer"
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
        defaultValue={user?.name}
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
            title="Create sale return"
            isLoading={isLoading}
            loadingTitle="Creating ..."
            />
          <ButtonClose hrefUrl="/dashboard/sales/return" />
        </div>
    </form>
    </div>
   
  )
}
