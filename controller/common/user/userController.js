const UserService = require(`../../../service/common/userService`);
const tableName = require('../../../constant/dbTablesName')

class UserController {

        async SignUp(req, res) {
                var response = await UserService.signUp(req, res, tableName.users)
                return response
        }
        async PatientSignUp(req, res) {
                var response = await UserService.PatientSignUp(req, res, tableName.users)
                return response
        }
        async login(req, res) {
                var response = await UserService.login(req, res, tableName.users)
                return response
        }
        async changePassword(req, res) {
                var response = await UserService.changePassword(req, res, tableName.users)
                return response
        }
        async DoctorDocumentIsSubmitted(req, res) {
                var response = await UserService.DocumentIsSubmitted(req, res, tableName.users)
                return response
        }
        async GetUserById(req, res) {
                var response = await UserService.GetUserById(req, res, tableName.users)
                return response
        }
        async GetAllDocumentSubmittedByStatus(req, res) {
                var response = await UserService.GetAllDocumentSubmittedByStatus(req, res, tableName.users)
                return response
        }
        async GetUsersByCreatedBy(req, res) {
                var response = await UserService.GetUsersByCreatedBy(req, res, tableName.users)
                return response
        }
        async UpdateProfile(req, res) {
                var response = await UserService.UpdateProfile(req, res, tableName.users)
                return response
        }
        async GetAllUserByRole(req, res) {
                var response = await UserService.GetAllUserByRole(req, res, tableName.users)
                return response
        }
        async forgetPassword(req, res) {
                var response = await UserService.forgetPassword(req, res, tableName.users)
                return response
        }

        async getAllPatientByHelpdesk(req, res) {
                var response = await UserService.getAllPatientByHelpdesk(req, res, tableName.users)
                return response
        }

        async search(req, res) {

                var response = await UserService.search(req, res, tableName.users);
                return response

        }
        async ResetPassword(req, res) {
                var response = await UserService.ResetPassword(req, res, tableName.users);
                return response
        }
}

module.exports = new UserController()