import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import BondSpendablesData from '@/components/DataList/BondSpendablesData'
import { redirect } from 'next/navigation'

export default async function BondsSpendables() {
   const session = await getServerUser()
    if (!session) {
     redirect('/login')
     }
    const permission = await 
    fetchingData(`users/spendables-permissions?user=${session?.id}`)
    if(!permission?.bondsSpendablesDataDisplay){
    redirect('/authrization')
    }
  const data = await fetchingData( `spendables/bonds-spendables`,
)
 
  return (
    <BondSpendablesData data={data} permission={permission} />
  )
}
