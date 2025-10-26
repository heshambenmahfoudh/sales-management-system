import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import SalesReturnData from "@/components/DataList/SalesReturnData"
import { redirect } from "next/navigation"

export default async function SalesReturn() {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/sales-permissions?user=${session?.id}`)
 if(!permission?.salesReturnDisplay){
  redirect('/authrization')
  }
 const data = await fetchingData(`sales/sales-return`,
 )
  

  return (
    <SalesReturnData   data={data}  permission={permission} />
  )
}
