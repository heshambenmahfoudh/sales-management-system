//  Links
export const statusEdite = [
  { title: 'Increment' },
  {
    title: 'decrement',
  },
]

export const roleOptions = [
  {
    label: 'ADMIN',
    value: 'ADMIN',
  },
  {
    label: 'USER',
    value: 'USER',
  },
]

export const departmentOptions = [
  {
    label: 'CUSTOMER CASH',
    value: 'CUSTOMER CASH',
  },
  {
    label: 'CUSTOMER DELAY',
    value: 'CUSTOMER DELAY',
  },
]



export const wareHousesTypeOptions = [
  {
    label: 'main',
    value: 'main',
  },
  {
    label: 'branch',
    value: 'branch',
  },
]

export const className = 'flex items-center gap-1 flex-row-reverse'

export const permessionLinks = [
  {
    title: 'dashboard',
    active: false,
  },
  {
    title: 'settings',
    active: false,
  },
  {
    title: 'users',
    active: true,
  },
  {
    title: 'inventory',
    active: true,
  },
  {
    title: 'spendables',
    active: true,
  },
  {
    title: 'suppliers',
    active: true,
  },
  {
    title: 'customers',
    active: true,
  },
  {
    title: 'employees',
    active: true,
  },
  {
    title: 'safes',
    active: true,
  },
  {
    title: 'purchases',
    active: true,
  },
  {
    title: 'sales',
    active: true,
  },
]

export const usersLinks = [
  {
    text: 'users-data',
    link: '/dashboard/users',
    key: 'usersData',
  },
  {
    text: 'users-permissions',
    link: '/dashboard/users/users-permission/update',
    key: 'usersPermissions',
  },
]

export const dashboardLinks = [
  {
    text: 'overview',
    link: '/dashboard/home/overview',
    key: 'home',
  },
  {
    text: 'logs',
    link: '/dashboard/user-logs',
    key: 'home',
  },
]

export const settingsLinks = [
  {
    text: 'setting-invoice',
    link: '/dashboard/settings/setting-invoice/update',
    key: 'settingInvoice',
  },
  {
    text: 'setting-profile',
    link: '/dashboard/settings/setting-profile/update',
    key: 'settingProfile',
  },
]

export const inventoryLinks = [
  {
    text: 'products',
    link: '/dashboard/inventory/products',
    key: 'products',
  },
  {
    text: 'categories',
    link: '/dashboard/inventory/categories',
    key: 'categories',
  },
  {
    text: 'brands',
    link: '/dashboard/inventory/brands',
    key: 'brands',
  },
  {
    text: 'units',
    link: '/dashboard/inventory/units',
    key: 'units',
  },
  {
    text: 'warehouses',
    link: '/dashboard/inventory/warehouses',
    key: 'warehouses',
  },
  {
    text: 'products-quantities',
    link: '/dashboard/inventory/products-quantitaies',
    key: 'productsQty',
  },
  {
    text: 'products-transfers',
    link: '/dashboard/inventory/products-transfers',
    key: 'productsTransfer',
  },
  {
    text: 'products-damaged',
    link: '/dashboard/inventory/products-damaged',
    key: 'productsDamaged',
  },
]

export const customersLinks = [
  {
    text: 'customers-data',
    link: '/dashboard/customers',
    key: 'customers',
  },
  {
    text: 'customers-paid',
    link: '/dashboard/customers/customers-paid',
    key: 'customersPaid',
  },
  {
    text: 'customers-delayed',
    link: '/dashboard/customers/customers-delayed',
    key: 'customersDelay',
  },
]

export const employeesLinks = [
  {
    text: 'employees-data',
    link: '/dashboard/employees',
    key: 'employees',
  },
  {
    text: 'financial-withdrawals',
    link: '/dashboard/employees/financial-withdrawals',
    key: 'withdrawals',
  },
  {
    text: 'paying-salaries',
    link: '/dashboard/employees/paying-salaries',
    key: 'salaries',
  },
]

export const suppliersLinks = [
  {
    text: 'suppliers-data',
    link: '/dashboard/suppliers',
    key: 'suppliers',
  },
  {
    text: 'suppliers-paid',
    link: '/dashboard/suppliers/suppliers-paid',
    key: 'suppliersPaid',
  },
  {
    text: 'suppliers-delayed',
    link: '/dashboard/suppliers/suppliers-delayed',
    key: 'suppliersDelay',
  },
]

export const spendablesLinks = [
  {
    text: 'type-spendables',
    link: '/dashboard/spendables/type-spendables',
    key: 'typeSpendables',
  },
  {
    text: 'spendables',
    link: '/dashboard/spendables',
    key: 'spendables',
  },
  {
    text: 'bonds-spendables',
    link: '/dashboard/spendables/bonds-spendables',
    key: 'bondsSpendables',
  },
  {
    text: 'bonds-receivables',
    link: '/dashboard/spendables/bonds-receivables',
    key: 'bondsReceivables',
  },
]

