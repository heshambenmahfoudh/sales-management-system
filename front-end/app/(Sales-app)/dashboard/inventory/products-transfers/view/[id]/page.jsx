import React from 'react'
import TransferproductForm from '@/components/Forms/TransferproductForm'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function ViewTransferProduct({ params}) {
const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await
   fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.productsTransfersDataView){
 redirect('/authrization')
  }
 const {id} = await params
  const data = await fetchingData(`products/transfer-products/find/${id}`)
  return <TransferproductForm isUpdate={id} initialData={data} />
}
