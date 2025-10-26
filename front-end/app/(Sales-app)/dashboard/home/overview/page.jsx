import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import Statics from '@/components/Statics'
import WarehouseProduct from '@/components/WarehouseProduct'
import WareHouseSummary from '@/components/WareHouseSummary'
import { User } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function Overview() {
  const session = await getServerUser()
 if (!session) {
  redirect('/login')
  }
  
  const permission = await fetchingData(`users/home-permissions?user=${session?.id}`)
  if(!permission?.homeDisplay){
 redirect('/authrization')
  }
  const ProductsQtyData = await fetchingData(`products/products-quantities`)
 
  const WarehousesData = await fetchingData(`warehouses`)
  WarehousesData?.sort((a, b) => a?.createdAt - b?.createdAt)
  const wareHouseOneProductData = await fetchingData(
    `products/products-quantities?limit=2&&warehouse=${WarehousesData?.[1]?._id}
    `,
  )
  const wareHouseTwoProductData = await fetchingData(
    `products/products-quantities?limit=2&&warehouse=${WarehousesData?.[0]?._id}`,
  )
    const  systemData = await fetchingData("settings/setting-invoice")


  const WareHouses = [
    {
      title: WarehousesData?.[0]?.title,
      productItem: [],
    },
    {
      title: WarehousesData?.[1]?.title,
      productItem: [],
    },
  ]

  ProductsQtyData?.forEach(({ warehouse, product }) => {
    if (warehouse?._id === WarehousesData?.[0]?._id) {
      WareHouses?.[0]?.productItem.push(product?._id)
    }
    if (warehouse?._id === WarehousesData?.[1]?._id) {
      WareHouses?.[1]?.productItem.push(product?._id)
    }
  })

  return (
    <div className="md:px-5 md:mt-5 md:mb-10 mt-3 mb-5 md:mx-4 mx-2.5 rounded-md">
       <div className=" md:p-3.5 p-2 flex items-center gap-4 font-medium bg-blue-300 rounded-lg mb-3">
        <div className=" p-2 bg-white rounded-full">
          <User className="w-5 h-5 text-blue!" />
        </div>
        <div>
          <span className="mr-1 font-medium text-white capitalize md:text-[18px] text-[15px]">
            {' '}
            Welcome back ,{session?.name}!
          </span>{' '}
          <h2 className="text-[14px] text-white opacity-90 capitalize">
            {' '}
            {session?.role} at {systemData?.shopName}
          </h2>
        </div>
      </div>
      <Statics />
      <div>
        <h2 className="font-medium text-[17px] mb-2">WareHouse Summary</h2>
        <WareHouseSummary WareHouses={WareHouses} />
      </div>
      <div className="mt-3">
        <h2 className="font-medium text-[17px]  capitalize mb-2">
          Some Available Products in {WarehousesData?.[0]?.title}
        </h2>
        <WarehouseProduct wareHouseProductData={wareHouseTwoProductData} />
      </div>
      <div className="mt-3">
        <h2 className="font-medium capitalize text-[17px]  mb-2">
          Some Available Products in {WarehousesData?.[1]?.title}
        </h2>
        <WarehouseProduct wareHouseProductData={wareHouseOneProductData} />
      </div>
    </div>
  )
}