export const safesLinks = [
  {
    text: 'safes-data',
    link: '/dashboard/safes',
    key: 'safes',
  },
  {
    text: 'safes-deposits',
    link: '/dashboard/safes/deposits',
    key: 'deposits',
  },
  {
    text: 'safes-pulled',
    link: '/dashboard/safes/pulled',
    key: 'pulled',
  },
  {
    text: 'safes-transfer',
    link: '/dashboard/safes/transfers',
    key: 'transfer',
  },
  {
    text: 'safes-mony',
    link: '/dashboard/safes/monies',
    key: 'mony',
  },
]

/////////////////////////////  Header of Data   /////////////////////////////

export const statusOptions = [
  {
    value: 'RETURN ALL ORDER',
    label: 'RETURN ALL ORDER',
  },
  {
    value: 'RETURN PART ORDER',
    label: 'RETURN PART ORDER',
  },
]

export const statusOptionsMini = [
  {
    _id: 'INCREMENT',
    title: 'INCREMENT',
  },
  {
    _id: 'DECREMENT',
    title: 'DECREMENT',
  },
]

export const ProSellHeader = [
  {
    text: 'title',
    size: 'w-[200px]',
  },
  {
    text: 'category',
    size: 'w-[150px]',
  },
  {
    text: 'brand',
    size: 'w-[150px]',
  },
  {
    text: 'unit',
    size: 'w-[80px]',
  },

  {
    text: 'sell price',
    size: 'min-w-[100px]',
  },
  {
    text: 'qty',
    size: 'min-w-[80px]',
  },
  {
    text: 'total Price',
    size: 'min-w-[100px]',
  },
  {
    text: 'action',
    size: 'min-w-[50px]',
  },
]

export const ProPurchaseHeader = [
  {
    text: 'sku',
    size: 'min-w-[200px]',
  },
  {
    text: 'title',
    size: 'min-w-[200px]',
  },

  {
    text: 'unit',
    size: 'min-w-[100px]',
  },
  {
    text: 'price',
    size: 'min-w-[100px]',
  },
  {
    text: 'qty',
    size: 'min-w-[100px]',
  },
  {
    text: 'total Price',
    size: 'min-w-[100px]',
  },
  {
    text: 'action',
    size: 'min-w-[80px]',
  },
]

export const purchasesLinks = [
  {
    text: 'purchases-data',
    link: '/dashboard/purchases',
    key: 'purchases',
  },
  {
    text: 'purchases-return',
    link: '/dashboard/purchases/return',
    key: 'purchasesReturn',
  },
]

export const salesLinks = [
  {
    text: 'sales-data',
    link: '/dashboard/sales',
    key: 'sales',
  },
  {
    text: 'sales-return',
    link: '/dashboard/sales/return',
    key: 'salesReturn',
  },
]

export const userColumn = [
  'imageUrl',
  'name',
  'email',
  'role',
  'createdAt',
  'updatedAt',
]

export const productColumn = [
  'imageUrl',
  'sku',
  'title',
  'brand.title',
  'category.title',
  'unit.title',
  'buyPrice',
  'salePrice',
  'createdAt',
  'updatedAt',
]

export const categoryColumn = ['title', 'brand.title', 'createdAt', 'updatedAt']

export const brandColumn = ['title', 'createdAt', 'updatedAt']

export const unitColumn = ['title', 'createdAt', 'updatedAt']

export const warehouseColumn = [
  'warehouseType',
  'title',
  'location',
  'createdAt',
  'updatedAt',
]

export const productQtyColumn = [
  'sku',
  'product.title',
  'warehouse.title',
  'date',
  'qty',
  'buyPrice',
  'salePrice',
  'createdAt',
  'updatedAt',
]

export const productTransferColumn = [
  'sku',
  'product.title',
  'unit.title',
  'qty',
  'buyPrice',
  'salePrice',
  'fromWarehouse.title',
  'toWarehouse.title',
  'date',
  'responsibleName',
  'createdAt',
  'updatedAt',
]

export const productDamagedColumn = [
  'sku',
  'product.title',
  'unit.title',
  'fromWarehouse.title',
  'date',
  'responsibleName',
  'qty',
  'createdAt',
  'updatedAt',
]

export const typeSpendableColumn = ['title', 'createdAt', 'updatedAt']

export const spendableColumn = [
  'typespendable.title',
  'mony',
  'safe.title',
  'name',
  'date',
  'createdAt',
  'updatedAt',
]

export const bondSpendableColumn = [
  'spendableTo',
  'spendableResponsible',
  'mony',
  'safe.title',
  'date',
  'createdAt',
  'updatedAt',
]

export const bondRecivableColumn = [
  'rceivableFrom',
  'receivableResponsible',
  'mony',
  'safe.title',
  'date',
  'createdAt',
  'updatedAt',
]

