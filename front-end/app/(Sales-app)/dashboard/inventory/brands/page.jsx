import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import BrandsData from "@/components/DataList/BrandsData"
import { redirect } from "next/navigation"

export default async function Brands() {
  const session = await getServerUser()
    if (!session) {
    redirect('/login')
    }
    const permission = await 
    fetchingData(`users/inventory-permissions?user=${session?.id}`)
    if(!permission?.brandsDataDisplay){
   redirect('/authrization')
    }
  const data = await fetchingData(`brands`)

  return (
    <BrandsData data={data} permission={permission} />
  )
}
