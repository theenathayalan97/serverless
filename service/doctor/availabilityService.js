"use strict"
const databaseConnection = require(`../../utilities/databaseConfig`)
const tableNames = require(`../../constant/dbTablesName`)
const Repo = databaseConnection.Repository()
const Repository = require("../../repository/" + Repo);
const { v4: uuidv4 } = require('uuid');
const messages = require('../../constant/constants')

const dateValidation = require('../../middleWare/validation/doctor/validation_availability')


class availableServices {

    async createAvailability(req, res, tableName) {
        try {
            
            let request = req.body
            var data = {}
            data.start_Date = request.start_Date
            data.end_Date = request.end_Date
            data.schedule_starttime = request.schedule_starttime
            data.schedule_endtime = request.schedule_endtime
            data.week_of_days = request.week_of_days
            data.repeat_availability = request.repeat_availability
            data.specialty_id = request.specialty_id
            data.is_deleted = false
            data.is_active = true
            data.provider_id = req.id
            data.created_by = req.id
            data.updated_by = req.id
            data.tenant_id = req.tenant_id
            const startDateTimeString = data.start_Date + " " + data.schedule_starttime;
            const endDateTimeString = data.end_Date + " " + data.schedule_endtime;
            let userData = {
                "provider_id" : req.id,
                "specialty_id" : data.specialty_id,
                "tenant_id" : data.tenant_id 
            }
            // Doctor specialty check 
            var isSpecialty = await Repository.queryItemsByAttributesAndIN(tableNames.doctorSpecialty, userData );
            if (isSpecialty.length == 0) {
                return res.status(400).json({ message: messages.specialtyNotFound })
            }
            let inBetweenDate = 10
            let days = 30
            const now = new Date(data.start_Date)//yy-mm-dd
            const end = new Date(data.end_Date)
            const nowObj = {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate()
            };
            const endObject = {
                year: end.getFullYear(),
                month: end.getMonth() + 1,
                day: end.getDate()
            };

            // Date validation
            let startDayCheck = dateValidation.validDate(data.start_Date)
            if (startDayCheck == false) {
                return res.status(400).json({ message: messages.dateTime })
            }
            let endDayCheck = dateValidation.isDateBeforeToday(data.start_Date,data.end_Date)
            if (endDayCheck == false) {
                return res.status(400).json({ message: messages.dateTime })
            }

            // Time validation
            let startTimeCheck = dateValidation.isCurrentTimeAfter(data.schedule_starttime, now)
            if (startTimeCheck == false) {
                return res.status(400).json({ message: messages.dateTime })
            }
            let endTimeCheck = dateValidation.endTimeCheck(data.schedule_endtime, data.schedule_starttime)
            if (endTimeCheck == false) {
                return res.status(400).json({ message: messages.dateTime })
            }
            if (endTimeCheck === 1) {
                return res.status(400).json({ message: "minimum 15 mins for availability time " })
            }

            //process
            if (((endObject.day >= nowObj.day) && (endObject.month >= nowObj.month)) || (((endObject.day < nowObj.day) && (endObject.month > nowObj.month))) && (endObject.year >= nowObj.year)) {
                let count = dateValidation.dataCount(nowObj, data.end_Date, days)
                let DateCheckValidation =  await dateValidation.validDateCollection(nowObj, inBetweenDate)
                if (DateCheckValidation == false) {
                    return res.status(400).json({ message : `Start date is only in between ${inBetweenDate} days `})
                }
                if (count < 0) {
                    return res.status(400).json({ message: messages.dateTime })
                } else if (count < days) {
                    let availability = []
                    let updateData = []
                    let deleteData = []
                    if (count > 0) {
                        // create series table
                        const seriesId = await Repository.create(data, tableNames.seriesTable)
                        data.seriesId = seriesId.uuid
                        // Number of days create
                        for (let i = 0; i <= count; i++) {
                            let currentDate = new Date(nowObj.year, nowObj.month, (nowObj.day + i))
                            let currentDay
                            if ((currentDate.getDate()) < 10) {
                                currentDay = `0${currentDate.getDate()}`
                            } else {
                                currentDay = `${currentDate.getDate()}`
                            }
                            let currentMonths
                            if ((currentDate.getMonth() + 1) < 10) {
                                currentMonths = `0${currentDate.getMonth()}`
                            } else {
                                currentMonths = `${currentDate.getMonth()}`
                            }
                            let checkDate = `${currentDate.getFullYear()}-${currentMonths}-${currentDay}`
                            let getObject = {
                                "start_Date": checkDate,
                                "is_deleted": false,
                                "tenant_id": req.tenant_id

                            }
                            let getDate = await Repository.queryItemsByAttributesAndIN(tableName, getObject)
                            if (getDate.length > 0) {
                                let timeupdate = await dateValidation.checkTime(getDate, data)
                                if (timeupdate.length > 0) {
                                    let dayTimeUpdate = await dateValidation.UpdateDateTime(timeupdate)
                                    // update the date wise time 
                                    for (let j = 0; j < getDate.length; j++) {
                                        for (let k = 0; k < timeupdate.length; k++) {
                                            if (getDate[j].uuid == timeupdate[k].uuid) {
                                                var value = {}
                                                value.updated_by = req.id
                                                value.provider_id = req.id
                                                value.tenant_id = req.tenant_id
                                                value.is_deleted = true
                                                value.is_active = false
                                                value.updated_by = req.id
                                                const updateAvailable = await Repository.updateMultipleFieldsSort(getDate[j].uuid, value, tableName)
                                                deleteData.push(getDate[j].uuid)
                                            }
                                        } 
                                    }
                                    data.start_Date = checkDate
                                    data.schedule_starttime = dayTimeUpdate.startTime
                                    data.schedule_endtime = dayTimeUpdate.endTime
                                    const startsDateTimeString = checkDate + " " + timeupdate[0].schedule_starttime;
                                    const endDatesTimeString = data.end_Date + " " + timeupdate[0].schedule_endtime;
                                    data.startTimestamp = Math.round(new Date(startsDateTimeString).getTime()/1000);
                                    data.endTimestamp = Math.round(new Date(endDatesTimeString).getTime()/1000);
                                    var updateResult = await Repository.create(data, tableName)
                                    updateData.push(updateResult.uuid)
                                } else {
                                    data.start_Date = checkDate
                                    const startsDatesTimeString = checkDate + " " + data.schedule_starttime;
                                    const endsDatesTimeString = data.end_Date + " " + data.schedule_endtime;
                                    data.startTimestamp = Math.round(new Date(startsDatesTimeString).getTime()/1000);
                                    data.endTimestamp = Math.round(new Date(endsDatesTimeString).getTime()/1000);
                                    var updateResult = await Repository.create(data, tableName)
                                    updateData.push(updateResult.uuid)
                                }

                            } else {
                                data.start_Date = checkDate
                                data.startTimestamp = Math.round(new Date(startDateTimeString).getTime()/1000);
                                data.endTimestamp = Math.round(new Date(endDateTimeString).getTime()/1000);
                                const resultCreate = await Repository.create(data, tableName)
                                availability.push(resultCreate.uuid)
                            }
                        }
                        return res.status(201).json({
                            message: messages.createMessage
                        })
                    } else {
                        let getObject = {
                            "start_Date": data.start_Date,
                            "is_deleted": false,
                            "tenant_id": req.tenant_id
                        }
                        let getDate = await Repository.queryItemsByAttributesAndIN(tableName, getObject)
                        if (getDate.length > 0) {
                            let timeupdate = await dateValidation.checkTime(getDate, data)
                            if (timeupdate.length > 0) {
                                let dayTimeUpdate = await dateValidation.UpdateDateTime(timeupdate)
                                // update the date wise time 
                                for (let j = 0; j < getDate.length; j++) {
                                    for (let k = 0; k < timeupdate.length; k++) {
                                        if (getDate[j].uuid == timeupdate[k].uuid) {
                                            var value = {}
                                            value.updated_by = req.id
                                            value.provider_id = req.id
                                            value.tenant_id = req.tenant_id
                                            value.is_deleted = true
                                            value.is_active = false
                                            value.updated_by = req.id
                                            const updateAvailable = await Repository.updateMultipleFieldsSort(getDate[j].uuid, value, tableName)
                                            deleteData.push(getDate[j].uuid)
                                        }
                                    } 
                                }
                                data.schedule_starttime = dayTimeUpdate.startTime
                                data.schedule_endtime = dayTimeUpdate.endTime
                                const startsDateTimeString = data.start_Date + " " + timeupdate[0].schedule_starttime;
                                const endDatesTimeString = data.end_Date + " " + timeupdate[0].schedule_endtime;
                                data.startTimestamp = Math.round(new Date(startsDateTimeString).getTime()/1000);
                                data.endTimestamp = Math.round(new Date(endDatesTimeString).getTime()/1000);
                                var updateResult = await Repository.create(data, tableName)
                                updateData.push(updateResult.uuid)
                            } else {
                                const startsDatesTimeString = data.start_Date + " " + data.schedule_starttime;
                                const endsDatesTimeString = data.end_Date + " " + data.schedule_endtime;
                                data.startTimestamp = Math.round(new Date(startsDatesTimeString).getTime()/1000);
                                data.endTimestamp = Math.round(new Date(endsDatesTimeString).getTime()/1000);
                                var updateResult = await Repository.create(data, tableName)
                                updateData.push(updateResult.uuid)
                            }

                        } else {
                            data.start_Date = data.start_Date
                            data.startTimestamp = Math.round(new Date(startDateTimeString).getTime()/1000);
                            data.endTimestamp = Math.round(new Date(endDateTimeString).getTime()/1000);
                            const resultCreate = await Repository.create(data, tableName)
                            availability.push(resultCreate.uuid)
                        }
                        return res.status(201).json({
                            message: messages.createMessage
                        })
                    }
                } else {
                    return res.status(400).json({ message: `Doctor availability is ${days} days only` })
                }
            }else{
                return res.status(400).json({ message: messages.invalidDate })
            }
            
        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }

    }

