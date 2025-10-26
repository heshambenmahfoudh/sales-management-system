'use client'
import React, {  useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormHeader from '../Headers/FormHeader'
import TextInput from '../FormInput/TextInput'
import SubmitButton from '../FormInput/SubmitButton'
import ButtonClose from '../FormInput/CloseButton'
import { useRouter } from 'next/navigation'
import { updateSupplierMonyDelay } from '@/actions/suppliers'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'

export default function SupplierdelayForm({isUpdate,initialData}) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues:{...initialData,
      supplier:initialData?.supplier?.name,
      dateMaturity:initialData?.dateMaturity?.slice(0,10),
      pay:0,
    }
  })
   const {data:user} =  useQuery({
      queryKey: ['sessionUser'],
      queryFn:getServerUser,
    })
  const router = useRouter()

  const pay =  watch('pay')

useEffect(() => {
const numberPay = watch('pay')
const numberBalance = Number(initialData?.balance)
if (pay <0) {
  setValue('pay',0)
}
if (!numberPay || numberPay <= 0) {
  setValue('balance',numberBalance)
  
}else{
  const newBalance = numberBalance - numberPay
  setValue('balance',newBalance < 0 ? 0 : newBalance)
}
}, [setValue,pay])

  async function onSubmit(data) {
    try {
      setIsLoading(true)
      data.pay = Number(pay)
      data.supplier = initialData?.supplier?._id
      data.name = user?.name
    const response = await updateSupplierMonyDelay(isUpdate, data)
          if (response.status === 200) {
            router.push('/dashboard/suppliers/suppliers-delayed')
            setIsLoading(false)
            reset()
            toast.success('Supplier mony delay Updated Successfully')
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
        titleValue= 'update Supplier Delay' 
        linkUrl="/dashboard/suppliers/suppliers-delayed"
       
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
             bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <TextInput
            label="Order Number"
            register={register}
            name="order"
            errors={errors}
            className="w-full"
            readOnly={true}
          />
          <TextInput
            label="Supplier Name"
            register={register}
            name="supplier"
            errors={errors}
            className="w-full"
               readOnly={true}
          />
          <TextInput
            label="Mony Balance"
            register={register}
            type='number'
            name="balance"
            errors={errors}
            className="w-full"
               readOnly={true}
            
            
            />
          <TextInput
            label="Mony Pay"
            register={register}
            type='number'
            name="pay"
            errors={errors}
            className="w-full"
          />
          <TextInput
            label="total Price"
            register={register}
            type='number'
            name="totalItemsPrice"
            errors={errors}
            className="w-full"
               readOnly={true}
          />
          
          <TextInput
            label="Date Maturity"
            register={register}
            type='date'
            name="dateMaturity"
            errors={errors}
            className="w-full"
               readOnly={true}
          />
          <TextInput
            label="Date"
            register={register}
            type='date'
            name="date"
            errors={errors}
            className="w-full"
          />
          
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title="Update supplier mony"
            isLoading={isLoading}
            loadingTitle="Updating ..."
          />
          <ButtonClose hrefUrl="/dashboard/suppliers/suppliers-delayed" />
        </div>
      </form>
    </div>
  )
}










