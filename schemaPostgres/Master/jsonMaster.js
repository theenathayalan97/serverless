
module.exports = (database, Sequelize) => {
    const tenantJsonMaster = database.define('json_master', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        channel_name: {
            type: Sequelize.STRING,
        },
        document_type: {
            type: Sequelize.STRING,
        },
        document_name: {
            type: Sequelize.STRING,
        },
        detail: {
            type: Sequelize.JSONB,
        },
        is_delete: {
            type: Sequelize.BOOLEAN,
        },
        created_by: {
            type: Sequelize.STRING,
        },
        updated_by: {
            type: Sequelize.STRING,
        },
    }, {
        timeStamps: true
    })
    return tenantJsonMaster
}
