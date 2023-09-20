const express = require('express')
const route = express()
const specialtyMasterController = require('../../controller/doctor/specialty_master');
const doctorFieldValidation = require('../../middleWare/validation/doctor/doctorFieldValidation');
const { VerifyToken, Authorize } = require('../../middleWare/auth')


route.post('/specialty_master', VerifyToken,
    Authorize(['admin', 'super_admin', 'doctor'],true),
    doctorFieldValidation.specialtyMaster,
    specialtyMasterController.CreateSpecialtyMaster)


route.get('/specialty_master_get', VerifyToken,
    Authorize(['admin', 'super_admin', 'doctor'],true),
    specialtyMasterController.GetSpecialtyMasterByID)

route.put('/specialty_master_update/:id', VerifyToken,
    Authorize(['admin', 'super_admin', 'doctor'],true),
    doctorFieldValidation.specialtyMaster,
    specialtyMasterController.UpdateSpecialtyMaster)


module.exports = route

