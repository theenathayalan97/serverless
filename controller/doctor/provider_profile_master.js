'use strict'

const ProviderProfileMasterService = require('../../service/doctor/providerMasterService')
const tableNames = require('../../constant/dbTablesName')

class Provider_profile_masterController {

    async createProviderProfileMaster(req, res) {
        const result = await ProviderProfileMasterService.createProviderProfileMaster(req, res, tableNames.providerMaster)
        return result
    }

    async GetProviderProfile_Master(req, res) {
        const ProviderProfileMaster = await ProviderProfileMasterService.GetProviderProfile_Master(req, res, tableNames.providerMaster)
        return ProviderProfileMaster
    }

    async updateMultipleFields(req, res) {
        const data = await ProviderProfileMasterService.UpdateProviderProfile_Master(req, res, tableNames.providerMaster)
        return data;
    }
}
module.exports = new Provider_profile_masterController()