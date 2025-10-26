import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import UserForm from '@/components/Forms/UserForm'
import { redirect } from 'next/navigation'

export default async function NewUser() {
  const session = await getServerUser()
  if (!session) {
      redirect('/login')
    }
    const permission = await 
    fetchingData(`users/users-permissions?user=${session?.id}`)
    if (!permission?.userDataCreate) {
    redirect('/authrization')
    }
  return <UserForm />
}
