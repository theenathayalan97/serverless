'use strict';
const { phoneNumberValidation } = require('../commonValidation/validation')
const message = require('../../../constant/constants')

//TenantValidation
async function TenantValidation(req, res, next) {
    
    if (req.body == undefined || req.body == null) {
        return res.status(400).json({ message: "payload is empty" })
    }

    //domain
    if (req.body.domain == null || req.body.domain == undefined || req.body.domain.length == 0) {
        return res.status(400).json({ message: "domain is missing, need to sent a domain" })
    }

    //name
    if (req.body.name == null || req.body.name == undefined || req.body.name == '') {
        return res.status(400).json({ message: "name is missing, need to sent a name" })
    }

    next();
}

//TenantProfileValidation
async function TenantProfileValidation(req, res, next) {
    console.log('TenantProfileValidation')
    if (req == undefined || req == null) {
        return res.status(400).json({ message: "payload is empty" })
    }

    //hospital_name
    if (req.body.address1 == "" || req.body.address1 == undefined) {
        return res.status(400).json({ message: "address1 is missing, need to sent a address1" })
    }

    if (req.body.mobile_number == "" || req.body.mobile_number == undefined) {
        return res.status(400).json({ message: "mobile number is missing, need to sent a mobile_number" })
    } else {
        if (phoneNumberValidation(req.body.mobile_number)) {
            return res.status(400).json({ message: message.phoneNumberInvalid })
        }
    }

    if (req.body.city == "" || req.body.city == undefined) {
        return res.status(400).json({ message: "city is missing, need to sent a city" })
    }

    if (req.body.state == "" || req.body.state == undefined) {
        return res.status(400).json({ message: "state is missing, need to sent a state" })
    }

    if (req.body.country == "" || req.body.country == undefined) {
        return res.status(400).json({ message: "country is missing, need to sent a country" })
    }

    if (req.body.zip_code == "" || req.body.zip_code == undefined) {
        return res.status(400).json({ message: "zip_code is missing, need to sent a zip_code" })
    }

    if (req.body.email == "" || req.body.email == undefined) {
        return res.status(400).json({ message: "email is missing, need to sent a email" })
    }

    if (req.body.logo == "" || req.body.logo == undefined) {
        return res.status(400).json({ message: "logo is missing, need to sent a logo" })
    }

    next();
}

//export function
module.exports = {
    TenantValidation, TenantProfileValidation
}