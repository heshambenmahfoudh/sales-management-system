import React from 'react'
import SupplierForm from '@/components/Forms/SupplierForm'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function UpdateSupplier({ params }) {
  const session = await getServerUser()
      if (!session) {
        redirect('/login')
      }
      const permission = await
       fetchingData(`users/suppliers-permissions?user=${session?.id}`)
      if(!permission?.suppliersDataUpdate){
       redirect('/authrization')
      }
 const {id} = await params
  const supplier = await fetchingData(`suppliers/find/${id}`)
  return <SupplierForm isUpdate={id} initialData={supplier} />
}
