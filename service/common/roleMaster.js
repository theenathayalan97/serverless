const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require('../../repository/' + Repo);
const message = require('../../constant/constants')
const tableNames = require('../../constant/dbTablesName')


class RoleMasterService {
    // to create the role 
    async createRoleService(req, res, tableName) {
        try {
            if (req.body.role_name == "" || req.body.role_name == undefined) {
                return res.status(400).json({ message: message.roleMissing })
            }
            var data = {}
            data.role_name = req.body.role_name
            var role = await Repository.ScanItemsByAttributeValue('role_name', req.body.role_name, tableName)
            if (role.length != 0) {
                return res.status(400).json({ status:message.failed,message: message.roleExists })
            }
            data.is_active = true
            data.is_deleted = false
            data.created_by = req.id
            await Repository.create(data, tableName)
            return res.status(201).json({status:message.success, message: 'role ' + message.createMessage })


        } catch (error) {
            return res.status(400).json({ status:message.failed,message: message.errorMessage, error: error.message })
        }
    }
    // to get the role by id
    async getRoleById(req, res, tableName) {
        try {
            var id = req.params.id;
            var key = { 'uuid': id }
            var getRole = await Repository.GetOne(key, tableName)
            if (getRole) {
                console.log(getRole,'found',getRole.is_deleted=='true');
                if(getRole.is_active=='false'||getRole.is_deleted=='true') {
                    return res.status(400).json({ status:message.failed,message: message.roleInactive, })
                }
                const { uuid, role_name } = getRole
                var result = {}
                result.uuid = uuid
                result.role_name = role_name
                return res.status(200).json({status:message.success, message: message.getMessage, data: result })
            } else {
                return res.status(400).json({status:message.failed, message:message.roleNotMatch })
            }
        } catch (error) {
            return res.status(400).json({ status:message.failed,message: message.errorMessage, error: error.message })
        }

    };
    //to update or delete role based on the query status
    async roleDeleteOrUpdate(req, res, tableName) {
        try {
            var id = req.params.id;;
            var key = { 'uuid': id }
            var getRole = await Repository.GetOne(key, tableName)
            if (!getRole) {
                return res.status(400).json({ status:message.failed,message: message.roleNotMatch })
            }
            if (req.query.is_deleted == 'true') {
                var data = {}
                data.is_active = false
                data.is_deleted = true
                data.updated_by = req.id
                var key = { "uuid": id }
                await Repository.updateMultipleFields(key, data, tableName);
                return res.status(200).json({status:message.success, message: 'role ' + message.deleteMessage })
            }
            if (req.query.is_deleted == 'false') {
                var data = {}
                data.is_active = true
                data.is_deleted = false
                data.updated_by = req.id
                var key = { "uuid": id }
                await Repository.updateMultipleFields(key, data, tableName);
                return res.status(200).json({ status:message.success,message: 'role ' + message.activeMessage, })
            }

            if (req.body.role_name == "" || req.body.role_name == undefined) {
                return res.status(400).json({ status:message.failed,message: message.roleMissing })
            }
            var data = {}
            data.role_name = req.body.role_name
            var role = await Repository.ScanItemsByAttributeValue('role_name', req.body.role_name, tableName)
            if (role.length != 0) {
                return res.status(400).json({ status:message.failed,message: message.roleExists })
            }
            var key = { "uuid": id }
            data.updated_At = Date.now()
            data.updated_by = req.id
            const profileUpdates = await Repository.updateMultipleFields(key, data, tableName);
            return res.status(200).json({status:message.success, message: 'role '+message.updateMessage, id: profileUpdates.uuid })

        } catch (error) {
            return res.status(400).json({ status:message.failed,message: message.errorMessage, error: error.message })
        }

    };
    // to get all role
    async getALlRole(req, res, tableName) {
        try {

            var allRole = await Repository.GetAllItems(tableName)
            const response = allRole.map(item => ({
                uuid: item.uuid,
                role_name: item.role_name,
            }));
            return res.status(200).json({status:message.success, message: 'Fetched successfully', data: response })

        } catch (error) {
            return res.status(400).json({ status:message.failed,message: message.errorMessage, error: error.message })
        }

    };
}

module.exports = new RoleMasterService()