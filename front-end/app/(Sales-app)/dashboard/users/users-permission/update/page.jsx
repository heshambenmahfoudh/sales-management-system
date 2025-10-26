import { getServerUser } from "@/actions/auth";
import { fetchingData } from "@/actions/fetchingData";
import PermissionForm from "@/components/Forms/permissions/PermissionForm";
import { redirect } from "next/navigation";


export default async function UpdateUserPermission() {
  const session = await getServerUser()
   if (!session) {
      redirect('/login')
    }
    const permission = await
     fetchingData(`users/users-permissions?user=${session?.id}`)
    if (!permission?.userPermissionUpdate) {
   redirect('/authrization')
    }

  return (
    <PermissionForm/>
  )
}
