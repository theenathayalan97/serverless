const express = require('express')
const route = express()
const specialtyController = require('../../controller/doctor/specialty');
const doctorFieldValidation = require('../../middleWare/validation/doctor/doctorFieldValidation');
const { VerifyToken, Authorize } = require('../../middleWare/auth')

route.post('/specialty', VerifyToken, 
Authorize(['admin', 'super_admin', 'doctor'],true),
doctorFieldValidation.specialtyMaster,
specialtyController.CreateSpecialty)


route.get('/specialty_get',VerifyToken,
Authorize(['admin', 'super_admin', 'doctor'],true),
specialtyController.GetSpecialtyByID)

route.put('/specialty_update/:id',VerifyToken,
Authorize(['admin', 'super_admin', 'doctor'],true),
doctorFieldValidation.specialtyMaster,
specialtyController.UpdateSpecialty)


route.get('/search_schedule_doctor',VerifyToken,
Authorize(['admin', 'super_admin', 'patient','helpdesk'],true),
specialtyController.SpecialtyScheduleAvailable)

module.exports = route;