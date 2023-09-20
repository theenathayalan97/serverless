const addressService = require("../../service/address/addressService")
const tableName = require("../../constant/dbTablesName")

class AddressController{
    async CreateAddress(req,res){
        const createdata = await addressService.CreateAddress(req,res, tableName.address)
        return createdata
    }
    async SearchAddress(req,res){
        const data = await addressService.SearchAddress(req,res, tableName.address)
        return data
    }
    async UpdateOrDeleteAddress(req,res){
        const data = await addressService.UpdateOrDeleteAddress(req,res, tableName.address)
        return data
    }
}
module.exports = new AddressController()