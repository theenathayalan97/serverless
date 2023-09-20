module.exports = (database, Sequelize) => {
    const tenantProfile = database.define('tenant_profile', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        tenant_id: {
            type: Sequelize.STRING
        },
        address1: {
            type: Sequelize.STRING,
        },
        address2: {
            type: Sequelize.STRING,
        },
        address3: {
            type: Sequelize.STRING,
        },
        city: {
            type: Sequelize.STRING,
        },
        state: {
            type: Sequelize.STRING,
        },
        country: {
            type: Sequelize.STRING,
        },
        zip_code: {
            type: Sequelize.STRING,
        },
        mobile_number: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        remarks: {
            type: Sequelize.STRING,
        },
        logo: {
            type: Sequelize.STRING
        },
        administrative_policies: {
            type: Sequelize.STRING
        },
        branch: {
            type: Sequelize.STRING
        },
        branch_code: {
            type: Sequelize.STRING
        },
        fax_number: {
            type: Sequelize.STRING
        },
        founder: {
            type: Sequelize.STRING
        },
        founding_date: {
            type: Sequelize.STRING
        },
        found_location: {
            type: Sequelize.STRING
        },
        geo_lat: {
            type: Sequelize.STRING
        },
        geo_lng: {
            type: Sequelize.STRING
        },
        human_resource_management_policies: {
            type: Sequelize.STRING
        },
        information_management_policies: {
            type: Sequelize.STRING
        },
        legal_name: {
            type: Sequelize.STRING
        },
        medicine_policies: {
            type: Sequelize.STRING
        },
        no_of_employees: {
            type: Sequelize.STRING
        },
        providing_care_policies: {
            type: Sequelize.STRING
        },
        tax_id: {
            type: Sequelize.STRING
        },
        updated_by: {
            type: Sequelize.STRING
        },
    }, {
        timeStamps: true
    })
    return tenantProfile
}