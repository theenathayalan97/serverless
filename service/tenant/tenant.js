const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require('../../repository/' + Repo);
const table = require(`../../constant/dbTablesName`);
const tenantValidation = require(`../../utilities/tenant/tenant`);
class TenantController {

    //TenantCreate
    async TenantCreate(req, res, tableName) {
        try {
            const filter = { 'name': req.body.name, }
            const tenantNameCheck = await Repository.queryItemsByAttributesAndIN(tableName, filter)
            if (tenantNameCheck.length != 0) {
                return res.status(400).json({ message: 'name already exists' })
            }

            for (var i = 0; i < req.body.domain.length; i++) {
                const checkTenant = await Repository.queryArray(tableName, 'domain', req.body.domain[i]);
                if (checkTenant.length > 0) {
                    return res.status(400).json({ message: 'domain already exists' })
                }
            }

            //create a tenant 
            var requestTenant = {}
            requestTenant.created_by = req.id
            requestTenant.updated_by = req.id
            requestTenant.is_deleted = false
            requestTenant.is_active = true
            requestTenant.name = req.body.name
            requestTenant.domain = req.body.domain
            const tenantCreate = await Repository.create(requestTenant, tableName)
            var requestTenantProfile = await tenantValidation.TenantSchemaValidation(req)
            //mapping tenant
            requestTenantProfile.tenant_id = tenantCreate.uuid
            //create a profile
            const profileCreate = await Repository.create(requestTenantProfile, table.tenantProfile)
            //batch update tenant json master
            tenantValidation.worker(tenantCreate.uuid)
            //return
            return res.status(201).json({ status: "success", message: 'tenant created successfully' })
        } catch (error) {
            //return
            return res.status(400).json({ message: 'something went wrong', data: error.message })
        }
    }

    //UpdateTenant
    async UpdateTenant(req, res, tableName) {
        try {

            const tenantId = req.params.tenant_id
            const filter = {
                'uuid': tenantId,
            }
            const fetchTenant = await Repository.GetOne(filter, tableName)
            if (fetchTenant == null) {
                return res.status(400).json({ message: 'tenant not found' })
            }
            if (Object.keys(req.query).length != 0) {
                if (req.query.is_active) {
                    if (req.role_name == 'super_admin') {
                        let value
                        if (req.query.is_active == 'true') {
                            value = true
                        } else if (req.query.is_active == 'false') {
                            value = false
                        }
                        const filter = {
                            'uuid': tenantId,
                        }
                        const update = {
                            'is_active': value,
                        }
                        const tenantUpdate = await Repository.updateMultipleFields(filter, update, tableName)
                        if (value == true) {
                            return res.status(200).json({ status: "success", message: 'tenant active successfully' })
                        }
                        if (value == false) {
                            return res.status(200).json({ status: "success", message: 'tenant de-active successfully' })
                        }
                    }
                }
            }

            //get the old tenant with the new tenant domain
            // Comparing the arrays and removing the same strings
            const domainName = req.body.domain.filter((element) => !fetchTenant.domain.includes(element));

            //checking new domain if already exist or not
            for (var i = 0; i < domainName.length; i++) {
                const checkTenant = await Repository.queryArray(tableName, 'domain', domainName[i]);
                if (checkTenant.length != 0) {
                    return res.status(400).json({ message: 'domain already exists' })
                }
            }

            var requestTenant = {}
            requestTenant.updated_by = req.id
            requestTenant.is_deleted = false
            requestTenant.is_active = true
            requestTenant.name = req.body.name
            requestTenant.domain = req.body.domain

            //update tenant information
            try {
                const filter = {
                    'uuid': tenantId,
                }
                const tenantUpdate = await Repository.updateMultipleFields(filter, requestTenant, tableName)
            } catch (err) {
                return res.status(400).json({ message: err.message })
            }
            try {
                const tenantAuditCreate = await Repository.create(requestTenant, table.tenantAudit)
            } catch (err) {
                return res.status(400).json({ message: err.message })
            }
            //create a profile

            var requestTenantProfile = await tenantValidation.TenantSchemaValidation(req)
            try {
                const profileAuditCreate = await Repository.create(requestTenantProfile, table.tenantProfileAudit)
            } catch (err) {
                return res.status(400).json({ message: err.message })
            }
            try {
                const Keys = {
                    'tenant_id': tenantId,
                }
                const profileUpdate = await Repository.updateMultipleFields(Keys, requestTenantProfile, table.tenantProfile)

            } catch (e) {
                return res.status(400).json({ message: e.message })
            }
            //return
            return res.status(200).json({ message: 'tenant updated successfully' })
        } catch (error) {
            //return
            return res.status(400).json({ message: 'something went wrong', data: error.message })
        }
    }

