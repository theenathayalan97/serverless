const Repository = require("../../repository/dynamodb");
const { response } = require("../../route/common/addressRoute");
const addressValidation = require(`../../utilities/address/address`);
const message = require('../../constant/constants')
const table = require("../../constant/dbTablesName")

class addressService {
    async CreateAddress(req, res, tableName) {
        try {
            const address = await addressValidation.addressSchemaValidation(req)
            console.log("addrss", address);
            address.created_by = req.id
            address.updated_by = req.id
            address.user_id = req.id
            address.tenant_id = req.tenant_id
            address.is_deleted = false
            address.is_active = true
            if(req.body.set_default == true) {
                var filter = {}
                filter.user_id = req.id
                filter.set_default = true
                const response = await Repository.queryItemsByAttributesAndIN(tableName, filter)
                if(response.length == 0){
                    const createAddress = await Repository.create(address, tableName)
                    return res.status(201).json({ message: message.createMessage })
                }else {
                    if(response.length != 0){
                        for(let i = 0; i < response.length; i++) {
                            var key = { "uuid": response[i].uuid }
                            var filter = {}
                            filter.set_default = false
                            const update = await Repository.updateMultipleFields(key, filter, tableName)
                        }
                        const createAddress = await Repository.create(address, tableName)
                        return res.status(201).json({ message: message.createMessage })
                    }
                }
            }
            const createAddress = await Repository.create(address, tableName)
            console.log("createAddress", createAddress);
            return res.status(201).json({ message: message.createMessage })
        } catch (error) {
            return res.status(400).json({ result: error.message })
        }
    }
    async SearchAddress(req, res, tableName) {
        try {
            var response
            if (req.role_name == 'admin') {
                var filter = req.query
                filter.tenant_id = req.tenant_id
                filter.is_deleted = false
                response = await Repository.queryItemsByAttributesAndIN(tableName, filter)
                if (response.length == 0) {
                    return res.status(400).json({ message: "no data found" })
                }
            }
            // super admin
            if (req.role_name == 'super_admin') {
                var filter = req.query
                filter.is_deleted = false
                response = await Repository.queryItemsByAttributesAndIN(tableName, filter)
                if (response.length == 0) {
                    return res.status(400).json({ message: "no address found" })
                }
            }
            //doctor/patient
            if (req.role_name == 'patient' || req.role_name == 'doctor') {
                var filter = req.query
                filter.user_id = req.id
                filter.tenant_id = req.tenant_id
                filter.is_deleted = false
                response = await Repository.queryItemsByAttributesAndIN(tableName, filter)
                if (response.length == 0) {
                    return res.status(400).json({ message: "no address found" })
                }
            }
            //helpdesk
            if (req.role_name == "helpdesk") {
                if (Object.keys(req.query).length != 0) {
                    var filter = req.query
                    filter.tenant_id = req.tenant_id
                    response = await Repository.queryItemsByAttributesAndIN(table.users, filter)
                    if (response.length == 0) {
                        return res.status(400).json({ message: "no address found" })
                    }
                    var data = {}
                    data.user_id = response[0].uuid
                    data.tenant_id = req.tenant_id
                    response = await Repository.queryItemsByAttributesAndIN(tableName, data)
                    if (response.length == 0) {
                        return res.status(400).json({ message: "no address found" })
                    }
                } else {
                    var filter = {}
                    filter.tenant_id = req.tenant_id
                    filter.user_id = req.id
                    response = await Repository.queryItemsByAttributesAndIN(tableName, filter)
                    if (response.length == 0) {
                        return res.status(400).json({ message: "no address found" })
                    }
                }
            }
            return res.status(200).json({ message: message.getMessage, data: response[0] })
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message }),
            };
        }
    }
    async UpdateOrDeleteAddress(req, res, tableName) {
        try {
            var response
            var address = {}
            req.params.uuid
            address.user_id = req.id
            address.tenant_id = req.tenant_id
            address.is_deleted = false
            address.is_active = true
            address = await addressValidation.addressSchemaValidation(req)
            response = await Repository.queryItemsByAttributesAndIN(tableName, address)
            if (response.length == 0) {
                return res.status(400).json({ message: "No data found" })
            }
           
            if (req.query.is_delete == 'true') {
                var request = {}
                request.is_deleted = true
                request.is_active = false
                var key = { "uuid": req.params.uuid }
                response = await Repository.updateMultipleFields(key, request, tableName)
                return res.status(200).json({ message: message.deleteMessage })
            }
            if(req.query.is_delete == 'false'){
                var request = {}
                request.is_deleted = false
                request.is_active = true
                var key = { "uuid": req.params.uuid }
                response = await Repository.updateMultipleFields(key, request, tableName)
                return res.status(200).json({ message: message.restore })
            }
            
            var key = { "uuid": req.params.uuid }
            response = await Repository.updateMultipleFields(key, address, tableName)
            try {
                const addressCreate = await Repository.create(address, table.addressHistory)
            } catch (err) {
                return res.status(400).json({ message: err.message })
            }
            return res.status(200).json({ message: message.updateMessage })

        } catch (err) {
            return res.status(400).json({ message: err.message })
        }

    }
}
module.exports = new addressService()
