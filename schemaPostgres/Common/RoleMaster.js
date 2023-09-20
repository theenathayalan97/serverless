module.exports = (database, Sequelize) => {
    const RoleMaster = database.define('roleMaster', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        role_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },

        //foreign key
        created_by: {
            type: Sequelize.UUID,
            allowNull: true
        },
        updated_by: {
            type: Sequelize.UUID,
            allowNull: true
        },
    }, {
        timeStamps: true
    })
    return RoleMaster
}