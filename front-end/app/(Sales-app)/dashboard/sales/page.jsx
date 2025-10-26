import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import SalesData from "@/components/DataList/SalesData"
import { redirect } from "next/navigation"


export default async function Sales() {
 const session = await getServerUser()
   if (!session) {
    redirect('/login')
    }
   const permission = await 
   fetchingData(`users/sales-permissions?user=${session?.id}`)
   if(!permission?.salesDataDisplay){
    redirect('/authrization')
   }
    const data = await fetchingData(`sales`)

  return (
    <SalesData  data={data}  permission={permission} />
  )
}
