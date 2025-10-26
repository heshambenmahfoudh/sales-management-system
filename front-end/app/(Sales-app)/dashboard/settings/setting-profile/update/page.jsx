import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import ProfileForm from '@/components/Forms/ProfileForm'
import { redirect } from 'next/navigation'

export default async function UpdateUserProfile() {
 const session = await getServerUser()
  if (!session) {
   redirect('/login')
  }
  const permission = 
  await fetchingData(`users/settings-permissions?user=${session?.id}`)
  if(!permission?.SettingProfileData){
   redirect('/authrization')
  }
  return (<ProfileForm session={session}/>
)
}