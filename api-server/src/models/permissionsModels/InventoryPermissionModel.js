import mongoose from 'mongoose'

const inventoryPermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    productsDataDisplay: { type: Boolean, default: false },
    productsDataCreate: { type: Boolean, default: false },
    productsDataUpdate: { type: Boolean, default: false },
    productsDataDelete: { type: Boolean, default: false },

    categoriesDataDisplay: { type: Boolean, default: false },
    categoriesDataCreate: { type: Boolean, default: false },
    categoriesDataUpdate: { type: Boolean, default: false },
    categoriesDataDelete: { type: Boolean, default: false },

    brandsDataDisplay: { type: Boolean, default: false },
    brandsDataCreate: { type: Boolean, default: false },
    brandsDataUpdate: { type: Boolean, default: false },
    brandsDataDelete: { type: Boolean, default: false },

    unitsDataDisplay: { type: Boolean, default: false },
    unitsDataCreate: { type: Boolean, default: false },
    unitsDataUpdate: { type: Boolean, default: false },
    unitsDataDelete: { type: Boolean, default: false },

    wareHousesDataDisplay: { type: Boolean, default: false },
    wareHousesDataCreate: { type: Boolean, default: false },
    wareHousesDataUpdate: { type: Boolean, default: false },
    wareHousesDataDelete: { type: Boolean, default: false },

    productsQuantitaesDataDisplay: { type: Boolean, default: false },
    productsQuantitaesDataCreate: { type: Boolean, default: false },
    productsQuantitaesDataDelete: { type: Boolean, default: false },

    productsTransfersDataDisplay: { type: Boolean, default: false },
    productsTransfersDataCreate: { type: Boolean, default: false },
    productsTransfersDataView: { type: Boolean, default: false },
    productsTransfersDataDelete: { type: Boolean, default: false },

    productsDamagedDataDisplay: { type: Boolean, default: false },
    productsDamagedDataCreate: { type: Boolean, default: false },
    productsDamagedDataView: { type: Boolean, default: false },
    productsDamagedDataDelete: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('InventoryPermission', inventoryPermissionSchema)
