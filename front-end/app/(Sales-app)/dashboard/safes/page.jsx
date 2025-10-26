import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import SafesData from "@/components/DataList/SafesData"
import { redirect } from "next/navigation"


export default async function Safes() {
const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await
  fetchingData(`users/safes-permissions?user=${session?.id}`)
 if(!permission?.safesDataDisplay){
 redirect('/authrization')
  }

const data = await fetchingData(`safes`)

  return (
    <SafesData   data={data} permission={permission} />
  )
}
