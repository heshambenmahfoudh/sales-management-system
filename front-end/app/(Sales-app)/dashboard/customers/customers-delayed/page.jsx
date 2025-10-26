import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import CustomersDelayData from '@/components/DataList/CustomersDelayData'
import { redirect } from 'next/navigation'


export default async function CustomersDelayed() {
 const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await fetchingData(`users/customers-permissions?user=${session?.id}`)
  if(!permission?.customersDelayedDisplay){
  redirect('/authrization')
  }
  const data = await fetchingData(`customers/customers-mony?balance=0`,
  )
  
  return (
    <CustomersDelayData data={data} permission={permission} />
  )
}
