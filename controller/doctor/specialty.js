'use strict';
const specialty = require(`../../service/doctor/specialtyService`);
const tableNames = require('../../constant/dbTablesName')



class specialtyController {

    // create specialty
    async CreateSpecialty(req, res) {
        const specialtyUpdate = await specialty.CreateSpecialty(req, res,tableNames.doctorSpecialty);
        return specialtyUpdate

    };


    //UpdateSpecialty
    async UpdateSpecialty(req, res) {
        const specialtyUpdate = await specialty.UpdateSpecialty(req, res,tableNames.doctorSpecialty);
        return specialtyUpdate

    };


    //GetSpecialtyByID
    async GetSpecialtyByID(req, res) {

        let specialty_get = await specialty.GetSpecialtyByID(req, res, tableNames.doctorSpecialty)
        return specialty_get
    };

    async SpecialtyScheduleAvailable(req, res) {

        let specialty_get = await specialty.SpecialtyScheduleAvailable(req, res, tableNames.available)
        return specialty_get
    };

}

module.exports = new specialtyController()