    async GetDoctorAvailability(req, res, tableName) {
        try {
            let getObject = req.query
            // Query not send 
            if (Object.keys(req.query).length == 0) {
                getObject.tenant_id = req.tenant_id
                getObject.is_deleted = false
                if (req.role_name == 'doctors') {
                    getObject.provider_id = req.id
                } else {
                    getObject.provider_id = ''
                } 
                let getDate = await Repository.queryItemsByAttributesAndIN(tableName, getObject)
                if (getDate.length == 0) {
                    return res.status(404).json({ message: messages.doctorNotAvailable })

                }
                return res.status(200).json({ message: messages.getMessage, result: getDate })
            } else {
                if (req.role_name == 'doctor') {
                    getObject.provider_id = req.id
                } else {
                    getObject.provider_id = ''
                }
                if ((getObject.start_Date == '' || getObject.start_Date == undefined)) {
                    return res.status(404).json({ message: messages.dataInvalid })
                }

                if (getObject.end_Date == '' || getObject.end_Date == undefined) {
                    getObject.end_Date = getObject.start_Date
                }

                getObject.tenant_id = req.tenant_id
                getObject.is_deleted = false
                let getDate = await Repository.getAvailableDateWise(tableName, getObject)
                if (getDate.length == 0) {
                    return res.status(404).json({ message: messages.doctorNotAvailable })

                }
                let request = {}
                return res.status(200).json({ message: messages.getMessage, result: getDate })
            }
        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }
    }

