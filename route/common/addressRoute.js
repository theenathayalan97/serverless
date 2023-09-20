const express = require('express')
const route = express()
const addressMasterController = require("../../controller/address/addressMaster")
const addressController = require("../../controller/address/address")
const validation = require("../../middleWare/validation/address/address")
const { VerifyToken, Authorize } = require('../../middleWare/auth')


route.post(`/address-master`,
    VerifyToken, Authorize(['super_admin']),
    addressMasterController.CreateAddressMaster)

route.get(`/address-master/get`,
    addressMasterController.GetAddressMaster)

route.put(`/address-master/:uuid`,
    VerifyToken, Authorize(['super_admin']),
    addressMasterController.UpdateAddressMaster)


//validations
route.post(`/address`, VerifyToken,
    Authorize(['helpdesk', 'admin', 'patient', 'doctor','super_admin']),
    validation.addressValidation,
    addressController.CreateAddress)

route.get(`/address/get`,
    VerifyToken, Authorize(['helpdesk', 'admin', 'super_admin', 'patient', 'doctor']),
    addressController.SearchAddress)

route.put(`/address/:uuid`, VerifyToken,
    Authorize(['helpdesk', 'admin', 'patient', 'doctor']),
    addressController.UpdateOrDeleteAddress)

module.exports = route