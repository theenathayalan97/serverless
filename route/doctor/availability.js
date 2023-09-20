const express = require('express')
const route = express()
const doctorAvailable = require('../../controller/doctor/availability.js');
const doctorFieldValidation = require('../../middleWare/validation/doctor/doctorFieldValidation.js');
const { VerifyToken, Authorize } = require('../../middleWare/auth.js')


route.post('/doctor_available_create',VerifyToken,
Authorize(['admin', 'super_admin', 'doctor'],true),
doctorFieldValidation.availability, 
doctorAvailable.CreateDoctorAvailability)


route.get('/doctor_available_get',VerifyToken,
Authorize(['admin', 'super_admin', 'doctor'],true),
doctorAvailable.GetDoctorAvailability)


route.put('/doctor_available_update',VerifyToken, 
Authorize(['admin', 'super_admin', 'doctor'],true), 
doctorAvailable.UpdateDoctorAvailability)


route.delete('/doctor_available_delete',VerifyToken, 
Authorize(['admin', 'super_admin', 'doctor'],true),
doctorAvailable.DeleteDoctorAvailability)

module.exports = route
