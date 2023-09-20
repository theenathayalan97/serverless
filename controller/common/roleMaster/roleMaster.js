const UserService = require(`../../../service/common/roleMaster`);
const tableName = require('../../../constant/dbTablesName')

class RoleMasterController {
    async CreateRole(req, res) {
            var response = await UserService.createRoleService(req, res, tableName.roleMaster)
            return response
    }
    async getRoleById(req, res) {
            var response = await UserService.getRoleById(req, res, tableName.roleMaster)
            return response
    }
    async roleDeleteOrUpdate(req, res) {
            var response = await UserService.roleDeleteOrUpdate(req, res, tableName.roleMaster)
            return response
    }
    async getALlRole(req, res) {
            var response = await UserService.getALlRole(req, res, tableName.roleMaster)
            return response
    }
}

module.exports = new RoleMasterController()