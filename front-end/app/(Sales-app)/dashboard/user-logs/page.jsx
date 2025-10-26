import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import LogsData from '@/components/DataList/LogsData'
import { redirect } from 'next/navigation'

export default async function logs() {
  const session = await getServerUser() 
  if (!session) {
    redirect('/login')
  }

  const data =  await fetchingData(`users/user-logs`)
  const permission = await fetchingData(`users/home-permissions?user=${session.id}`)
console.log(data)
  if (!permission?.logDisplay) {
     redirect('/authrization')
  }
  return (
    <LogsData data={data} permission={permission}/>
  )
}
