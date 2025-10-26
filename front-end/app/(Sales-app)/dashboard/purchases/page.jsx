import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import PurchasesData from '@/components/DataList/PurchasesData'
import { redirect } from 'next/navigation'

export default async function Purchases() {
  const session = await getServerUser()
    if (!session) {
    redirect('/login')
    }
    const permission = await
     fetchingData(`users/purchases-permissions?user=${session?.id}`)
    if(!permission?.purchasesDataDisplay){
   redirect('/authrization')
     }
     const data = await fetchingData(`purchases`,
     )

  return (
    <PurchasesData  data={data} permission={permission} />
  )
}
