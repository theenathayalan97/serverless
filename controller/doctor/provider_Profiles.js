const ProviderProfileService = require(`../../service/doctor/providerProfileService`);
const tableName = require('../../constant/dbTablesName')


class providerProfileController {
    // import fetch from 'node-fetch';

    async createProviderProfile(req, res) {

        const result = await ProviderProfileService.createProviderProfile(req, res,tableName.providerProfiles)
        return result;
    }

    async CreateProviderProfileMaster(req, res) {
        var createProviderProfileMaster = await ProviderProfileService.createProviderProfileMaster(req, res, tableName.providerMaster)
        return createProviderProfileMaster
    }

}
module.exports = new providerProfileController()

