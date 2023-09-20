
var passwordValidator = require('password-validator');
const axios = require('axios').default;
// Create a schema
var pvalid = new passwordValidator();


pvalid
    .is().min(8)                                    // Minimum length 8
    .is().max(20)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .has().symbols(1, ['@'])//special chart
    .is().not().oneOf(['Passw0rd', 'Password123']);

function response(res, statuscode, message,) {
    return res.status(statuscode).json(message);
}
function originMissing(req, res, next) {
    if (req.headers.origin == '' || req.headers.origin == undefined) {
        return res.status(401).json({ message: 'origin is missing or invalid' });
    }
    next()
}

function phoneNumberValidation(phone_number) {
    const phoneRegex = /^(?:\+?\d{1,3}[\s-])?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/;
    if (phone_number.length <= 9 || phone_number.length >= 11 || phoneRegex.test(phone_number) !== true) {
        return true;
    } else {
        return false;
    }
}
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function JsonFieldValidation(channelName, documentType) {

    return async function (req, res, next) {

        const tenantJsonMaster = await axios.get('https://4tvqtu25tf.execute-api.us-east-1.amazonaws.com/api/search_json?tenant_id=' + req.tenant_id + '&channel_name=' + channelName + '&document_type=' + documentType + '&document_name=' + req.params.name + '_answers')
        if (tenantJsonMaster.data.data.length == 0) {
            return res.status(400).json({ message: 'tenant json master not found' })
        }
        let key1 = Object.keys(tenantJsonMaster.data.data.detail)
        let keys2 = Object.keys(req.body.detail)
        console.log('keys1', key1, 'keys2', keys2);
        let response = key1.filter(item => !keys2.includes(item));
        if (response.length > 0) {
            return res.status(400).json({ message: 'these fields are invalid', data: response })
        }
        next();
    }
}
function getCurrentTime() {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    return currentTime;
}
module.exports = { response, phoneNumberValidation, pvalid, validateEmail, originMissing, JsonFieldValidation, getCurrentTime }



