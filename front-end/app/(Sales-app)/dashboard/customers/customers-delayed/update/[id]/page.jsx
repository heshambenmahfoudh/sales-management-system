import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import CustomerdelayForm from '@/components/Forms/CustomerdelayForm'
import { redirect } from 'next/navigation'

export default async function UpdateCustomerDelay({ params}) {
 const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await fetchingData(`users/customers-permissions?user=${session?.id}`)
  if(!permission?.customersDelayedUpdate){
  redirect('/authrization')
  }
  const {id} = await params
  const data = await fetchingData(`customers/customers-mony/find/${id}`)
  return <CustomerdelayForm isUpdate={id} initialData ={data}  />
}
