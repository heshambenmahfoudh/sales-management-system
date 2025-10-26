import React from 'react'
import BondrecivableForm from '@/components/Forms/BondrecivableForm'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { fetchingData } from '@/actions/fetchingData'

export default async function UpdateBondReceivable({ params }) {
  const session = await getServerUser()
   if (!session) {
  redirect('/login')
  }
 const permission = await 
 fetchingData(`users/spendables-permissions?user=${session?.id}`)
 if(!permission?.bondsReceivablesDataView){
  redirect('/authrization')
 }
   const {id} = await params
  const data = await fetchingData(`spendables/bonds-receivables/find/${id}`)

  return <BondrecivableForm isUpdate={id} initialData={data} />
}
