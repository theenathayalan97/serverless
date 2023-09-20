const {phoneNumberValidation} = require("../../middleWare/validation/commonValidation/validation")
async function addressSchemaValidation(req) {
    var addressResponse = {}

    if (req.body.address_type != undefined) {
        addressResponse.address_type = req.body.address_type
    }
    if (req.body.address1 != undefined) {
        addressResponse.address1 = req.body.address1
    }
    if (req.body.address2 != undefined) {
        addressResponse.address2 = req.body.address2
    }
    if (req.body.address3 != undefined) {
        addressResponse.address2 = req.body.address2
    }
    if (req.body.city != undefined) {
        addressResponse.city = req.body.city
    }
    if (req.body.state != undefined) {
        addressResponse.state = req.body.state
    }
    if (req.body.country != undefined) {
        addressResponse.country = req.body.country
    }
    if (req.body.zip_code != undefined) {
        addressResponse.zip_code = req.body.zip_code
    }
    if (phoneNumberValidation(req.body.mobile_number)!= undefined) {
        addressResponse.mobile_number = req.body.mobile_number
    }
    if (req.body.remarks != undefined) {
        addressResponse.remarks = req.body.remarks
    }
    if (req.body.email != undefined) {
        addressResponse.email = req.body.email
    }
    if (req.body.set_default != undefined) {
        addressResponse.set_default = req.body.set_default
    }
    return addressResponse
}
async function addressMasterSchemaValidation(req){
    var addressMasterResponse = {}
    if (req.body.place != undefined) {
        addressMasterResponse.place = req.body.place
    }
    if (req.body.sub_district != undefined) {
        addressMasterResponse.sub_district = req.body.sub_district
    }
    if (req.body.district != undefined) {
        addressMasterResponse.district = req.body.district
    }
    if (req.body.state != undefined) {
        addressMasterResponse.state = req.body.state
    }
    if (req.body.country != undefined) {
        addressMasterResponse.country = req.body.country
    }
    if (req.body.primary_address != undefined) {
        addressMasterResponse.primary_address = req.body.primary_address
    }
    if (req.body.is_active != undefined) {
        addressMasterResponse.is_active = req.body.is_active
    }
    if (req.body.is_deleted != undefined) {
        addressMasterResponse.is_deleted = req.body.is_deleted
    }
    return addressMasterResponse
}

module.exports = { addressSchemaValidation, addressMasterSchemaValidation }