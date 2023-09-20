module.exports = (database, Sequelize) => {
    const historyProviderProfilesSchema = database.define('history_provider_profiles', {
        uuid:
        {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        details: {
            type: Sequelize.JSONB,
            allowNull: false,

        },
        set_default: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        created_by: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updated_by: {
            type: Sequelize.STRING,
            allowNull: true
        },
        profile_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        // foreign key
        provider_id: {
            type: Sequelize.STRING,
            allowNull: true
        },
        tenant_id: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            timeStamps: true,
            saveUnknown: true
        })
        return historyProviderProfilesSchema
}

