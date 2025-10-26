import React from 'react'
import CustomerForm from '@/components/Forms/CustomerForm'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function UpdateCustomer({ params }) {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/customers-permissions?user=${session?.id}`)
 if(!permission?.customersDataUpdate){
  redirect('/authrization')
 }
 const {id} = await params
  const data = await fetchingData(`customers/find/${id}`)
  return <CustomerForm isUpdate={id} initialData={data} />
}
