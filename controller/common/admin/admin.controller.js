const UserService = require(`../../../service/common/adminService`);
const tableName = require('../../../constant/dbTablesName')

class AdminController {


    async ApproveDoctorDocument(req, res) {
            var response = await UserService.ApproveDoctorByDocument(req, res, tableName.users)
            return response
    }
}

module.exports = new AdminController()