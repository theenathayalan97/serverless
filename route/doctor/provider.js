const express = require('express')
const route = express()
const providerProfileController = require('../../controller/doctor/provider_Profiles');
const { VerifyToken, Authorize } = require('../../middleWare/auth')
const providerMaster = require('../../middleWare/validation/commonValidation/validation')


route.post('/provider/:name', VerifyToken,
    Authorize(['admin', 'super_admin', 'doctor'], true),
    providerMaster.JsonFieldValidation('PROFILE', 'provider'),
    providerProfileController.createProviderProfile
)

route.post('/provider-profile-master',
    VerifyToken,
    Authorize(['super_admin'], false),
    providerProfileController.CreateProviderProfileMaster
)


module.exports = route      