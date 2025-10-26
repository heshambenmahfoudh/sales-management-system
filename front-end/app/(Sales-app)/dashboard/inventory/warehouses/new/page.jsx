import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import WarehouseForm from '@/components/Forms/WarehouseForm'
import { redirect } from 'next/navigation'
export default async function NewWarehouse() {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.wareHousesDataCreate){
 redirect('/authrization')
  }
  return <WarehouseForm />
}
