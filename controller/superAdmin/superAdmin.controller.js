const SuperAdminService = require(`../../service/superAdmin/superAdminService`);
const tableName = require('../../constant/dbTablesName')

class SuperAdminController {

    async SuperAdminSignUp(req, res) {
            var checkUser = await SuperAdminService.SuperAdminSignUp(req, res, tableName.users)
            return checkUser
    }
    async SuperAdminLogin(req, res) {
            var checkUser = await SuperAdminService.SuperAdminLogin(req, res, tableName.users)
            return checkUser
    }
}

module.exports = new SuperAdminController()