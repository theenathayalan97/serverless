const tableName = require('../../constant/dbTablesName')
const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require("../../repository/" + Repo);
const { v4: uuidv4 } = require('uuid')
const jwtDecode = require('../../middleWare/auth')
const message = require('../../constant/constants')


class ProviderProfileMasterController {

    async createProviderProfileMaster(req, res, tableName) {

        try {
            var body = req.body
            var data = {}
            data.name = body.name
            var checkUser = await Repository.queryItemsByAttributesAndIN(tableName, data);
            if (checkUser.length > 0) {
                return res.status(400).json({ message: message.nameExits })
            }
            body.is_active = true
            body.is_delete = false
            body.provider_id = req.id
            body.created_by = req.id
            body.updated_by = req.id
            body.tenant_id = req.tenant_id 
            const result = await Repository.create(body, tableName)
            return res.status(201).json({ message: message.createMessage, result: result.uuid })
        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, result: error.message })
        }
    }


    async GetProviderProfile_Master(req, res, tableName) {
        try {
            const querys = req.query
            if (Object.keys(req.query).length == 0){
                const data = {
                    "provider_id": req.id
                }
                let ProviderProfileMaster = await Repository.queryItemsByAttributesAndIN(tableName, data)
                if (ProviderProfileMaster.length == 0) {
                    return res.status(404).json({ message: message.noProviderProfileMaster })
                }
                return await res.status(200).json({ message: message.getMessage, result: ProviderProfileMaster })
            }

            let ProviderProfileMaster = await Repository.queryItemsByAttributesAndIN(tableName, querys)
            if (ProviderProfileMaster.length == 0) {
                return await res.status(404).json({ message: message.NoProviderProfileMaster })
            }
            return await res.status(200).json({ message: message.getMessage, result: ProviderProfileMaster })

        } catch (error) {
            return await res.status(400).json({ message: message.errorMessage, result: error.message })
        }
    }


    async UpdateProviderProfile_Master(req, res) {

        try {

            const uuid = req.params.id
            const request = req.body
            const is_deleted = req.query.is_deleted
            if (is_deleted) {
                request.is_deleted = Boolean(is_deleted)
            } else {
                request.is_deleted = false
            }
            var key = { 'uuid': uuid }
            const data = await Repository.updateMultipleFields(key, request, tableName.providerMaster)
            return await res.status(200).json({ message: message.updateMessage, result: data })
        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, result: error.message })
         }

    }

}

module.exports = new ProviderProfileMasterController()