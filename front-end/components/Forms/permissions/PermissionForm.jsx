'use client'
import { permessionLinks } from "@/app/(dummy)/data"
import { useStateContext } from "@/contexts/ContextProvider"
import { MenuIcon } from "lucide-react"
import SalePermissionForm from "./SalePermissionForm"
import UserPermissionForm from "./UserPermissionForm"
import InventoryPermissionForm from "./InventoryPermissionForm"
import SpendablePermissionForm from "./SpendablePermissionForm"
import SettingPermissionForm from "./SettingPermissionForm"
import SupplierPermissionForm from "./SupplierPermissionForm"
import CustomerPermissionForm from "./CustomerPermissionForm"
import EmployeePermissionForm from "./EmployeePermissionForm"
import SafePermissionForm from "./SafePermissionForm"
import PurchasePermissionForm from "./PurchasePermissionForm"
import HomePermissionForm from "./HomePermissionForm"
import FormHeader from "@/components/Headers/FormHeader"

export default function PermissionForm() {
 const {
    pagePermission,
    setPagePermission,
    selectPagePermission,
    setSelectPagePermission,
  } = useStateContext()

  function handleChoosePage(title) {
    setPagePermission({ title })
    setSelectPagePermission((prev) => !prev)
  }

  return (
    <div>
      <FormHeader titleValue="update user permission" isHidden={true} />
      <div
        className="lg:p-7 md:p-4 p-3  lg:mx-auto
            md:my-5 my-4  rounded-md md:mx-4 mx-3
       bg-white shadow-md border-p1 max-w-[1050px]"
      >
        <h2 className="text-center font-medium mb-2.5">
          Select Page To Start Permission
        </h2>
        {/* START Links PERMISSION */}
        <div className="relative">
          <div
            className="text-[23px] p-2 w-fit
       bg-gray-300 rounded-full text-emerald-900 cursor-pointer  z-10"
            onClick={() => setSelectPagePermission((prev) => !prev)}
          >
            <MenuIcon className="h-6 w-6 " />
          </div>
          {selectPagePermission && (
            <div
              className="
            flex flex-col md:w-[20rem] w-[14rem] shadow-lg shadow-white mt-1 p-1.5 gap-2
            bg-blue-200 rounded-lg absolute top-10 h-[320px] overflow-auto   z-10"
            >
              {permessionLinks?.map(({ title }) => (
                <h2
                  className={`p-1 cursor-pointer
              hover:bg-blue-50 rounded-md 
                capitalize text-center  text-15 font-medium ${
                  pagePermission?.title === title &&
                  'bg-slate-50 text-black underline'
                }`}
                  onClick={() => handleChoosePage(title)}
                  key={title}
                >
                  {title}
                </h2>
              ))}
            </div>
          )}
        </div>
        {pagePermission?.title === 'sales' ? (
          <SalePermissionForm />
        ) : pagePermission?.title === 'users' ? (
          <UserPermissionForm />
        ) : pagePermission?.title === 'inventory' ? (
          <InventoryPermissionForm />
        ) : pagePermission?.title === 'spendables' ? (
          <SpendablePermissionForm />
        ) : pagePermission?.title === 'settings' ? (
          <SettingPermissionForm />
        ) : pagePermission?.title === 'suppliers' ? (
          <SupplierPermissionForm />
        ) : pagePermission?.title === 'customers' ? (
          <CustomerPermissionForm />
        ) : pagePermission?.title === 'employees' ? (
          <EmployeePermissionForm />
        ) : pagePermission?.title === 'safes' ? (
          <SafePermissionForm />
        ) : pagePermission?.title === 'purchases' ? (
          <PurchasePermissionForm />
        ) : (
          <HomePermissionForm />
        )}
      </div>
    </div>
  )
}
