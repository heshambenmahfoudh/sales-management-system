import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import TransfersMonyData from '@/components/DataList/TransfersMonyData'
import { redirect } from 'next/navigation'

export default async function TransfersMony() {
 const session =await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/safes-permissions?user=${session?.id}`)
 if(!permission?.safesTransfersDisplay){
 redirect('/authrization')
  }
  const data = await fetchingData( `transfers-mony`,
  )
  return (
    <TransfersMonyData data={data} permission={permission} />
  )
}
