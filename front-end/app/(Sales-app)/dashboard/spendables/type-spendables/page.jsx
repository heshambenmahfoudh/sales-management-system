import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import TypeSpendablesData from '@/components/DataList/TypeSpendablesData'
import { redirect } from 'next/navigation'


export default async function TypeSpendables() {
  const session = await getServerUser()
  if (!session) {
   redirect('/login')
   }
  const permission = await 
  fetchingData(`users/spendables-permissions?user=${session?.id}`)
  if(!permission?.typeSpendablesDataDisplay){
 redirect('/authrization')
  }
  const data = await fetchingData(`type-spendables`)
  return (
    <TypeSpendablesData data={data} permission={permission} />
  )
}
