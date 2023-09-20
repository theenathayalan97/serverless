module.exports = (database, Sequelize) => {
    const tenant = database.define('tenant_audit', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        domain: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        is_active: {
            type: Sequelize.STRING,
        },
        is_deleted: {
            type: Sequelize.STRING,
        },
        //foreign key
        created_by: {
            type: Sequelize.STRING,
        },
        updated_by: {
            type: Sequelize.STRING,
        },
    }, {
        timeStamps: true
    })
    return tenant
}