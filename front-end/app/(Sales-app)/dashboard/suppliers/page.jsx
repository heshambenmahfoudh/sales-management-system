import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import SuppliersData from '@/components/DataList/SuppliersData'
import { redirect } from 'next/navigation'

export default async function Suppliers() {
  const session = await getServerUser()
    if (!session) {
      redirect('/login')
    }
    const permission = await 
    fetchingData(`users/suppliers-permissions?user=${session?.id}`)
    if(!permission?.suppliersDataDisplay){
     redirect('/authrization')
    }
  const data = await fetchingData( `suppliers`)

  return (
    <SuppliersData data={data} permission={permission} />
  )
}
