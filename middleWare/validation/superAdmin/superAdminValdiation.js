const { response } = require('../commonValidation/validation')
const message = require('../../../constant/constants')
const { phoneNumberValidation, pvalid, validateEmail } = require('../commonValidation/validation')
class AdminSignUpValidation {
    AdminSignUpPlayLoadValidation(req, res, next) {
        try {
            if (req.body.first_name == "" || req.body.first_name == undefined) {
                return res.status(400).json({ message: message.firstNameMissing });
            }
            if (req.body.email == "" || req.body.email == undefined) {
                return res.status(400).json({ message: message.emailMissing });
            }
            if (req.body.phone_number == "" || req.body.phone_number == undefined) {
                return res.status(400).json({ message: message.phoneNumberMissing });
            }
            if (req.body.password == "" || req.body.password == undefined) {
                return res.status(400).json({ message: message.passwordMissing  });
            }
            if (req.body.role == "" || req.body.role == undefined) {
                return res.status(400).json({ message: message.roleMissing });
            }
            if (phoneNumberValidation(req.body.phone_number)) {
                return res.status(400).json({ message:message.phoneNumberInvalid});
            }
            if (validateEmail(req.body.email) == false) {
                return res.status(400).json({ message: message.EmailNotValid});
            }
            if (!pvalid.validate(req.body.password)) {
                return res.status(400).json({ message: message.passwordValid});
            }
            next()
        } catch (error) {
            return res.status(400).json(error.message)
        }


    }
}

module.exports = new AdminSignUpValidation()