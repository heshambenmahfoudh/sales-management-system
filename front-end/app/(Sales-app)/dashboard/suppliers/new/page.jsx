import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import SupplierForm from '@/components/Forms/SupplierForm'
import { redirect } from 'next/navigation'

export default async function NewSupplier() {
  const session = await getServerUser()
  if (!session) {
    redirect('/login')
  }
  const permission = await 
  fetchingData(`users/suppliers-permissions?user=${session?.id}`)
  if(!permission?.suppliersDataCreate){
     redirect('/authrization')
  }
  return <SupplierForm />
}
