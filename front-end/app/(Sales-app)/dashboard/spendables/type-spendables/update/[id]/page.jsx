import React from 'react'
import TypespendableForm from '@/components/Forms/TypespendableForm'
import { redirect } from 'next/navigation'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'

export default async function UpdateTypeSpendable({ params }) {
  const session = await getServerUser()
      if (!session) {
      redirect('/login')
      }
     const permission = await 
     fetchingData(`users/spendables-permissions?user=${session?.id}`)
     if(!permission?.typeSpendablesDataUpdate){
       redirect('/authrization')
     }
  const {id} = await params
  const typeSpendable = await fetchingData(`type-spendables/find/${id}`)
  return <TypespendableForm isUpdate={id} initialData={typeSpendable} />
}
