const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require("../../repository/" + Repo);
const messages = require('../../constant/constants')
const table = require(`../../constant/dbTablesName`);

class ConsumerProfileController {

    async createConsumerProfile(req, res, tableName) {
        try {
            const consumerProfileMaster = await Repository.ScanItemsByAttributeValue("name", req.params.name, table.consumerProfileMaster)
            if (consumerProfileMaster.length == 0) {
                return res.status(400).json({ message: 'consumer master not found' })
            }
            const request = {}
            request.detail = req.body.detail
            request.updated_by = req.id
            request.profile_name_id = consumerProfileMaster[0].uuid
            var filter = { 
                'profile_name_id': consumerProfileMaster[0].uuid,
                'consumer_id': req.id
            }
            const consumerResponse = await Repository.queryItemsByAttributesAndIN(tableName, filter)
            if (consumerResponse.length > 0) {
                var filter = {
                    'uuid': consumerResponse[0].uuid
                }
                const updateConsumer = await Repository.updateMultipleFields(filter, request, tableName)
                const createConsumerHistory = await Repository.create(updateConsumer, "consumer_profile_history")
                return res.status(200).json({ message: messages.updateMessage })
            }

            request.detail = req.body.detail
            request.is_active = true
            request.is_delete = false
            request.consumer_id = req.id
            request.created_by = req.id
            request.updated_by = req.id
            request.tenant_id = req.tenant_id

            const result = await Repository.create(request, tableName)
            return res.status(201).json({ message: messages.createMessage })
        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }
    }

    async createConsumerProfileMaster(req, res, tableName) {
        try {
            const consumerProfileMaster = await Repository.ScanItemsByAttributeValue("name", req.params.name, tableName)
            if (consumerProfileMaster.length != 0) {
                return res.status(400).json({ message: 'name already found' })
            }
            const request = {}
            request.name = req.body.name
            request.description = req.body.description
            request.answerdocname = req.body.answerdocname
            request.doctype = req.body.doctype
            request.channels = req.body.channels
            request.updatedrequired = req.body.updatedrequired
            request.profileview = req.body.profileview
            request.questionsdocname = req.body.questionsdocname
            request.defaultrequired = req.body.defaultrequired
            request.mandatory = req.body.mandatory
            request.attachmentrequired = req.body.attachmentrequired
            request.updated_by = req.id

            const consumerProfileMasterCreate = await Repository.create(request, tableName)

            return res.status(200).json({ message: messages.createMessage })

        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }
}


module.exports = new ConsumerProfileController()

