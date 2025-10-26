import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import SuppliersPaidData from '@/components/DataList/SuppliersPaidData'
import { redirect } from 'next/navigation'


export default async function SuppliersPaid() {
  const session = await getServerUser()
  if (!session) {
    redirect('/login')
  }
  const permission = await 
  fetchingData(`users/suppliers-permissions?user=${session?.id}`)
  if(!permission?.suppliersPaidDisplay){
 redirect('/authrization')
  }
  const data = await fetchingData( `suppliers/suppliers-mony`)

  return (
    <SuppliersPaidData data={data} permission={permission} />
  )
}
