import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import SuppliersDelayData from '@/components/DataList/SuppliersDelayData'
import { redirect } from 'next/navigation'

export default async function SuppliersDelayed() {
   const session = await getServerUser()
   if (!session) {
     redirect('/login')
   }
   const permission = await 
   fetchingData(`users/suppliers-permissions?user=${session?.id}`)
   if(!permission?.suppliersDelayedDisplay){
  redirect('/authrization')
   }
  const data = await fetchingData(`suppliers/suppliers-mony?balance=0`,
  )
 
  return (
    <SuppliersDelayData data={data} permission={permission} />
  )
}
