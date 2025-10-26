import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import SupplierdelayForm from '@/components/Forms/SupplierdelayForm'
import { redirect } from 'next/navigation'

export default async function UpdateSupplierDelay({ params}) {
  const session = await getServerUser()
  if (!session) {
    redirect('/login')
  }
  const permission = await 
  fetchingData(`users/suppliers-permissions?user=${session?.id}`)
  if(!permission?.suppliersDelayedUpdate){
 redirect('/authrization')
  }
 const {id} = await params
   const data = await fetchingData(`suppliers/suppliers-mony/find/${id}`)
  return <SupplierdelayForm isUpdate={id} initialData={data} />
}
