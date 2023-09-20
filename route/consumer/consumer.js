const express = require('express')
const route = express()
const { VerifyToken, Authorize } = require('../../middleWare/auth')
const jsonValidation = require('../../middleWare/validation/commonValidation/validation')
const consumerProfileController = require('../../controller/consumer/consumer')

route.post('/consumer/:name',
    VerifyToken,
    Authorize(['admin', 'super_admin', 'patient'], true),
    jsonValidation.JsonFieldValidation('PROFILE', 'consumer'),
    consumerProfileController.CreateConsumerProfile
)

route.post('/consumer-profile-master',
    VerifyToken,
    Authorize(['super_admin'], false),
    consumerProfileController.CreateConsumerProfileMaster
)

module.exports = route 
