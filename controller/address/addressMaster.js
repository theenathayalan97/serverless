//const addressMasterSchema = require("../../schema/Address/addressMaster")
const addressMasterService = require("../../service/address/addressMasterService")
const tableName = require("../../constant/dbTablesName")

class addressMasterController { 
    async CreateAddressMaster(req,res){
        const createdata = await addressMasterService.CreateAddressMaster(req,res, tableName.addressMaster)
        return createdata
    }
    async GetAddressMaster(req,res){
        const data = await addressMasterService.GetAddressMaster(req,res, tableName.addressMaster)
        return data
    }
    async UpdateAddressMaster(req,res){
        const data = await addressMasterService.UpdateAddressMaster(req,res, tableName.addressMaster)
        return data
    }
}
module.exports = new addressMasterController()