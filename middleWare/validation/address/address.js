'use strict';
const {phoneNumberValidation} = require("../commonValidation/validation")
const message = require("../../../constant/constants")
async function addressValidation(req, res, next) {
    
    if (req.body == undefined || req.body == null) {
        return res.status(400).json({ message: "payload is empty" })
    }
    //domain
    if (req.headers.origin == '' || req.headers.origin == undefined) {
        console.log("ddd", req.query.origin);
        return res.status(400).json({ message: "domain is missing, need to sent a domain" })
    }
    if (req.body.address_type == "" || req.body.address_type == undefined) {
        return res.status(400).json({ message: "address_type is missing, need to sent a address_type" })
    }
    if (req.body.address1 == "" || req.body.address1 == undefined) {
        return res.status(400).json({ message: "address1 is missing, need to sent a address1" })
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
    if (req.body.set_default == undefined){
        return res.status(400).json({ message: "set_default is missing, need to sent a set_default" })
    }
    if (phoneNumberValidation(req.body.mobile_number)) {
        return res.status(400).json({ message:message.phoneNumberInvalid});
    }
    next();
}
module.exports = {
    addressValidation
}