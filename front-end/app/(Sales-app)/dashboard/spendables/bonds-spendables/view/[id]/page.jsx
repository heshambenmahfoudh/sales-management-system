import React from 'react'
import BondspendableForm from '@/components/Forms/BondspendableForm'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { fetchingData } from '@/actions/fetchingData'

export default async function ViewBondSpendable({ params }) {
  const session = await getServerUser()
  if (!session) {
   redirect('/login')
   }
  const permission = await 
  fetchingData(`users/spendables-permissions?user=${session?.id}`)
  if(!permission?.bondsSpendablesDataView){
   redirect('/authrization')
  }
   const {id} = await params
  const bondSpendable = await fetchingData(`spendables/bonds-spendables/find/${id}`)
  return <BondspendableForm isUpdate={id} initialData={bondSpendable} />
}
