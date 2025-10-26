import UserForm from '@/components/Forms/UserForm'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function UpdateUser({ params }) {
  const session = await getServerUser()
    if (!session) {
      redirect('/login')
    }
   const permission = await 
   fetchingData(`users/users-permissions?user=${session?.id}`)
   if (!permission?.userDataUpdate) {
     redirect('/authrization')
   }
 const {id} = await params
  const data = await fetchingData(`users/find/${id}`)
  return <UserForm isUpdate={id} initialData={data} />
}
