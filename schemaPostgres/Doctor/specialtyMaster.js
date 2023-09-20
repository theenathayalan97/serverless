module.exports = (database, Sequelize) => {
const specialtyMasterSchema = database.define('specialty_master', 
    {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        tenant_id: {
            type: Sequelize.STRING,
            allowNull: true
        },
        user_id: {
            type: Sequelize.STRING,
            allowNull: true
        },
        created_by: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updated_by: {
            type: Sequelize.STRING,
            allowNull: true
        },
    },

    {
        timestamps: true, // Add createdAt and updatedAt fields
    })
    return specialtyMasterSchema
}
