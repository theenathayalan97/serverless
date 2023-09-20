const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require('../../repository/' + Repo);
const { response, pvalid } = require('../../middleWare/validation/commonValidation/validation')
const message = require('../../constant/constants')
const tableNames = require('../../constant/dbTablesName')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { jwtSign, VerifyToken } = require('../../middleWare/auth')
const otpGenerator = require('otp-generator')
const axios = require('axios').default;
const { profile } = require('../../constant/dbTablesName');
class UserService {

    async PatientSignUp(req, res, tableName) {

        try {
            if (req.headers.origin == "" || req.headers.origin == undefined) {
                return res.status(400).json({ message: message.domainNotFound })
            }
            const checkTenant = await Repository.queryArray('tenant', 'domain', req.headers.origin)
            if (checkTenant.length == 0) {
                return res.status(400).json({ message: message.domainNotFound })
            }
            var data = {}
            data.phone_number = req.body.phone_number
            data.tenant_id = checkTenant[0].uuid
            var isUserExits = await Repository.queryItemsByAttributesAndIN(tableName, data);
            if (isUserExits.length >= 1) {
                return res.status(400).json({ message: message.userExists });
            }
            var isRoleExits = await Repository.ScanItemsByAttributeValue('uuid', req.body.role, tableNames.roleMaster);
            if (isRoleExits.length == 0) {
                return res.status(400).json({ message: message.roleNotMatch });
            }
            if (isRoleExits[0].is_active == false) {
                return res.status(400).json({ message: message.roleInactive });
            }
            if (isRoleExits[0].role_name == 'patient') {
                try {
                    data.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                    data.is_active = true
                    data.is_delete = false
                    data.tenant_id = checkTenant[0].uuid
                    var PatientCreated = await Repository.create(data, tableName);
                    var updateData = {}
                    updateData.created_by = PatientCreated.uuid
                    updateData.updated_by = PatientCreated.uuid
                    updateData.role = req.body.role
                    const Key = {
                        'uuid': PatientCreated.uuid,
                    };
                    await Repository.updateMultipleFields(Key, updateData, tableName);
                    try {
                        var profileData = {}
                        profileData.user_id = PatientCreated.uuid
                        profileData.tenant_id = checkTenant[0].uuid
                        console.log(profileData, 'tenant_id');
                        //profile create
                        await Repository.create(profileData, tableNames.profile);
                    } catch (error) {
                        await Repository.deleteByID(PatientCreated.uuid, tableName)
                        return res.status(400).json({ message: message.errorMessage, error: error.message });
                    }
                    return res.status(201).json({ message: 'patient ' + message.createMessage })

                } catch (error) {
                    await Repository.deleteByID(PatientCreated.uuid, tableName);
                    return res.status(400).json({ message: error.message })
                }
            } else {
                return res.status(401).json({ message: message.roleNotMatch })
            }
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }
    //User Signup(admin,helpdesk,doctor)
    async signUp(req, res, tableName) {
        var body = req.body
        var data = {}
        try {
            data.phone_number = body.phone_number
            data.tenant_id = req.tenant_id
            var checkUser = await Repository.queryItemsByAttributesAndIN(tableName, data);
            if (checkUser.length > 0) {
                return res.status(400).json({ message: message.userExists })
            }
            var key = { 'uuid': body.role }
            var roleResponse = await Repository.GetOne(key, tableNames.roleMaster);
            if (!roleResponse) {
                return res.status(400).json({ message: message.roleInactive })
            }
            if (roleResponse.is_active == "false" || roleResponse.is_deleted == 'true') {
                return res.status(400).json({ message: message.roleInactive })
            }
            if (req.role_name != 'helpdesk') {
                data.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10))
            }
            data.is_active = true,
                data.first_name = body.first_name
            data.email = body.email
            data.is_delete = false
            data.created_by = req.id
            data.updated_by = req.id
            data.tenant_id = req.tenant_id
            data.role = body.role
            data.gender = body.gender
            //create patient with helpdesk uuid
            console.log(req.role_name == 'helpdesk', 'ddd');
            if (req.role_name == 'helpdesk' || req.role_name == "admin") {
                console.log(roleResponse.role_name, 'cje');
                if (roleResponse.role_name == "patient") {
                    try {
                        var password = req.headers.origin[4].toUpperCase() + 't' + '@' + data.phone_number
                        console.log(password);
                        data.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                        var helpdesk_userCreate = await Repository.create(data, tableName);
                        var profileData = {}
                        profileData.user_id = helpdesk_userCreate.uuid
                        profileData.tenant_id = req.tenant_id

                        //profile create
                        await Repository.create(profileData, tableNames.profile);
                    } catch (error) {
                        await Repository.deleteByID(helpdesk_userCreate.uuid, tableName)
                        return res.status(400).json({ message: message.message })
                    }
                    return res.status(201).json({ message: 'patient ' + message.createMessage, temporary_password: password })
                }
            }
            //admin and super admin create doctor and helpdesk
            if (req.role_name == 'admin' || req.role_name == 'super_admin') {
                if (roleResponse.role_name == "doctor") {
                    if (body.specialty_id == "" || body.specialty_id == undefined) {
                        return res.status(400).json({ message: message.specialtyMissing })
                    }
                    try {
                        data.verified = false
                        data.resubmitted = true
                        data.submitted = false
                        var doctor_userCreate = await Repository.create(data, tableName);
                        // after crate user have to create specialty using  array
                        var validSpecialties = [];
                        for (let i = 0; i < body.specialty_id.length; i++) {
                            const specialty = body.specialty_id[i];
                            try {
                                var data = {}
                                data.uuid = specialty
                                data.tenant_id = req.tenant_id
                                var isSpecialty = await Repository.queryItemsByAttributesAndIN(tableNames.specialtyMaster, data);
                                console.log(isSpecialty, 'ffected', data);
                                // var isSpecialty = await Repository.ScanItemsByAttributeValue('uuid', specialty, tableNames.specialtyMaster);
                                if (isSpecialty.length > 0) {
                                    var specialtyData = {}
                                    specialtyData.name = body.first_name
                                    specialtyData.specialty_id = specialty
                                    specialtyData.provider_id = doctor_userCreate.uuid // link uuid
                                    specialtyData.tenant_id = req.tenant_id
                                    specialtyData.created_by = req.id
                                    specialtyData.is_deleted = false
                                    specialtyData.is_active = true
                                    var specialty_created = await Repository.create(specialtyData, tableNames.doctorSpecialty);
                                    validSpecialties.push(specialty_created.uuid);
                                }
                            } catch (error) {
                                return res.status(400).json({ message: error.message })

                            }

                        };
                        //if the specialty is one is invalid we need to delete the user
                        if (validSpecialties.length == 0) {
                            await Repository.deleteByID(doctor_userCreate.uuid, tableName)
                            return res.status(400).json({ message: message.specialtyNotFound })
                        }
                        // if the user created and specialty out of 3 ,2 created and 1 in valid we need to rollback
                        if (validSpecialties.length != body.specialty_id.length) {
                            await Repository.deleteByID(doctor_userCreate.uuid, tableName)
                            await Repository.batchDelete(validSpecialties, tableNames.doctorSpecialty)
                            return res.status(400).json({ message: message.specialtyNotFound })
                        }
                        // and then create provider profile for doctor
                        var profileData = {}
                        profileData.provider_id = doctor_userCreate.uuid
                        profileData.tenant_id = req.tenant_id
                        await Repository.create(profileData, tableNames.providerProfiles);
                        //profile create
                        var profileData = {}
                        profileData.user_id = doctor_userCreate.uuid
                        profileData.tenant_id = req.tenant_id
                        await Repository.create(profileData, tableNames.profile);
                        return res.status(201).json({ message: 'doctor ' + message.createMessage })
                    } catch (error) {
                        return res.status(400).json({ message: error.message })
                    }
                    //return
                }
                // create admin and helpdesk 
                if (roleResponse.role_name == "helpdesk" || roleResponse.role_name == "admin") {
                    try {
                        var helpDesk = await Repository.create(data, tableName);
                        var profileData = {}
                        profileData.user_id = helpDesk.uuid
                        profileData.tenant_id = req.tenant_id
                        //with profile
                        await Repository.create(profileData, tableNames.profile);
                    } catch (error) {
                        await Repository.deleteByID(helpDesk.uuid, tableName)
                        return res.status(400).json({ message: error.message })
                    }
                    return res.status(201).json({ message: roleResponse.role_name+" " + message.createMessage })
                }
                return res.status(400).json({ message: message.adminSuperAdmin })
            } else {
                return res.status(400).json({ message: message.adminSuperAdmin })
            }
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    };
    //User login(admin,patient hel[desk,doctor)
    async login(req, res, tableName) {
        var body = req.body
        try {
            if (req.headers.origin == "" || req.headers.origin == undefined) {
                return res.status(400).json({ message: message.domainMissing })
            }
            var isDomain = await Repository.queryArray(tableNames.tenant, 'domain', req.headers.origin);
            if (isDomain.length == 0) {
                return res.status(400).json({ message: message.domainNotFound })
            }
            var data = {}
            data.phone_number = body.phone_number
            data.tenant_id = isDomain[0].uuid
            var user = await Repository.queryItemsByAttributesAndIN(tableName, data);
            if (user.length == 0) {
                return res.status(400).json({ message: message.phoneNumberIncorrect })
            }

            if (user[0].is_active == false || user[0].is_delete == true) {
                return res.status(400).json({ message: message.deactivate })

            }
            // Compare passwords
            const isPasswordValid = await bcrypt.compare(body.password, user[0].password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: message.phoneNumberIncorrect })
            }
            var key = { 'uuid': user[0].role }
            var roleResponse = await Repository.GetOne(key, tableNames.roleMaster);
            //check the user and password,then create token using jwt     
            var playLoad = { id: user[0].uuid, phone_number: user[0].phone_number, role: user[0].role, role_name: roleResponse.role_name, tenant_id: isDomain[0].uuid }
            var lastLogin = Date.now();
            user[0].last_login = lastLogin.toString()
            var key = { 'uuid': user[0].uuid }
            await Repository.updateOne(key, 'last_login', user[0].last_login, tableName);
            return res.status(200).json({ token: jwtSign(playLoad, 432000), role_name: roleResponse.role_name })
        } catch (error) {
            return res.status(400).json({ message: res.error, data: error.message })

        }
    };
    //changePassword
    async changePassword(req, res, tableName) {
        try {
            var body = req.body
            var data = {}
            data.phone_number = req.phone_number
            data.tenant_id = req.tenant_id
            var user = await Repository.queryItemsByAttributesAndIN(tableName, data);
            console.log(user, 'userCheck');
            if (user.length == 0) {
                return res.status(400).json({ message: message.passwordIncorrect })
            }

            if (user[0].is_active == false || user[0].is_delete == true) {
                return res.status(400).json({ message: message.deactivate })
            }
            // Compare passwords
            const isPasswordValid = await bcrypt.compare(body.current_password, user[0].password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                return res.status(400).json({ message: message.passwordIncorrect })
            }
            if (!pvalid.validate(body.new_password)) {
                return res.status(400).json({ message: message.passwordValid })
            }
            const isSamePasswordValid = await bcrypt.compare(body.new_password, user[0].password);
            if (isSamePasswordValid) {
                return res.status(400).json({ message: message.samePassword })
            }
            user[0].password = bcrypt.hashSync(body.new_password, bcrypt.genSaltSync(10))
            var key = { 'uuid': user[0].uuid }
            await Repository.updateOne(key, 'password', user[0].password, tableName)
            return res.status(200).json({ message: message.passwordChange })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    };
    //document is submitted by doctor and then admin will verify
    async DocumentIsSubmitted(req, res, tableName) {
        try {
            if (req.query.submitted == "" || req.query.submitted == undefined) {
                return res.status(400).json({ message: message.querySubmittedMissing })
            }
            const submitted = req.query.submitted
            if (submitted) {
                var data = {}
                data.uuid = req.id
                data.tenant_id = req.tenant_id
                var checkUser = await Repository.queryItemsByAttributesAndIN(tableName, data)
                if (checkUser.length == 0) {
                    return res.status(400).json({ message: message.doctorNotFound })
                }
                var key = { 'uuid': req.id }
                await Repository.updateOne(key, 'submitted', submitted, tableName)
                return res.status(200).json({ message: message.submitMessage })
            }

        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }
    //get user details by is
    async GetUserById(req, res, tableName) {
        try {
            var key = { 'uuid': req.id }
            var GetUser = await Repository.GetOne(key, tableName)
            var response = {}
            response.email = GetUser.email
            response.phone_number = GetUser.phone_number
            response.uuid = GetUser.uuid

            if (GetUser.length == 0) {
                res.status(400).json({ message: message.userInvalid })
            }
            if (req.role_name == 'doctor') {
                var data = {}
                data.user_id = req.id
                data.tenant_id = req.tenant_id
                var profileResponse = await Repository.queryItemsByAttributesAndIN(tableNames.providerProfiles, data)

                if (profileResponse.length == 0) {
                    return res.status(400).json({ message: message.profileNotFound })
                }
                return res.status(200).json({ data: response, profile: profileResponse[0] })
            } else {
                var data = {}
                data.user_id = req.id
                data.tenant_id = req.tenant_id
                var profileResponse = await Repository.queryItemsByAttributesAndIN(tableNames.profile, data)
                if (profileResponse.length == 0) {
                    return res.status(400).json({ message: message.profileNotFound })
                }
                const profile = profileResponse.map(item => ({
                    dob: item.dob,
                    uuid: item.uuid,
                    gender: item.gender,
                }));
                return res.status(200).json({ data: response, profile: profile[0] })
            }
        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, error: error.message })

        }

    }
    //get all data by created by
    async GetAllDocumentSubmittedByStatus(req, res, tableName) {
        try {

            if (req.query.status == undefined || req.query.status == "") {
                return res.status(400).json({ message: message.queryParamsStatusMessage })
            }
            const status = req.query.status
            console.log(status, 'check status');
            var data = {}
            data.submitted = status,
                data.verified = false
            data.tenant_id = req.tenant_id
            var checkUser = await Repository.queryItemsByAttributesAndIN(tableName, data);
            const attributes = checkUser.map(item => ({
                email: item.email,
                first_name: item.first_name,
                uuid: item.uuid,
                phone_number: item.phone_number,
            }));
            return res.status(200).json({ data: attributes })
        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, error: error.message })
        }
    }
    //get  user by who created by
    async GetUsersByCreatedBy(req, res, tableName) {
        try {
            var data = {}
            data.created_by = req.id
            data.tenant_id = req.tenant_id
            var checkUser = await Repository.queryItemsByAttributesAndIN(tableName, data);
            const attributes = checkUser.map(item => ({
                email: item.email,
                first_name: item.first_name,
                uuid: item.uuid,
                phone_number: item.phone_number,
            }));
            return res.status(200).json({ data: attributes })
        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, error: error.message })
        }
    }
    // to update admin, helpdesk,patient profile
    async UpdateProfile(req, res, tableName,) {
        try {
            var request = req.body
            var data = {}
            //set the value
            if (request.dob) {
                data.dob = request.dob
            }
            if (request.emergency_contact) {
                data.emergency_contact = request.emergency_contact
            }
            if (request.Profile_photo) {
                data.Profile_photo = request.Profile_photo
            }
            if (request.age) {
                data.age = request.age
            }
            if (request.language) {
                data.language = request.language
            }
            if (request.gender) {
                data.gender = request.gender
            }
            data.created_by = req.id
            data.updated_by = req.id
            const Key1 = {
                'user_id': req.id,
            };
            const profileUpdates = await Repository.updateMultipleFields(Key1, data, tableNames.profile);
            var userUpdate = {}

            //check phone number 

            if (req.phone_number == request.phone_number) {
                userUpdate.phone_number = request.phone_number
            }

            //check first name
            if (request.first_name) {
                userUpdate.first_name = request.first_name
            }

            //check last_name
            if (request.last_name) {
                userUpdate.first_name = request.last_name
            }

            //check email
            if (request.email) {
                userUpdate.email = request.email
            }

            //check updated_by
            if (request.updated_by) {
                userUpdate.updated_by = req.id
            }
            const Key2 = {
                'uuid': req.id,
            };
            const userProfileUpdate = await Repository.updateMultipleFields(Key2, userUpdate, tableName);
            return res.status(200).json({ message: message.updateMessage, })


        } catch (error) {
            return res.status(400).json({ message: message.errorMessage, error: error.message })
        }
    };
    // get all users by role
    async GetAllUserByRole(req, res, tableName,) {
        try {
            const roles = req.query.role
            var data = {}
            data.role = roles
            data.tenant_id = req.tenant_id
            data.verified = true
            var userByRole = await Repository.queryItemsByAttributesAndIN(tableName, data)
            const attributes = userByRole.map(item => ({
                email: item.email,
                first_name: item.first_name,
                uuid: item.uuid,
            }));
            res.status(200).json({ message: message.getMessage, data: attributes })
        } catch (err) {
            res.status(400).json({ message: message.errorMessage, error: err.message })
        }
    }
    // forgot password
    async forgetPassword(req, res, tableName) {
        const phone_number = req.query.phone_number
        try {
            if (req.headers.origin == "" || req.headers.origin == undefined) {
                return res.status(400).json({ message: message.domainMissing })
            }
            var isDomain = await Repository.queryArray(tableNames.tenant, 'domain', req.headers.origin);
            if (isDomain.length == 0) {
                return res.status(400).json({ message: message.domainNotFound })
            }
            const users = await Repository.ScanItemsByAttributeValue("phone_number", phone_number, tableNames.users)
            if (users.length == 0) {
                return res.status(400).json({ message: "user not found" })
            }
            var data = {}
            data.email = users[0].email
            data.tenant_id = isDomain[0].uuid
            const user = await Repository.queryItemsByAttributesAndIN(tableName, data)
            if (user.length == 0) {
                return res.status(400).json({ message: "user with this email and tenant id does not exist" })
            }
            const profile = await Repository.ScanItemsByAttributeValue("user_id", user[0].uuid, tableNames.profile)
            if (profile.length == 0) {
                return res.status(400).json({ message: "profile not found" })
            }

            const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true })
            var key = { 'user_id': user[0].uuid }
            var filter = {}
            filter.otp = otp
            const update = await Repository.updateMultipleFields(key, filter, tableNames.profile)
            console.log("update"), update;
            const response = await axios.post('https://na57pptmz3.execute-api.us-east-1.amazonaws.com/api/emails/send',
                {
                    model_name: "One-Time password Notification",
                    sendTo: user[0].email,
                    payload: {
                        names: user[0].first_name,
                        domains: isDomain[0].name,
                        otp: profile[0].otp
                    }
                })
            const data1 = response.data
            const CurrentTime = Date.now()
            const oneMinute = 60 * 1000
            const futureTimestamp = CurrentTime + oneMinute
            return res.status(200).json({ message: "success", otp: profile[0].otp, validity: "1 minutes", CurrentTime: Date.now(), ExpiredIn: futureTimestamp })
        } catch (err) {
            return res.status(400).json({ message: message.errorMessage, error: err.message })
        }
    }

    async search(req, res, tableName) {
        try {
            const searchTerm = req.query.searchTerm;
            const selectedFields = req.query.selectedFields ? req.query.selectedFields.split(',') : ['first_name', "last_name", 'email', 'phone_number'];
            const items = await Repository.search(tableName, selectedFields, searchTerm);
            res.status(200).json({ status: "Success", message: message.getMessage, data: items });
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: "failed", error: error.message })
        }
    }
    //reset password
    async ResetPassword(req, res, tableName) {
        try {
            var body = req.body        
            const checkTenant = await Repository.queryArray('tenant', 'domain', req.headers.origin)
            if (checkTenant.length == 0) {
                return res.status(400).json({ message: message.domainNotFound })
            }        
            var data = {}
            data.phone_number = body.phone_number
            data.tenant_id = checkTenant[0].uuid
            var user = await Repository.queryItemsByAttributesAndIN(tableName, data);
            if (user.length == 0) {
                return res.status(400).json({ message: message.userInvalid })
            }
            const Key1 = {
                'uuid': user[0].uuid,
            };
            var data={}
            data.password=body.confirm_password
            data.password = bcrypt.hashSync(body.confirm_password, bcrypt.genSaltSync(10))
            const profileUpdates = await Repository.updateMultipleFields(Key1, data, tableName);
            return res.status(200).json({ message: message.passwordChange })
        } catch (error) {

        }
    }
}

module.exports = new UserService()