const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require('../../repository/' + Repo);
const table = require(`../../constant/dbTablesName`);

async function TenantSchemaValidation(req) {
    var requestTenantProfile = {}

    if (req.body.mobile_number != undefined) {
        requestTenantProfile.mobile_number = req.body.mobile_number
    }
    if (req.body.address1 != undefined) {
        requestTenantProfile.address1 = req.body.address1
    }
    if (req.body.address2 != undefined) {
        requestTenantProfile.address2 = req.body.address2
    }
    if (req.body.address3 != undefined) {
        requestTenantProfile.address3 = req.body.address3
    }
    if (req.body.city != undefined) {
        requestTenantProfile.city = req.body.city
    }
    if (req.body.state != undefined) {
        requestTenantProfile.state = req.body.state
    }
    if (req.body.country != undefined) {
        requestTenantProfile.country = req.body.country
    }
    if (req.body.zip_code != undefined) {
        requestTenantProfile.zip_code = req.body.zip_code
    }
    if (req.body.email != undefined) {
        requestTenantProfile.email = req.body.email
    }
    if (req.body.remarks != undefined) {
        requestTenantProfile.remarks = req.body.remarks
    }
    if (req.body.logo != undefined) {
        requestTenantProfile.logo = req.body.logo
    }
    if (req.body.administrative_policies != undefined) {
        requestTenantProfile.administrative_policies = req.body.administrative_policies
    }
    if (req.body.branch != undefined) {
        requestTenantProfile.branch = req.body.branch
    }
    if (req.body.branch_code != undefined) {
        requestTenantProfile.branch_code = req.body.branch_code
    }
    if (req.body.fax_number != undefined) {
        requestTenantProfile.fax_number = req.body.fax_number
    }
    if (req.body.founder != undefined) {
        requestTenantProfile.founder = req.body.founder
    }
    if (req.body.founding_date != undefined) {
        requestTenantProfile.founding_date = req.body.founding_date
    }
    if (req.body.found_location != undefined) {
        requestTenantProfile.found_location = req.body.found_location
    }
    if (req.body.geo_lat != undefined) {
        requestTenantProfile.geo_lat = req.body.geo_lat
    }
    if (req.body.geo_lng != undefined) {
        requestTenantProfile.geo_lng = req.body.geo_lng
    }
    if (req.body.human_resource_management_policies != undefined) {
        requestTenantProfile.human_resource_management_policies = req.body.human_resource_management_policies
    }
    return requestTenantProfile
}

async function worker(tenantID) {
    const tenantJsonMaster = await Repository.GetAllItems(table.JsonMaster)
    for (var i = 0; i < tenantJsonMaster.length; i++) {
        console.log('i', i);
        tenantJsonMaster[i].tenant_id = tenantID
        Repository.create(tenantJsonMaster[i], table.tenantJsonMaster)
    }
    console.log('tenantJsonMaster', tenantJsonMaster.length, 'success');
}

module.exports = { TenantSchemaValidation, worker }