import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import CustomersPaidData from '@/components/DataList/CustomersPaidData'
import { redirect } from 'next/navigation'


export default async function CustomersPaid() {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await fetchingData(`users/customers-permissions?user=${session?.id}`)
  if(!permission?.customersPaidDisplay){
   redirect('/authrization')
  }
  const data = await fetchingData(`customers/customers-mony`,
  )
  
  return (
    <CustomersPaidData data={data} permission={permission} />
  )
}
