const { response } = require('../commonValidation/validation')
const message = require('../../../constant/constants')
const { phoneNumberValidation, pvalid, validateEmail } = require('../commonValidation/validation')
class UserSignUpValidation {
    signUpPlayLoadValidation(req, res, next) {
        try {
            if (req.headers.origin == '' || req.headers.origin == undefined) {
                return res.status(401).json({ message: 'origin is missing or invalid' })
            }
            if (req.body.first_name == "" || req.body.first_name == undefined) {
                return res.status(400).json({ message: message.firstNameMissing })
            }
            if (req.body.email == "" || req.body.email == undefined) {
                return res.status(400).json({ message: message.emailMissing })
            }
            if (req.body.phone_number == "" || req.body.phone_number == undefined) {
                return res.status(400).json({ message: message.phoneNumberMissing })
            }
            if (req.role_name != 'helpdesk') {
                if (req.body.password == "" || req.body.password == undefined) {
                    return res.status(400).json({ message: message.passwordMissing })
                }
                if (!pvalid.validate(req.body.password)) {
                    return res.status(400).json({ message: message.passwordValid })
                }
            }
            if (req.body.role == "" || req.body.role == undefined) {
                return res.status(400).json({ message: message.roleMissing })
            }
            if (req.body.gender == "" || req.body.gender == undefined) {
                return res.status(400).json({ message: message.gender })
            }
            if (phoneNumberValidation(req.body.phone_number)) {
                return res.status(400).json({ message: message.phoneNumberInvalid })
            }
            if (validateEmail(req.body.email) == false) {
                return res.status(400).json({ message: message.EmailNotValid })
            }

            next()
        } catch (error) {
            return res.status(400).json(error.message)
        }
    }
    changePasswordValidation(req, res, next) {
        var body = req.body
        if (body.current_password == "" || body.current_password == undefined) {
            return res.status(400).json({ message: message.passwordMissing })
        }
        if (body.new_password == "" || body.new_password == undefined) {
            return res.status(400).json({ message: message.newPassword })
        }
        next();
    }
    resetPasswordValidation(req, res, next) {
        var body = req.body
        if (req.headers.origin == "" || req.headers.origin == undefined) {
            return res.status(400).json({ message: message.domainNotFound })
        }
        if (body.phone_number == "" || body.phone_number == undefined) {
            return res.status(400).json({ message: message.phoneNumberMissing })
        }
        if (phoneNumberValidation(body.phone_number)) {
            return res.status(400).json({ message: message.phoneNumberInvalid })
        }
        if (body.confirm_password == "" || body.confirm_password == undefined) {
            return res.status(400).json({ message: message.passwordMissing })
        }
        if (!pvalid.validate(body.confirm_password)) {
            return res.status(400).json({ message: "confirm "+message.passwordValid })
        }
        if (body.new_password == "" || body.new_password == undefined) {
            return res.status(400).json({ message: message.newPassword })
        }
        if (!pvalid.validate(body.new_password)) {
            return res.status(400).json({ message: "new  "+message.passwordValid })
        }
        console.log(body.new_password != body.confirm_password,body.new_password , body.confirm_password);
        if (body.new_password != body.confirm_password) {
            return res.status(400).json({ message: message.confirmPassword })
        }
        next();
    }

}

module.exports = new UserSignUpValidation()