const consumerService = require(`../../service/consumer/consumer`);
const tableName = require('../../constant/dbTablesName')

class ConsumerProfileController {

    async CreateConsumerProfile(req, res) {
        var consumerProfile = await consumerService.createConsumerProfile(req, res, tableName.consumerProfile)
        return consumerProfile
    }

    async CreateConsumerProfileMaster(req, res) {
        var consumerProfileMaster = await consumerService.createConsumerProfileMaster(req, res, tableName.consumerProfileMaster)
        return consumerProfileMaster
    }
}

module.exports = new ConsumerProfileController()