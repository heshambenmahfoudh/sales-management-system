import React from 'react'
import SpendableForm from '@/components/Forms/SpendableForm'
import { fetchingData } from '@/actions/fetchingData'
import { redirect } from 'next/navigation'
import { getServerUser } from '@/actions/auth'

export default async function ViewSpendables({ params }) {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
 const permission = await 
 fetchingData(`users/spendables-permissions?user=${session?.id}`)
 if(!permission?.spendablesDataView){
  redirect('/authrization')
 }
  const {id} = await params
  const spendable = await fetchingData(`spendables/find/${id}`)
  return <SpendableForm isUpdate={id} initialData={spendable} />
}