    async UpdateDoctorAvailability(req, res, tableName) {
        try {
            let data = req.body
            const now = new Date(data.start_Date)//yy-mm-dd
            const end = new Date(data.end_Date)
            const nowObj = {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate()
            };
            const endObject = {
                year: end.getFullYear(),
                month: end.getMonth() + 1,
                day: end.getDate()
            };


            let startDayCheck = dateValidation.validDate(data.start_Date)
            if (startDayCheck == false) {
                return res.status(400).json({ message: messages.dateTime })
            }
            let endDayCheck = dateValidation.validDate(data.end_Date)
            if (endDayCheck == false) {
                return res.status(400).json({ message: messages.dateTime })
            }
            let startTimeCheck = dateValidation.isCurrentTimeAfter(data.schedule_starttime, now)
            if (startTimeCheck == false) {
                return res.status(400).json({ message: messages.dateTime })
            }
            let endTimeCheck = dateValidation.isCurrentTimeAfter(data.schedule_endtime, end)
            if (endTimeCheck == false) {
                return res.status(400).json({ message: messages.dateTime })
            }

            if (((endObject.day >= nowObj.day) && (endObject.month == nowObj.month)) || (((endObject.day < nowObj.day) && (endObject.month > nowObj.month))) && (endObject.year >= nowObj.year)) {
                // series id parse in payload 
                if (req.query.seriesId) {
                    let count = dateValidation.dataCount(nowObj, data.end_Date)
                    if (count > 0) {
                        let seriesId = data.seriesId
                        let availability = []

                        var checkCreateDate = []
                        // get series table data
                        let get_sort = await Repository.ScanItemsByAttributeValue("seriesId", seriesId, tableName)
                        if (get_sort.length == 0) {
                            return res.status(404).json({ message: "Invalid series id " })
                        }
                        for (let i = 0; i <= count; i++) {
                            let currentDate = new Date(nowObj.year, nowObj.month, (nowObj.day + i))
                            let currentMonths
                            if ((currentDate.getMonth() + 1) < 10) {
                                currentMonths = `0${currentDate.getMonth()}`
                            } else {
                                currentMonths = `${currentDate.getMonth()}`
                            }
                            let checkDate = `${currentDate.getFullYear()}-${currentMonths}-${currentDate.getDate()}`
                            checkCreateDate.push({ start_Date: checkDate })
                            for (let j = 0; j < get_sort.length; j++) {
                                if (checkDate == get_sort[j].start_Date) {

                                    get_sort[j].schedule_starttime = data.schedule_starttime
                                    get_sort[j].schedule_endtime = data.schedule_endtime
                                    get_sort[j].end_Date = data.end_Date
                                    get_sort[j].created_by = req.id
                                    get_sort[j].updated_by = req.id
                                    get_sort[j].provider_id = req.id
                                    get_sort[j].tenant_id = req.tenant_id
                                    let collections = get_sort[j]

                                    const result = await Repository.update_create(get_sort[j].uuid, collections, tableName)

                                    availability.push(result)
                                }
                            }
                        }

                        var createArray = []
                        var updateArray = []
                        let value = []
                        for (let i = 0; i < availability.length; i++) {
                            value.push(availability[i].Attributes)
                        }

                        let updateNewData = get_sort.filter(itemA => !value.some(itemB => itemB.start_Date === itemA.start_Date));

                        let createNewData = checkCreateDate.filter(itemA => !value.some(itemB => itemB.start_Date === itemA.start_Date));

                        for (let j = 0; j < createNewData.length; j++) {
                            data.start_Date = createNewData[j].start_Date
                            data.created_by = req.id
                            data.updated_by = req.id
                            data.provider_id = req.id
                            data.tenant_id = req.tenant_id
                            var createSeries = await Repository.create(data, 'Available')
                            data.uuid = createSeries.uuid
                            createArray.push(data)

                        }
                        for (let j = 0; j < updateNewData.length; j++) {

                            updateNewData[j].is_deleted == true;
                            var updateSeries = await Repository.update_create(updateNewData[j].uuid, updateNewData[j], tableName)
                            updateArray.push(updateSeries)
                        }

                        let update_data = {
                            "end_Date": data.end_Date,
                            "start_Date": data.start_Date,
                            "schedule_starttime": data.schedule_starttime,
                            "schedule_endtime": data.schedule_endtime
                        }
                        const sortTable = await Repository.update_create(seriesId, update_data, 'series_table')

                        return res.status(201).json({
                            message1: "Update doctor availability successfully",
                            message2: "series table doctor availability successfully"
                        })

                    }

                } else {
                    let id = req.query.id
                    let getDate = await Repository.ScanItemsByAttributeValue("uuid", id, tableName)
                    if (getDate.length > 0) {
                        data.updated_by = req.id
                        data.provider_id = req.id
                        data.tenant_id = req.tenant_id
                        const updateAvailable = await Repository.update_create(getDate[0].uuid, data, tableName)

                        return res.status(201).json({
                            message1: messages.updateMessage, result: updateAvailable
                        })
                    } else {
                        return res.status(404).json({ message: messages.doctorNotAvailable })
                    }

                }
            }

        }
        catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }
    }

    async DeleteDoctorAvailability(req, res, tableName) {
        try {
            const id = req.params.id
            const deleteAvailable = await Repository.deleteByID(id, tableName)
            return res.status(200).json({ message: messages.deleteMessage })
        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }
    }
}


module.exports = new availableServices()