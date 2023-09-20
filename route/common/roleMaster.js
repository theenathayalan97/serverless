const express = require('express')
const route = express()
const RoleMasterController = require('../../controller/common/roleMaster/roleMaster');
const { VerifyToken, Authorize } = require('../../middleWare/auth')

route.post(`/role`, VerifyToken, Authorize(['super_admin'],false), RoleMasterController.CreateRole);
route.get(`/role/:id`, RoleMasterController.getRoleById);
route.put(`/role/:id`, VerifyToken, Authorize(['super_admin'],false), RoleMasterController.roleDeleteOrUpdate);
route.get(`/get-all-role`, RoleMasterController.getALlRole);

module.exports = route