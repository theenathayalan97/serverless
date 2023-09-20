const express = require('express')
const route = express()
const SuperAdminController = require('../../controller/superAdmin/superAdmin.controller');
const UserController = require('../../controller/common/user/userController');
const AdminController = require('../../controller/common/admin/admin.controller');
const UserSignUpValidation = require('../../middleWare/validation/user/userSignupValdiation')
const AdminSignUpValidation = require('../../middleWare/validation/superAdmin/superAdminValdiation')
const { VerifyToken, Authorize } = require('../../middleWare/auth');
const userController = require('../../controller/common/user/userController');
//routes
route.post(`/super-admin-signup`, AdminSignUpValidation.AdminSignUpPlayLoadValidation, SuperAdminController.SuperAdminSignUp);
route.post(`/super-admin-login`, SuperAdminController.SuperAdminLogin);
route.post(`/signup`, VerifyToken, Authorize(['admin', 'super_admin', 'helpdesk'], true), UserSignUpValidation.signUpPlayLoadValidation, UserController.SignUp);
route.post(`/patient-signup`, UserSignUpValidation.signUpPlayLoadValidation, UserController.PatientSignUp);
route.post(`/login`, UserController.login);
route.put(`/change-password`, VerifyToken, Authorize(['admin', 'super_admin', 'helpdesk','patient','doctor'], true), UserSignUpValidation.changePasswordValidation, UserController.changePassword);
route.put(`/approve-doctor`, VerifyToken, Authorize(['admin', 'super_admin',], true), AdminController.ApproveDoctorDocument);
route.put(`/document-submitted`, VerifyToken, Authorize(['doctor'], true), UserController.DoctorDocumentIsSubmitted);
route.get(`/get-user`, VerifyToken, Authorize(['admin', 'super_admin', 'helpdesk', 'super_admin', 'doctor'], true), UserController.GetUserById);
route.get(`/get-all-document-submitted`, VerifyToken, Authorize(['admin', 'super_admin'], true), UserController.GetAllDocumentSubmittedByStatus);
route.get(`/get-users-by-created-by`, VerifyToken, Authorize(['helpdesk', 'admin', 'super_admin'], true), UserController.GetUsersByCreatedBy);
route.put(`/update-profile`, VerifyToken, Authorize(['helpdesk', 'admin', 'super_admin', 'patient', 'doctor'], true), UserController.UpdateProfile);
route.get(`/get-by-role`, VerifyToken, Authorize(['helpdesk', 'admin', 'super_admin', 'patient', 'doctor'], true), UserController.GetAllUserByRole);
route.get(`/get-patient-by-Helpdesk`, VerifyToken, Authorize(['helpdesk', 'admin', 'super_admin'], true), UserController.getAllPatientByHelpdesk);
route.get(`/forget-password`, userController.forgetPassword)
route.get('/search',VerifyToken,Authorize(['helpdesk']),UserController.search)
route.put('/reset_password',UserSignUpValidation.resetPasswordValidation,UserController.ResetPassword)
module.exports = route