const Repository = require("../../repository/dynamodb")
const message = require('../../constant/constants')
const table = require('../../constant/dbTablesName')
const addressValidation = require(`../../utilities/address/address`);

class addressMasterService {
    async CreateAddressMaster(req, res, tableName) {
        try {
            var address = await addressValidation.addressMasterSchemaValidation(req)
            address.is_active = true
            address.is_deleted = false
            const createData = await Repository.create(address, tableName)
            return res.status(201).json({ message: message.createMessage })
        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, result: error.message })
        }
    }
    async UpdateAddressMaster(req, res, tableName) {
        try {
            var key = { "uuid": req.params.uuid }
            var getAddress = await Repository.GetOne(key, tableName)
            if (!getAddress) {
                return res.status(400).json({ message: "address not found" })
            }
            if (req.query.is_delete == 'true') {
                var data = {}
                data.is_active = false
                data.is_deleted = true
                const addressUpdates = await Repository.updateMultipleFields(key, data, tableName);
                return res.status(200).json({ message: message.updateMessage, result: addressUpdates.uuid })
            }
            if (req.query.is_update == 'true') {
                try {
                    const filter = await addressValidation.addressMasterSchemaValidation(req)
                    const addressUpdates = await Repository.updateMultipleFields(key, filter, tableName)
                    try {
                        const addressMasterCreate = await Repository.create(filter, table.addressMasterHistory)
                    } catch (err) {
                        return res.status(400).json({ message: err.message })
                    }
                    return res.status(200).json({ message: message.updateMessage, result: addressUpdates.uuid })
                } catch (err) {
                    return res.status(400).json({ message: err.message })
                }

            }
        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, error: error.message })
        }
    }
    async GetAddressMaster(req, res, tableName) {
        try {
            const query = req.query
            if (Object.keys(req.query).length == 0) {
                const response = await Repository.GetAllItems(tableName)
                if (response.length == 0) {
                    return res.status(400).json({ message: "No data found" })
                }
                return res.status(200).json({ message: message.getMessage, data: response })
            } else if (req.query.uuid) {
                var key = { "uuid": req.query.uuid }
                const get = await Repository.GetOne(key, tableName)
                if (get) {
                    get.Item
                }
                return res.status(200).json({ message: message.getMessage, data: get })
            } else if (Object.keys(req.query).length != 0) {
                const response = await Repository.queryItemsByAttributesAndIN(tableName, query)
                if (response.length == 0) {
                    return res.status(400).json({ message: "No data found" })
                }
                return res.status(200).json({ message: message.getMessage, data: response })
            }
        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, data: error.message })
        }
    }
}

module.exports = new addressMasterService()