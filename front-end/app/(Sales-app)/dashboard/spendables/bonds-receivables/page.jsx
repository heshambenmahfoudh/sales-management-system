import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import BondRecivablesData from '@/components/DataList/BondRecivablesData'
import { redirect } from 'next/navigation'

export default async function BondsReceivables() {
 const session = await getServerUser()
  if (!session) {
   redirect('/login')
   }
  const permission = await 
  fetchingData(`users/spendables-permissions?user=${session?.id}`)
  if(!permission?.bondsReceivablesDataDisplay){
 redirect('/authrization')
  }
  const data = await fetchingData(`spendables/bonds-receivables`,
  )

  return (
    <BondRecivablesData data={data} permission={permission} />
  )
}
