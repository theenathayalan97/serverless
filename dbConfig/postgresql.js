const Sequelize = require("sequelize");
require(`dotenv`).config();

const database = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.database = database;
db.user = require("../schemaPostgres/Common/User")(database, Sequelize);
db.tenant = require("../schemaPostgres/tenant/tenant")(database, Sequelize);
db.tenantProfile = require("../schemaPostgres/tenant/tenantProfile")(database, Sequelize);
db.tenantAudit = require("../schemaPostgres/tenant/tenantAudit")(database, Sequelize);
db.tenantProfileAudit = require("../schemaPostgres/tenant/tenantProfileAudit")(database, Sequelize);
db.tenantJsonMaster = require("../schemaPostgres/tenant/tenantJsonMaster")(database, Sequelize);
db.jsonMaster = require("../schemaPostgres/Master/jsonMaster")(database, Sequelize);
db.availability = require("../schemaPostgres/Doctor/DoctorAvailability")(database, Sequelize);
db.providerProfileMaster = require("../schemaPostgres/Doctor/providerProfileMaster")(database, Sequelize);
db.providerProfile = require("../schemaPostgres/Doctor/providerProfiles")(database, Sequelize);
db.specialty = require("../schemaPostgres/Doctor/specialty")(database, Sequelize);
db.specialtyMaster = require("../schemaPostgres/Doctor/specialtyMaster")(database, Sequelize);
db.historyProviderProfile = require("../schemaPostgres/history/historyProviderProfiles")(database, Sequelize);

db.database.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });
//export db
module.exports = db
