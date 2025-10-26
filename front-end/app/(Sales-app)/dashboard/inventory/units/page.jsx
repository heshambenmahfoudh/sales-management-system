import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import UnitsData from '@/components/DataList/UnitsData'
import { redirect } from 'next/navigation'

export default async function Units() {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/inventory-permissions?user=${session?.id}`)
 if(!permission?.unitsDataDisplay){
 redirect('/authrization')
 }
 const data = await fetchingData(`units`)

  return (
    <UnitsData data={data} permission={permission}/>
  )
}
