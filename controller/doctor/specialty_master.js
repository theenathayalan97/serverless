'use strict';

const specialtyMaster = require(`../../service/doctor/specialtyMasterService`);
const tableNames = require('../../constant/dbTablesName')

class specialtyMasterController {

    async CreateSpecialtyMaster(req, res) {

        const specialtyMasterCreate = await specialtyMaster.CreateSpecialtyMaster(req, res,tableNames.specialtyMaster)
        return specialtyMasterCreate
    };

    //UpdateSpecialtyMaster
    async UpdateSpecialtyMaster(req, res) {


        const specialtyMasterUpdate = await specialtyMaster.UpdateSpecialtyMaster(req, res,tableNames.specialtyMaster);
        return specialtyMasterUpdate

    };

    //GetSpecialtyMasterByID
    async GetSpecialtyMasterByID(req, res) {
        let specialty_master_get = await specialtyMaster.GetSpecialtyMasterByID(req, res,tableNames.specialtyMaster)
        return specialty_master_get
    };

}

module.exports = new specialtyMasterController()
