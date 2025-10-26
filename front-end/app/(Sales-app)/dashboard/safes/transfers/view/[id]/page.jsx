import React from 'react'
import TransfermonyForm from '@/components/Forms/TransfermonyForm'
import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import { redirect } from 'next/navigation'

export default async function ViewTransferMony({ params}) {
 const session =await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/safes-permissions?user=${session?.id}`)
 if(!permission?.safesTransfersView){
 redirect('/authrization')
  }
  const {id} = await params
  const data = await fetchingData(`transfers-mony/find/${id}`)

  return <TransfermonyForm isUpdate={id} initialData={data} />
}
