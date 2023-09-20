const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require("../../repository/" + Repo);
const { v4: uuidv4 } = require('uuid')
const messages = require('../../constant/constants')
const table = require(`../../constant/dbTablesName`);

// var client = require('http_client')
class providerProfileController {

    async createProviderProfile(req, res, tableName) {
        try {
            const providerMaster = await Repository.ScanItemsByAttributeValue("name", req.params.name, table.providerMaster)
            if (providerMaster.length == 0) {
                return res.status(400).json({ message: 'provider master not found' })
            }
            const request = {}
            request.detail = req.body.detail
            request.updated_by = req.id
            request.profile_name_id = providerMaster[0].uuid

            var filter = {
                'profile_name_id': providerMaster[0].uuid,
                'provider_id': req.id
            }
            const data = await Repository.queryItemsByAttributesAndIN(tableName, filter)
            if (data.length > 0) {
                var filter = {
                    'uuid': data[0].uuid
                }
                const updateData = await Repository.updateMultipleFields(filter, request, tableName)
                const createData = await Repository.create(updateData, "provider_profile_history")
                return res.status(200).json({ message: messages.updateMessage })
            }
            request.detail = req.body.detail
            request.is_active = true
            request.is_delete = false
            request.provider_id = req.id
            request.created_by = req.id
            request.updated_by = req.id
            request.tenant_id = req.tenant_id 

            const result = await Repository.create(request, tableName)
            return res.status(201).json({ status : "success" ,message: messages.createMessage })

        } catch (error) {
            return res.status(400).json({ status : "failure" ,message: messages.errorMessage, result: error.message })
        }
    }

    async createProviderProfileMaster(req, res, tableName) {
        try {
            console.log('provider_profile_master');
            const createProviderProfileMaster = await Repository.ScanItemsByAttributeValue("name", req.params.name, tableName)
            if (createProviderProfileMaster.length != 0) {
                return res.status(400).json({ message: 'name already found' })
            }
            const request = {}
            request.name = req.body.name
            request.description = req.body.description
            request.profileview = req.body.profileview
            request.answerdocname = req.body.answerdocname
            request.questionsdocname = req.body.questionsdocname
            request.doctype = req.body.doctype
            request.channels = req.body.channels
            request.updatedrequired = req.body.updatedrequired
            request.defaultrequired = req.body.defaultrequired
            request.mandatory = req.body.mandatory
            request.attachmentrequired = req.body.attachmentrequired
            request.updated_by = req.id

            const providerProfileMasterCreate = await Repository.create(request, tableName)

            return res.status(200).json({ message: messages.createMessage })

        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }
}


module.exports = new providerProfileController()

