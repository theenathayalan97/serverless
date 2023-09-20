const tenantService = require(`../../service/tenant/tenant`);
const tableName = require('../../constant/dbTablesName')

class TenantController {

    async CreateTenant(req, res) {
        var tenantResponse = await tenantService.TenantCreate(req, res, tableName.tenant)
        return tenantResponse
    }

    async UpdateTenant(req, res) {
        var tenantResponse = await tenantService.UpdateTenant(req, res, tableName.tenant)
        return tenantResponse
    }

    async SearchTenant(req, res) {
        var tenantResponse = await tenantService.SearchTenant(req, res, tableName.tenant)
        return tenantResponse
    }

}

module.exports = new TenantController()