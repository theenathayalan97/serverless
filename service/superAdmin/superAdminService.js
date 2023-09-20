const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require('../../repository/' + Repo);
const { response, pvalid } = require('../../middleWare/validation/commonValidation/validation')
const message = require('../../constant/constants')
const tableNames = require('../../constant/dbTablesName')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { jwtSign, VerifyToken } = require('../../middleWare/auth')

class SuperAdminService {
    //super Admin SignUp
    async SuperAdminSignUp(req, res, tableName) {
        try {
            var data = {}
            data.phone_number = req.body.phone_number
            data.role = req.body.role
            var isUserExits = await Repository.queryItemsByAttributesAndIN(tableName, data);
            // check user if exits or not
            if (isUserExits.length >= 1) {
                return res.status(400).json({ message: message.userExists })
            }
            //check if the role is exits or not
            var isRoleExits = await Repository.ScanItemsByAttributeValue('uuid', req.body.role, tableNames.roleMaster);
            if (isRoleExits.length == 0) {
                return res.status(400).json({ message: message.roleNotMatch })
            }
            // check if role is active or not
            if (isRoleExits[0].is_active == false) {
                return res.status(400).json({ message: message.roleInactive })
            }
            // check roleName is super_admin or not
            if (isRoleExits[0].role_name == 'super_admin') {
                try {
                    data.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                    data.is_active = true
                    data.is_delete = false
                    data.first_name=req.body.first_name
                    data.last_name=req.body.last_name
                    data.email=req.body.email
                    var superAdminCreated = await Repository.create(data, tableName);
                    var updateData = {}
                    updateData.created_by = superAdminCreated.uuid
                    updateData.updated_by = superAdminCreated.uuid
                    updateData.role = req.body.role
                    const Key = {
                        'uuid': superAdminCreated.uuid,
                    };
                    await Repository.updateMultipleFields(Key, updateData, tableName);
                    return res.status(200).json({ message: message.createMessage })
                } catch (error) {
                    //if any error it will be delete the user
                    await Repository.deleteByID(superAdminCreated.uuid, tableName);
                    return res.status(400).json({ message: error.message })
                }
            } else {
                return res.status(401).json({ message: message.roleNotMatch })
            }
        } catch (error) {
            return res.status(400).json({ message: error.message })

        }
    }
    //super Admin Login
    async SuperAdminLogin(req, res, tableName) {
        var body = req.body
        try {
            if (req.body.phone_number == "" || req.body.phone_number == undefined) {
                return res.status(400).json({ message: message.phoneNumberMissing });
            }
            if (req.body.password == "" || req.body.password == undefined) {
                return res.status(400).json({ message: message.passwordMissing  });
            }
            var isUserCheck = await Repository.ScanItemsByAttributeValue('phone_number', req.body.phone_number, tableName);
            if (isUserCheck.length == 0) {
                return res.status(400).json({ message: message.phoneNumberIncorrect })
            }
            var checkRole = await Repository.ScanItemsByAttributeValue('uuid', isUserCheck[0].role, tableNames.roleMaster);
            console.log(checkRole,'ll');
            if (checkRole.length == 0 || checkRole[0].role_name != 'super_admin') {
                return res.status(400).json({ message: message.superAdminAccess })
            }
            if (checkRole[0].is_active == false || checkRole[0].is_deleted == true) {
                return res.status(400).json({ message: message.deactivate })
            }
            // Compare passwords
            const isPasswordValid = await bcrypt.compare(body.password, isUserCheck[0].password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: message.phoneNumberIncorrect })
            }
            var key = { 'uuid': checkRole[0].uuid }
            const roleResponse = await Repository.GetOne(key, tableNames.roleMaster);
            if (roleResponse.length == 0) {
                return res.status(400).json({ message: message.roleNotMatch })
            }
            var playLoad = { id: isUserCheck[0].uuid, phone_number: isUserCheck[0].phone_number, role: isUserCheck[0].role, role_name: roleResponse.role_name }
            var lastLogin = Date.now();
            isUserCheck[0].last_login = lastLogin.toString()
            var key = { 'uuid': isUserCheck[0].uuid }
            await Repository.updateOne(key, 'last_login', isUserCheck[0].last_login, tableName);
            return res.status(200).json({ message: message.loginSuccess, token: jwtSign(playLoad, 432000), role: roleResponse.role_name })
        } catch (error) {
            return res.status(400).json({ message: error.message })

        }
    }

}

module.exports = new SuperAdminService()