export const supplierColumn = [
  'name',
  'email',
  'address',
  'phone',
  'createdAt',
  'updatedAt',
]

export const supplierPaidColumn = [
  'supplierMonyId',
  'order',
  'supplier.name',
  'date',
  'totalItemsPrice',
  'pay',
  'balance',
  'createdAt',
  'updatedAt',
]

export const supplierDelayColumn = [
  'supplierMonyId',
  'order',
  'supplier.name',
  'date',
  'dateMaturity',
  'totalItemsPrice',
  'pay',
  'balance',
  'createdAt',
  'updatedAt',
]

export const custmerColumn = [
  'name',
  'email',
  'address',
  'phone',
  'createdAt',
  'updatedAt',
]

export const customerPaidColumn = [
  'customerMonyId',
  'order',
  'customer.name',
  'date',
  'totalItemsPrice',
  'pay',
  'balance',
  'createdAt',
  'updatedAt',
]

export const customerDelayColumn = [
  'customerMonyId',
  'order',
  'customer.name',
  'date',
  'dateMaturity',
  'pay',
  'balance',
  'totalItemsPrice',
  'createdAt',
  'updatedAt',
]

export const employeeColumn = [
  'imageUrl',
  'name',
  'phone',
  'address',
  'idNumber',
  'salary',
  'date',
  'createdAt',
  'updatedAt',
]

export const withdrawlsColumn = [
  'employee.name',
  'responsible',
  'mony',
  'date',
  'pay',
  'safe.title',
  'createdAt',
  'updatedAt',
]

export const paySalaryColumn = [
  'employee.name',
  'responsibleName',
  'salary',
  'netWithdrawals',
  'netSalary',
  'dueDate',
  'givingDate',
  'createdAt',
  'updatedAt',
]

export const safeColumn = ['title', 'createdAt', 'updatedAt']

export const depositeMonyColumn = [
  'safe.title',
  'mony',
  'name',
  'typeDeposite',
  'date',
  'createdAt',
  'updatedAt',
]

export const bulledMonyColumn = [
  'safe.title',
  'mony',
  'name',
  'date',
  'typePulled',
  'createdAt',
  'updatedAt',
]

export const transferMonyColumn = [
  'from_safe.title',
  'to_safe.title',
  'mony',
  'name',
  'date',
  'createdAt',
  'updatedAt',
]

export const monyColumn = ['safe.title', 'mony', 'createdAt', 'updatedAt']

export const purchaseColumn = [
  'order',
  'supplier.name',
  'product.title',
  'unit.title',
  'qty',
  'price',
  'totalPrice',
  'totalItemsPrice',
  'pay',
  'balance',
  'resposibleName',
  'date',
  'createdAt',
  'updatedAt',
]

export const purchaseReturnColumn = [
  'returnId',
  'order',
  'supplier.name',
  'product.title',
  'unit.title',
  'price',
  'qty',
  'totalPrice',
  'totalItemsPrice',
  'pay',
  'balance',
  'warehouse.title',
  'resposibleName',
  'date',
  'createdAt',
  'updatedAt',
]

export const saleCashColumn = [
  'order',
  'cashCustomer',
  'product.title',
  'unit.title',
  'qty',
  'price',
  'totalPrice',
  'totalItemsPrice',
  'pay',
  'balance',
  'resposibleName',
  'date',
  'createdAt',
  'updatedAt',
]
export const saleDelayColumn = [
  'order',
  'customer.name',
  'product.title',
  'unit.title',
  'qty',
  'price',
  'totalPrice',
  'totalItemsPrice',
  'pay',
  'balance',
  'resposibleName',
  'date',
  'createdAt',
  'updatedAt',
]



export const saleCashReturnColumn = [
  'returnId',
  'order',
  'cashCustomer',
  'product.title',
  'unit.title',
  'price',
  'qty',
  'totalPrice',
  'totalItemsPrice',
  'pay',
  'balance',
  'warehouse.title',
  'resposibleName',
  'date',
  'createdAt',
  'updatedAt',
]
export const saleDelayReturnColumn = [
  'returnId',
  'order',
  'customer.name',
  'product.title',
  'unit.title',
  'price',
  'qty',
  'totalPrice',
  'totalItemsPrice',
  'pay',
  'balance',
  'warehouse.title',
  'resposibleName',
  'date',
  'createdAt',
  'updatedAt',
]


export const carouselItems = [
  {
    image: '/images/carousel-1.jpg',
    title: 'Premium Auto Part,',
    subtitle: 'Find the best-quailty parts for all car models',
  },
  {
    image: '/images/carousel-2.jpg',
    title: 'Expert Mechanics Trusted Us,',
    subtitle: 'Supplying garages and workshops ofr ever 10 years',
  },
  {
    image: '/images/carousel-3.jpg',
    title: 'Reliable Shooping,',
    subtitle: 'Long-lasting piecec',
  },
]
