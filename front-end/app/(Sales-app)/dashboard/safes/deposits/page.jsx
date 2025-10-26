import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import DepositesMonyData from '@/components/DataList/DepositesMonyData'
import { redirect } from 'next/navigation'

export default async function MonyDeposits() {
  const session =await getServerUser()
    if (!session) {
    redirect('/login')
    }
    const permission = await 
    fetchingData(`users/safes-permissions?user=${session?.id}`)
    if(!permission?.safesDepositsDisplay){
   redirect('/authrization')
     }
  const data = await fetchingData(`mony-deposites`)

  return (
    <DepositesMonyData data={data} permission={permission} />
  )
}
