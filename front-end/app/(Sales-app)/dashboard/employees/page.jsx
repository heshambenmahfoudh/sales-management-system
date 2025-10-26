import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import EmployeesData from "@/components/DataList/EmployeesData"
import { redirect } from "next/navigation"


export default async function Employees() {
  const session = await getServerUser()
  if (!session) {
 redirect('/login')
 }
 
 const permission = await
  fetchingData(`users/employees-permissions?user=${session?.id}`)
 if(!permission?.employeesDataDisplay){
 redirect('/authrization')
 }
  const data = await fetchingData( `employees`,
  )
  return (
    <EmployeesData data={data} permission={permission} />
  )
}
