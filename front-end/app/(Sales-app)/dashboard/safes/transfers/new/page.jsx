import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import TransfermonyForm from '@/components/Forms/TransfermonyForm'
import { redirect } from 'next/navigation'

export default async function NewTransferMony() {
 const session =await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await
  fetchingData(`users/safes-permissions?user=${session?.id}`)
 if(!permission?.safesTransfersCreate){
 redirect('/authrization')
  }
  return <TransfermonyForm />
}
