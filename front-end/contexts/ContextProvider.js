'use client'
import React, { useState, useEffect, createContext } from 'react'

const StateContext = createContext()
export function ContextProvider({ children }){
  const [activeMenu, setActiveMenu] = useState(true)
  const [dashboardsDrop, setDashboardsDrop] = useState(false)
  const [settingsDrop, setSettingsDrop] = useState(false)
  const [inventoryDrop, setInventoryDrop] = useState(false)
  const [purchaseDrop, setPurchaseDrop] = useState(false)
  const [saleDrop, setSaleDrop] = useState(false)
  const [suppliersDrop, setSuppliersDrop] = useState(false)
  const [safesDrop, setSafesDrop] = useState(false)
  const [spendablesDrop, setSpendablesDrop] = useState(false)
  const [customersDrop, setCustomersDrop] = useState(false)
  const [employeesDrop, setEmployeesDrop] = useState(false)
  const [usersDrop, setUsersDrop] = useState(false)
  const [pagePermission, setPagePermission] = useState(false)
  const [selectPagePermission, setSelectPagePermission] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    window.addEventListener('resize', () => {
      window.innerWidth < 1150 ? setActiveMenu(false) : setActiveMenu(true)
    })
    return window.innerWidth < 1150 ? setActiveMenu(false) : setActiveMenu(true)
  }, [])

  return (
    <StateContext.Provider
      value={{
        activeMenu,setActiveMenu,
        settingsDrop,setSettingsDrop,
        inventoryDrop,setInventoryDrop,
        suppliersDrop,setSuppliersDrop,
        purchaseDrop,setPurchaseDrop,
        saleDrop,setSaleDrop,
        safesDrop,setSafesDrop,
        spendablesDrop,setSpendablesDrop,
        customersDrop,setCustomersDrop,
        employeesDrop,setEmployeesDrop,
        usersDrop,setUsersDrop,
        pagePermission,setPagePermission,
        dashboardsDrop,setDashboardsDrop,
        selectPagePermission,setSelectPagePermission,
        openLogin,setOpenLogin,
        isLoading,setIsLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => React.useContext(StateContext)

export default ContextProvider
