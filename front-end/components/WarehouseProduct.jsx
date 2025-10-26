import DataTable from "./DataTable"

export default async function WarehouseProduct({wareHouseProductData}) {
const productWarhouseHomeColumn = [ 
  'sku',
  'product.title',
  'warehouse.title',
  'qty'
]
  return (
   
    <div className="overflow-x-auto lg:overflow-hidden 
      rounded-lg shadow-sm bg-white "
   >

     <DataTable
               data={wareHouseProductData}
               columns={productWarhouseHomeColumn}
               isPage='home'
             />
   </div>
  )
}
