'use strict';
const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require("../../repository/" + Repo);
const { v4: uuidv4 } = require('uuid');
const jwtDecode = require('../../middleWare/auth');
const messages = require('../../constant/constants')
const tableNames = require('../../constant/dbTablesName')
const { getCurrentTime } = require('../../middleWare/validation/commonValidation/validation')


class specialtyController {

    async CreateSpecialty(req, res, tableName) {

        try {

            const body = req.body
            let request = {}
            request.name = body.name
            let name = {
                "name": request.name
            }
            const specialtyCheck = await Repository.queryItemsByAttributesAndIN(tableNames.specialtyMaster, name);
            if (specialtyCheck.length == 0) {
                return res.status(404).json({ message: messages.specialtyNotFound })
            }
            //set the value
            request.specialty_id = specialtyCheck[0].uuid
            request.created_by = req.id
            request.updated_by = req.id
            if (req.role_name == 'doctor') {
                request.provider_id = req.id
            } else {
                let id = {
                    "uuid": req.query.id
                }
                let user = await Repository.queryItemsByAttributesAndIN(tableNames.users, id)
                if (user.length == 0) {
                    return res.status(404).json({ message: "doctor not found" })
                }
                let query = {
                    "uuid": user[0].role
                }
                let role = await Repository.queryItemsByAttributesAndIN(tableNames.roleMaster, query)
                if (role[0].role_name != "doctor") {
                    return res.status(404).json({ message: "user not a doctor" })
                }
                request.provider_id = req.query.id
            }


            request.is_deleted = false
            request.tenant_id = req.tenant_id
            let value = {
                "name": request.name,
                "provider_id": request.provider_id,
                "tenant_id": request.tenant_id
            }
            let data = await Repository.queryItemsByAttributesAndIN(tableNames.doctorSpecialty, value)
            if (data.length > 0) {
                return res.status(400).json({ message: "already user declared a specialty" })
            }
            const specialtyCreate = await Repository.create(request, tableNames.doctorSpecialty);

            //return
            return res.status(200).json({ message: messages.createMessage, result: specialtyCreate })

        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }

    };

    //UpdateSpecialty
    async UpdateSpecialty(req, res, tableName) {

        try {

            const request = req.body
            const specialtyCheck = await Repository.queryItems("name", request.name, 'specialty_master');
            if (specialtyCheck.length == 0) {
                return res.status(404).json({ message: messages.specialtyNotFound })
            }
            //set the value

            request.updated_by = req.id
            request.is_deleted = false
            request.tenant_id = hospitalResponse[0].uuid
            const id = req.params.id;
            const specialtyUpdate = await Repository.updateId(id, request, tableName);

            //return
            return res.status(200).json({ message: messages.getMessage, result: specialtyUpdate })

        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }

    };


    //GetSpecialtyByID
    async GetSpecialtyByID(req, res, tableName) {

        try {

            if (Object.keys(req.query).length == 0) {
                let tenant
                if (req.role_name == 'doctor') {
                    tenant = {
                        "tenant_id": req.tenant_id,
                        "provider_id": req.id
                    }
                } else {
                    tenant = {
                        "tenant_id": req.tenant_id
                    }
                }
                let specialtyGet = await dynamoRepository.queryItemsByAttributesAndIN(tableName, tenant)
                if (specialtyGet.length == 0) {
                    return res.status(404).json({ message: messages.specialtyNotAvailable })
                }
                return res.status(200).json({ message: messages.getMessage, result: specialtyGet })
            }


            let query = req.query

            let specialtyGet = await Repository.queryItemsByAttributesAndIN(tableName, query)
            if (specialtyGet.length == 0) {
                return res.status(404).json({ message: messages.specialtyNotAvailable })
            }
            return res.status(200).json({ message: messages.getMessage, result: specialtyGet })


        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }
    };

