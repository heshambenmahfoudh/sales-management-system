import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import CategoriesData from "@/components/DataList/CategoriesData"
import { redirect } from "next/navigation"

export default async function Categories() {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/inventory-permissions?user=${session?.id}`)
 if(!permission?.categoriesDataDisplay){
 redirect('/authrization')
 }
  const data = await fetchingData(`categories`)
  return (
    <CategoriesData data={data} permission={permission}/>)
}
