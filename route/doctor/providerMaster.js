const express = require('express')
const route = express()
const doctorAvailable = require('../../controller/doctor/provider_profile_master');
const doctorFieldValidation = require('../../middleWare/validation/doctor/doctorFieldValidation');
const { VerifyToken, Authorize } = require('../../middleWare/auth')

route.post('/provider_master',VerifyToken,Authorize(['doctor','super_admin'],true),
doctorAvailable.createProviderProfileMaster)

route.get('/provider_master_get',VerifyToken,Authorize(['doctor','super_admin'],true),
doctorAvailable.GetProviderProfile_Master)

route.get('/provider_master_update/:id',VerifyToken,Authorize(['doctor','super_admin'],true),
doctorAvailable.updateMultipleFields)



module.exports = route 
