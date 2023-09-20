const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require('../../repository/' + Repo);
const message = require('../../constant/constants')
const tableNames = require('../../constant/dbTablesName')


class AdminService {
    //to approve doctor by document details
    async ApproveDoctorByDocument(req, res, tableName) {

        try {
            var { resubmit, doctor_phone_number } = req.query
            var data={}
            data.phone_number= doctor_phone_number
            data.tenant_id= req.tenant_id
            var checkUser = await Repository.queryItemsByAttributesAndIN(tableName,data);
            //check user with correct phone no and tenant id
            if (checkUser.length == 0) {
                return res.status(400).json({status:message.failed, message: message.doctorNotFound })
            }
            var key = { 'uuid': checkUser[0].role }
            var isRole = await Repository.GetOne(key, tableNames.roleMaster);
            if (isRole.role_name != 'doctor') {
                return res.status(400).json({ status:message.failed,message: message.doctorNotFound })
            }
            //if resubmit is true need to resubmit the document for doctor
            if (resubmit == "true") {
                let data = {}
                data.verified = true
                data.resubmitted = false
                var Key = {
                    'uuid': checkUser[0].uuid,
                };
                await Repository.updateMultipleFields(Key, data, tableName)
                return res.status(200).json({status:message.success, message: message.approveMessage })
            }
            if (resubmit == "false") {
                let data = {}
                data.verified = false
                data.resubmitted = true
                var key1 = {
                    'uuid': checkUser[0].uuid,
                };
                await Repository.updateMultipleFields(key1, data, tableName)
                return res.status(200).json({ status:message.success,message: message.rejectMessage })
            }

        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, error: error.message })
        }
    }
}

module.exports = new AdminService()