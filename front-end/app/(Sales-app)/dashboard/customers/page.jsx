import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import CustomersData from '@/components/DataList/CustomersData'
import { redirect } from 'next/navigation'

export default async function Customers() {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await
  fetchingData(`users/customers-permissions?user=${session?.id}`)
 if(!permission?.customersDataDisplay){
 redirect('/authrization')
 }
 const data = await fetchingData(`customers`,
 )
  return (
    <CustomersData data={data} permission={permission} />
  )
}
