import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import PulledsMonyData from '@/components/DataList/PulledsMonyData'
import { redirect } from 'next/navigation'

export default async function PulledsMony() {
  const session =await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/safes-permissions?user=${session?.id}`)
  if(!permission?.safesPulledDisplay){
  redirect('/authrization')
   }
   const data = await fetchingData(`mony-pulleds`,
   )
  return (
    <PulledsMonyData data={data} permission={permission} />
  )
}
