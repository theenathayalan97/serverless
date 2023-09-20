const serverless = require("serverless-http");
require(`dotenv`).config();
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const port = 8080
app.use(bodyParser.json())
app.use(express.json())
app.use(fileUpload())
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
app.use(express.urlencoded({ extended: true })) 
// routes
const userRoute = require(`./route/common/userRoute`);
const roleMaster = require(`./route/common/roleMaster`);
const address = require(`./route/common/addressRoute`);
const tenantRoute = require(`./route/tenant/tenant`);
const specialtyRoute=require(`./route/doctor/specialty`);
const specialtyMasterRoute=require(`./route/doctor/specialtyMaster`);
const availableRoute=require(`./route/doctor/availability`);
const providerRoute=require(`./route/doctor/provider`);
const providerMasterRoute=require(`./route/doctor/providerMaster`);
const documentRoute=require(`./route/document/document`);
const consumer = require(`./route/consumer/consumer`);

app.use('/api', userRoute)
app.use('/api', roleMaster)
app.use('/api', address)
app.use('/api', tenantRoute)
app.use('/api', specialtyRoute)
app.use('/api', specialtyMasterRoute)
app.use('/api', availableRoute)
app.use('/api', providerRoute)
app.use('/api', providerMasterRoute)
app.use('/api', documentRoute)
app.use('/api', consumer)


//postgresql connection
if (process.env.databaseConnection == 'postgres') {
    require("./dbConfig/postgresql");
}

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
var handler = serverless(app);
module.exports = {
    app, handler
};