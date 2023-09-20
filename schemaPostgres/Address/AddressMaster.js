module.exports = (database, Sequelize) => {
    const AddressMaster = database.define('address_master', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        place: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sub_district: {
            type: Sequelize.STRING,
            allowNull: false
        },
        district: {
            type: Sequelize.STRING,
            allowNull: false
        },
        zip_code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        is_active: {
            type:Sequelize.BOOLEAN,
            allowNull: false
        }
    },
        {
            timeStamps: true
        })
    return AddressMaster
}