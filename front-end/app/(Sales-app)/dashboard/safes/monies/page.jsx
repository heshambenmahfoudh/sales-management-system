import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import SafesMonyData from '@/components/DataList/SafesMonyData'
import { redirect } from 'next/navigation'

export default async function Monies() {
 const session =await getServerUser()
    if (!session) {
    redirect('/login')
    }
    const permission = await 
    fetchingData(`users/safes-permissions?user=${session?.id}`)
    if(!permission?.safesMonyDisplay){
 redirect('/authrization')
     }
     const data = await fetchingData(`monies`)
  return (
    <SafesMonyData data={data} permission={permission} />
  )
}