    //Get Special Schedule available doctor
    async SpecialtyScheduleAvailable(req, res, tableName) {
        try {
            var request = req.query
            if (request.start_Date == '' || request.start_Date == undefined) {
                return res.status(400).json({ status: messages.failed, message: 'start date missing' })
            }
            var data = {}
            data.start_Date = request.start_Date
            data.tenant_id = req.tenant_id
            data.is_active = true
            data.is_deleted = false
            if (request.specialty_id) {
                data.specialty_id = request.specialty_id
            }
            const date = new Date();
            let day = date.getDate();
            var month;
            if ((date.getMonth() + 1) < 10) {
                month = `0${date.getMonth() + 1}`
            } else {
                month = date.getMonth() + 1;
            }
            let year = date.getFullYear();
            let currentDate = `${year}-${month}-${day}`;
            //var isGreater = new Date(date1) > new Date(request.start_Date);
            var isGreaterOrEqual = new Date(request.start_Date) >= new Date(currentDate);
            if (!isGreaterOrEqual) {
                return res.status(400).json({ status: messages.failed, message: 'invalid date' })
            }
            var availability = await Repository.queryItemsByAttributesAndIN(tableName, data)
            if (availability.length == 0) {
                return res.status(200).json({ status: messages.success, message: messages.getMessage, data: [] })
            }
            if (request.schedule_starttime) {
                if (getCurrentTime() >= request.schedule_starttime) {
                    return res.status(200).json({ status: messages.failed, message: 'invalid time' })
                }
                var timeFilter = []
                for (var i = 0; i < availability.length; i++) {
                    var endTime = availability[i].schedule_endtime;
                    if (request.schedule_starttime < endTime) {
                        timeFilter.push(availability[i]);
                    }
                }
                availability = timeFilter
            }
            if (availability.length == 0) {
                return res.status(200).json({ status: messages.success, message: messages.getMessage, data: [] })
            }
            var data = {}
            data.role_name = 'doctor'
            var checkDoctor = await Repository.queryItemsByAttributesAndIN(tableNames.roleMaster, data)
            console.log(checkDoctor, 'role');
            var data = {}
            data.tenant_id = req.tenant_id
            data.role = checkDoctor[0].uuid
            var checkUser = await Repository.queryItemsByAttributesAndIN(tableNames.users, data)
            console.log(checkUser, 'user');
            // var profile = availability.map(item => ({
            //     uuid: item.provider_id,
            // }));
            //list of provider Ids         
            // let getDoctor = await Repository.backGet(tableNames.users, profile)
            if (checkUser.length == 0) {
                return res.status(200).json({ message: messages.getMessage, data: [] })
            }
            // This code iterates through the arrays a and b and compares the uuid values.
            // If a match is found, it adds an object to the result array with the desired properties (uuid, schedule_starttime, schedule_endtime, and phone_number)
            var result = [];
            if (request.gender) {
                data.gender = request.gender
                for (var j = 0; j < availability.length; j++) {
                    for (var i = 0; i < checkUser.length; i++) {
                        console.log(checkUser[i].uuid == availability[j].provider_id, checkUser[i].uuid,
                            availability[j].provider_id);
                        if (checkUser[i].uuid === availability[j].provider_id
                            && checkUser[i].verified == true
                            && checkUser[i].is_delete == false &&
                            checkUser[i].is_active == true && checkUser[i].gender == data.gender) {
                            result.push({
                                uuid: checkUser[i].uuid,
                                schedule_starttime: availability[j].schedule_starttime,
                                schedule_endtime: availability[j].schedule_endtime,
                                phone_number: checkUser[i].phone_number,
                                first_name: checkUser[i].first_name,
                                specialty_id: availability[j].specialty_id
                            });
                            break;
                        }
                    }
                }
            } else {
                for (var j = 0; j < availability.length; j++) {
                    for (var i = 0; i < checkUser.length; i++) {
                        console.log(checkUser[i].uuid == availability[j].provider_id, checkUser[i].uuid,
                            availability[j].provider_id);
                        if (checkUser[i].uuid === availability[j].provider_id
                            && checkUser[i].verified == true
                            && checkUser[i].is_delete == false &&
                            checkUser[i].is_active == true) {
                            result.push({
                                uuid: checkUser[i].uuid,
                                schedule_starttime: availability[j].schedule_starttime,
                                schedule_endtime: availability[j].schedule_endtime,
                                phone_number: checkUser[i].phone_number,
                                first_name: checkUser[i].first_name,
                                specialty_id: availability[j].specialty_id
                            });
                            break;
                        }
                    }
                }
            }
            return res.status(200).json({ status: messages.success, message: messages.getMessage, data: result })
        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, error: error.message })
        }
    };

}

module.exports = new specialtyController()
