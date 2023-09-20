const express = require('express')
const route = express()
const tenantController = require('../../controller/tenant/tenant');
const { VerifyToken, Authorize } = require('../../middleWare/auth');
const validation = require('../../middleWare/validation/tenant/tenant');

route.post(`/tenant_create`,
    VerifyToken, Authorize(['super_admin'], false),
    validation.TenantValidation,
    validation.TenantProfileValidation,
    tenantController.CreateTenant
);

route.put(`/tenant_update/:tenant_id`,
    VerifyToken, Authorize(['super_admin', 'admin'], false),
    validation.TenantValidation,
    validation.TenantProfileValidation,
    tenantController.UpdateTenant
);

route.get(`/tenant_search`,
    VerifyToken, Authorize(['super_admin', 'admin'], false),
    tenantController.SearchTenant
);


module.exports = route