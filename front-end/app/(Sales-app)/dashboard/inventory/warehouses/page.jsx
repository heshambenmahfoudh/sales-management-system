import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import WarehousesData from "@/components/DataList/WarehousesData"
import { redirect } from "next/navigation"


export default async function WareHouses() {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.wareHousesDataDisplay){
 redirect('/authrization')
  }
  
  const data = await fetchingData(`warehouses`)

  return (
    <WarehousesData data={data} permission={permission}/>
  )
}
