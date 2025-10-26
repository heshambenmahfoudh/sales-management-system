'use client'
import {
  CreditCard,
  DollarSign,
  LayoutDashboardIcon,
  Power,
  Settings2Icon,
  SettingsIcon,
  ShoppingCart,
  Tag,
  Truck,
  UserCheck,
  Users2,
  X,
} from "lucide-react";
import {
  FaCaretDown,
  FaCaretRight,
    FaPlus,
  } from 'react-icons/fa'
import Link from 'next/link'
import { useStateContext } from "@/contexts/ContextProvider";
import { customersLinks, dashboardLinks, 
  employeesLinks, inventoryLinks, purchasesLinks,
  safesLinks, salesLinks, settingsLinks, spendablesLinks, 
  suppliersLinks, usersLinks } from "@/app/(dummy)/data";
import getInitialName from "@/lib/getInitialName";
import { fetchingData } from "@/actions/fetchingData";
import { useQuery } from "@tanstack/react-query";
import { getServerUser, logoutUser } from "@/actions/auth";
import toast from "react-hot-toast";


export default function Sidebar() {
  const {
    inventoryDrop,
    setInventoryDrop,
    suppliersDrop,
    setSuppliersDrop,
    safesDrop,
    setSafesDrop,
    spendablesDrop,
    purchaseDrop,
    setPurchaseDrop,
    saleDrop,
    setSaleDrop,
    setSpendablesDrop,
    customersDrop,
    setCustomersDrop,
    employeesDrop, 
    setEmployeesDrop,
    setActiveMenu,
    activeMenu,
    usersDrop, 
    setUsersDrop,
    dashboardsDrop, 
    setDashboardsDrop,
    settingsDrop,
    setSettingsDrop,
  } = useStateContext()

  const {data:session} =  useQuery({
    queryKey: ['sessionUser'],
    queryFn:getServerUser,
  })
  const id = session?.id 

  const { data: dashboardPermission } = useQuery({
    queryKey: ['homePermission',id],
    queryFn: () => fetchingData(
    `users/home-permissions?user=${id}`),
    enabled:!!id
  })
  
  const { data: settingPermission } = useQuery({
    queryKey: ['settingPermission',id],
    queryFn: () => fetchingData(
    `users/settings-permissions?user=${id}`,
  ),
  enabled:!!id
  })

  const { data: userPermission } = useQuery({
    queryKey: ['userPermission',id],
    queryFn: () => fetchingData(
     `users/users-permissions?user=${id}`,
  ),
  enabled:!!id
  })
  
  const { data: inventoryPermission } = useQuery({
    queryKey: ['inventoryPermission',id],
    queryFn: () => fetchingData(
 `users/inventory-permissions?user=${id}`,
  )
  ,enabled:!!id
  })

  const { data: spendablePermission } = useQuery({
    queryKey: ['spendablePermission',id],
    queryFn: () => fetchingData(
 `users/spendables-permissions?user=${id}`,
  ),enabled:!!id
  })

  const { data: supplierPermission } = useQuery({
    queryKey: ['supplierPermission',id],
    queryFn: () => fetchingData(
 `users/suppliers-permissions?user=${id}`,
  ),enabled:!!id,
  })

  const { data: customerPermission } = useQuery({
    queryKey: ['customerPermission',id],
    queryFn: () => fetchingData(
 `users/customers-permissions?user=${id}`,
  ),enabled:!!id
  })

  const { data: employeePermission } = useQuery({
    queryKey: ['employeePermission',id],
    queryFn: () => fetchingData(
 `users/employees-permissions?user=${id}`,
  ),enabled:!!id
  })

  const { data: safePermission } = useQuery({
    queryKey: ['safePermission',id],
    queryFn: () => fetchingData(
 `users/safes-permissions?user=${id}`,
  ),enabled:!!id
  })

  const { data: purchasePermission } = useQuery({
    queryKey: ['purchasePermission',id],
    queryFn: () => fetchingData(
 `users/purchases-permissions?user=${id}`,
  ),enabled:!!id
  })

  const { data: salePermission } = useQuery({
    queryKey: ['salePermission',id],
    queryFn: () => fetchingData(
  `users/sales-permissions?user=${id}`,
  ),enabled:!!id
  })

  const { data: invoiceData } = useQuery({
    queryKey: ['invoiceData'],
    queryFn: () =>  fetchingData("settings/setting-invoice")
,enabled:!!id  })

const initials = getInitialName(invoiceData?.shopName);
const usersPermissions = {
usersData:userPermission?.userDataDisplay,
usersPermissions:userPermission?.userPermissionDisplay,
}

const inventoryPermissions={
products:inventoryPermission?.productsDataDisplay,
categories:inventoryPermission?.categoriesDataDisplay,
brands:inventoryPermission?.brandsDataDisplay,
units:inventoryPermission?.unitsDataDisplay,
warehouses:inventoryPermission?.wareHousesDataDisplay,
productsQty:inventoryPermission?.productsQuantitaesDataDisplay,
productsTransfer:inventoryPermission?.productsTransfersDataDisplay,
productsDamaged:inventoryPermission?.productsDamagedDataDisplay,
}

const spendablesPermissions={
typeSpendables:spendablePermission?.typeSpendablesDataDisplay,
spendables:spendablePermission?.spendablesDataDisplay,
bondsSpendables:spendablePermission?.bondsSpendablesDataDisplay,
bondsReceivables:spendablePermission?.bondsReceivablesDataDisplay,
}

const suppliersPermissions={
suppliers: supplierPermission?.suppliersDataDisplay,
suppliersPaid:supplierPermission?.suppliersPaidDisplay,
suppliersDelay:supplierPermission?.suppliersDelayedDisplay,
}

const customersPermissions={
customers: customerPermission?.customersDataDisplay,
customersPaid:customerPermission?.customersPaidDisplay,
customersDelay:customerPermission?.customersDelayedDisplay,
}

const employeesPermissions={
employees: employeePermission?.employeesDataDisplay,
withdrawals:employeePermission?.employeesWithdrawalsDataDisplay,
salaries:employeePermission?.employeesPaySalaryDataDisplay,
}

const safesPermissions={
safes : safePermission?.safesDataDisplay,
deposits : safePermission?.safesDepositsDisplay,
pulled: safePermission?.safesPulledDisplay,
transfer: safePermission?.safesTransfersDisplay,
mony :safePermission?.safesMonyDisplay,
}

const purchasesPermissions={
purchases:purchasePermission?.purchasesDataDisplay,
purchasesReturn:purchasePermission?.purchasesReturnDisplay
}

const salesPermissions={
 sales:salePermission?.salesDataDisplay,
 earnings:salePermission?.salesEarningDisplay,
 salesReturn:salePermission?.salesReturnDisplay,
}

const dashboardsPermissions={
 home:dashboardPermission?.homeDisplay,
}

const settingsPermissions={
 settingInvoice:settingPermission?.SettingInvoiceData,
 settingProfile:settingPermission?.SettingProfileData,
}

  async function handleLogout() {
    try {
     const response = await logoutUser()
     if (response?.status === 200) {
      
       toast.success('User logout Successfully')
       router.push('/login')
      }
    } catch (error) {
    }
  }

return (
   <div
      className=" h-full w-full fixed top-0 bottom-0 ring-0 left-0 
     bg-black/70 z-[99999] md:z-0 md:relative"
    >
      <div
        onClick={() => setActiveMenu(!activeMenu)}
        className="md:hidden block z-[99999] cursor-pointer p-1.5
       bg-white rounded-full absolute top-2.5 right-2.5"
      >
        <X className="h-6 w-6" />
      </div>
      <div 
        className="
          sidebar  h-full bg-gray-50 pb-2.5 fixed top-0 left-0
            border-r-1 border-gray-300"
      >
        <div className="mb-4 w-auto h-[60px]  
         flex border-b-1 border-r-1 border-gray-300 py-1.5  px-3
           items-center justify-between ">
          <h2 className="text-[14px]  
          uppercase font-medium w-fite ">{invoiceData?.shopName}</h2>
          {invoiceData?.imageUrl ? 
            <div className="relative md:inline-flex items-center
            justify-center w-11 h-11 
            bg-blue-200 rounded-full  ">
            <img
              src={invoiceData?.imageUrl}
                className="  rounded-[50%] w-full  "
                alt="sales system"
                />
            </div>
            :
            <div className="relative md:inline-flex items-center
            justify-center w-11 h-11  hidden
            overflow-hidden bg-blue-200 rounded-full">
                    <span className="font-medium   text-black">
                      {initials}
                    </span>
            </div>
          }
         
        </div>
          <div className='flex flex-col px-2 h-[548px] overflow-y-auto
           md:text-[15px]gap-0.5  text-[14px]'>
            {/* ===========HOME LINKS============== */ }
               <div className='flex justify-between  items-center 
                    p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
                  onClick={
                      ()=> setDashboardsDrop(prev => !prev)
                    }
                >
                  <span className='flex items-center gap-2'
                  >
                      < LayoutDashboardIcon className='h-[19px]' />
                    <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>
                      dashboard
                    </p>
                    </span>
                    <span >
                      {dashboardsDrop?
                      <FaCaretDown className='text-[18px] text-black 
                      font-bold bg-blue-300 p-1 rounded-full'/> 
                      :
                      <FaCaretRight className=' text-[18px] text-black font-bold
                       bg-blue-300  p-1 rounded-full'/>}
                    </span>
                 </div>
                      {dashboardsDrop && (
                        dashboardLinks?.filter( route => dashboardsPermissions[route?.key])
                        ?.map((route) => (
                        <Link
                            href={route?.link}
                            className=' flex justify-between items-center md:text-[15px]
                            text-[14px]  ml-4 py-2 px-4 rounded-lg
                            hover:bg-blue-100 capitalize font-medium'
                            key={route?.text}
                            >
                            <p>
                               {route?.text}
                            </p>
                            <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
                      )}
                      
                       {/* ===========SETTINGS LINKS============== */ }
                 <div className='flex justify-between  items-center 
                    p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
                  onClick={
                      ()=> setSettingsDrop(prev => !prev)
                    }
                >
                  <span className='flex items-center gap-2'
                  >
                      < SettingsIcon className='h-[19px]' />
                    <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>
                      settings
                    </p>
                    </span>
                    <span >
                      {settingsDrop?
                      <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
                      :
                      <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
                    </span>
                </div>
                      {settingsDrop && (
                        
                        settingsLinks?.filter( route => settingsPermissions[route?.key])
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
                      )}
            {/* ===========USER LINKS============== */ }
                      <div className='flex justify-between  items-center 
                    p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
                  onClick={
                      ()=> setUsersDrop(prev => !prev)
                    }
                >
                  <span className='flex items-center gap-2'
                  >
                      < Users2 className='h-[19px]' />
                    <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>
                      users
                    </p>
                    </span>
                    <span >
                      {usersDrop?
                      <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
                      :
                      <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
                    </span>
                      </div>
                      {usersDrop && (
                        
                        usersLinks?.filter( route => usersPermissions[route?.key]) 
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
                      )}
           {/* ===========INVENTORY LINKS============== */ }
              <div className='flex justify-between  items-center 
                    p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
          onClick={
              ()=> setInventoryDrop(prev => !prev)
            }
        >
          <span className='flex items-center gap-2'
          >
              < Settings2Icon className='h-[19px]' />
            <p
              className='md:text-[15px] text-[14px] font-medium   
              capitalize'>
              inventory
            </p>
            </span>
            <span >
              {inventoryDrop?
              <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
              :
              <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
            </span>
              </div>
             {inventoryDrop && (
                        
                        inventoryLinks?.filter( route => inventoryPermissions[route?.key])  
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
              )}
            {/* ===========SPENDABLES LINKS============== */ }
            <div className='flex justify-between  items-center 
        p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
          onClick={
              ()=> setSpendablesDrop(prev => !prev)
            }
        >
          <span className='flex items-center gap-2'
          >
              < CreditCard className='h-[19px]' />
             <p className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>

              spendables
                      </p>
            </span>
            <span className=''>
              {spendablesDrop?
              <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
              :
              <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
            </span>
            </div>
             {spendablesDrop && (
                        
                        spendablesLinks?.filter( route => spendablesPermissions[route?.key])  
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
              )}
            {/* ===========SUPPLIERS LINKS============== */ }
          <div className='flex justify-between  items-center 
        p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
          onClick={
              ()=> setSuppliersDrop(prev => !prev)
            }
        >
          <span className='flex items-center gap-2'
          >
              <Truck className='h-[19px]' />
              <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>

              suppliers
                      </p>
            </span>
            <span>
              {suppliersDrop?
              <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
              :
              <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
            </span>
            </div>
            {suppliersDrop && (
                          
                          suppliersLinks?.filter( route => suppliersPermissions[route?.key])   
                          ?.map((route) => (
                          <Link
                          href={route?.link}
                          className=' flex justify-between items-center md:text-[15px]
                          text-[14px]  ml-4 py-2 px-4 rounded-lg
                          hover:bg-blue-100 capitalize font-medium'
                          key={route?.text}
                          >
                        <p 
                          >
                        {route?.text}
                      </p>
                      <FaPlus className='text-[11px]'/>
                        </Link>
              ))
            )}
            {/* ===========CUSTOMERS LINKS============== */ }
              <div className='flex justify-between  items-center 
        p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
          onClick={
              ()=> setCustomersDrop(prev => !prev)
            }
        >
          <span className='flex items-center gap-2'
          >
              < Users2   className='h-[19px]' />
          <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>

              customers
                      </p>
            </span>
            <span className=''>
              {customersDrop?
              <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
              :
              <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
            </span>
              </div>
              {customersDrop && (
                        
                        customersLinks?.filter( route => customersPermissions[route?.key])  
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                       key={route?.text}
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
              )}
                {/* ===========EMPLOYEES LINKS============== */ }
                <div className='flex justify-between  items-center 
        p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
          onClick={
              ()=> setEmployeesDrop(prev => !prev)
            }
        >
          <span className='flex items-center gap-2'
          >
              < UserCheck className='h-[19px]' />
             <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>

              employee affairs
                      </p>
            </span>
          <span className=''>
              {employeesDrop?
              <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
              :
              <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
            </span>
                </div>
              {employeesDrop && (
                        
                        employeesLinks?.filter( route => employeesPermissions[route?.key])    
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
              )}
            {/* ===========SAFES LINKS============== */ }
            <div className='flex justify-between  items-center 
        p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
          onClick={
              ()=> setSafesDrop(prev => !prev)
            }
        >
          <span className='flex items-center gap-2'
          >
              < DollarSign className='h-[19px]' />
            <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>


              safes
                      </p>
            </span>
            <span className=''>
              {safesDrop?
              <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
              :
              <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
            </span>
            </div>
              {safesDrop && (
                        
                        safesLinks?.filter( route => safesPermissions[route?.key])   
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
              )}
            {/* ===========PURCHASES LINKS============== */ }
            <div className='flex justify-between  items-center 
        p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
          onClick={
              ()=> setPurchaseDrop(prev => !prev)
            }
        >
          <span className='flex items-center gap-2'
          >
              < ShoppingCart className='h-[19px]' />
               <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>

              purchases
                      </p>
            </span>
            <span>
              {purchaseDrop?
              <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
              :
              <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
            </span>
            </div>
            {purchaseDrop && (
                        purchasesLinks?.filter( route => purchasesPermissions[route?.key])  
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
              )}
            {/* ===========SALES LINKS============== */ }
              <div className='flex justify-between  items-center 
              p-3 gap-1.5 rounded-lg hover:bg-blue-100 cursor-pointer'
          onClick={
              ()=>
                setSaleDrop(prev => !prev)
            }
        >
          <span className='flex items-center gap-2'
          >
              <Tag className='h-[19px] ' />
            <p
                      className='md:text-[15px] text-[14px] font-medium   
                      capitalize'>

              sales
                      </p>
            </span>
            <span>
              {saleDrop?
              <FaCaretDown className='text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/> 
              :
              <FaCaretRight className=' text-[18px] text-black font-bold bg-blue-300  p-1 rounded-full'/>}
            </span>
            </div>
              {saleDrop && (
                        
                        salesLinks?.filter( route => salesPermissions[route?.key]) 
                        ?.map((route) => (
                        <Link
                        href={route?.link}
                        className=' flex justify-between items-center md:text-[15px]
                        text-[14px]  ml-4 py-2 px-4 rounded-lg
                        hover:bg-blue-100 capitalize font-medium'
                        key={route?.text}
                        >
                      <p 
                       key={route?.text}
                        >
                      {route?.text}
                    </p>
                    <FaPlus className='text-[11px]'/>
                        </Link>
                      ))
              )}
          </div>
       <button
      onClick={handleLogout}
      type="button"
      className="flex justify-center items-center absolute bottom-0.5
              gap-4 cursor-pointer text-16  p-2 mt-1 mb-2.5
                   sms:text-14     rounded-lg 
                    bg-blue-200 w-full
                   capitalize font-medium"
    >
      <p>Logout</p>
      <Power className="w-4 h-4" />
    </button>
      </div>
      </div>

  )
}