    //SearchTenant
    async SearchTenant(req, res, tableName) {
        try {
            const query = req.query
            if (Object.keys(req.query).length === 0) {
                const response = await Repository.GetAllItems(tableName)
                if (response.length == 0) {
                    return res.status(400).json({ message: 'success', data: [] })
                }
                const tenantResponse = []
                for (let i = 0; i < response.length; i++) {
                    //fetch tenant profile
                    const filter = {
                        'tenant_id': response[i].uuid,
                    }
                    const tenantProfile = await Repository.GetOne(filter, table.tenantProfile);
                    if (tenantProfile == null) {
                        return res.status(400).json({ message: 'tenant profile not found' })
                    }
                    var tenantWithProfile = {}
                    tenantWithProfile = tenantProfile
                    tenantWithProfile.uuid = response[i].uuid
                    tenantWithProfile.name = response[i].name
                    tenantWithProfile.domain = response[i].domain
                    tenantResponse.push(tenantWithProfile)
                }
                return res.status(200).json({ message: 'success', data: tenantResponse })
            } else {
                if (query.domain) {
                    const response = await Repository.queryArray(tableName, 'domain', query.domain);
                    if (response.length == 0) {
                        return res.status(200).json({ message: 'success', data: {} })
                    }
                    if (response[0].is_active == false) {
                        return res.status(400).json({ message: 'tenant de-activated contact super admin' })
                    }
                    //fetch tenant profile
                    const filter = {
                        'tenant_id': response[0].uuid,
                    }
                    const tenantProfile = await Repository.GetOne(filter, table.tenantProfile);
                    if (tenantProfile == null) {
                        return res.status(400).json({ message: 'tenant profile not found' })
                    }
                    tenantProfile.domain = response[0].domain
                    tenantProfile.name = response[0].name
                    tenantProfile.is_active = response[0].is_active
                    return res.status(200).json({ message: 'fetch tenant data successfully', data: tenantProfile })
                } else {
                    query.is_active = true
                    const response = await Repository.queryItemsByAttributesAndIN(tableName, query)
                    if (response.length == 0) {
                        return res.status(400).json({ message: 'success', data: [] })
                    }

                    const tenantResponse = []
                    for (let i = 0; i < response.length; i++) {
                        //fetch tenant profile
                        const filter = {
                            'tenant_id': response[i].uuid,
                        }
                        const tenantProfile = await Repository.GetOne(filter, table.tenantProfile);
                        if (tenantProfile == null) {
                            return res.status(400).json({ message: 'tenant profile not found' })
                        }
                        var tenantWithProfile = {}
                        tenantWithProfile = tenantProfile
                        tenantWithProfile.uuid = response[i].uuid
                        tenantWithProfile.name = response[i].name
                        tenantWithProfile.domain = response[i].domain
                        tenantWithProfile.is_active = response[i].is_active
                        tenantResponse.push(tenantWithProfile)
                    }
                    //return
                    return res.status(200).json({ message: 'fetch tenant data successfully', data: tenantResponse })
                }
            }
        } catch (error) {
            //return
            return res.status(400).json({ message: 'something went wrong', data: error.message })
        }
    }

}

module.exports = new TenantController()