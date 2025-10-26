import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import UsersData from '@/components/DataList/UsersData'
import { redirect } from 'next/navigation'

export default async function Users() {
  const session = await getServerUser()
  if (!session) {
    redirect('/login')
  }
  const permission = await 
  fetchingData(`users/users-permissions?user=${session?.id}`)
  if (!permission?.userDataDisplay) {
 redirect('/authrization')
  }
  const data = await fetchingData(`users?session=${session?.id}`)
  
  return (
    <UsersData data={data} permission={permission} />
  )
}
