module.exports = (database, Sequelize) => {
    const lab = database.define('lab', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        category: {
            type: Sequelize.STRING,
            allowNull: true
        },
        investigation: {
            type: Sequelize.STRING,
            allowNull: true
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        //foreign key
        order_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        consumer_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        provider_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        created_by: {
            type: Sequelize.UUID,
            allowNull: false
        },
        updated_by: {
            type: Sequelize.UUID,
            allowNull: false
        },
    },
        {
            timeStamps: true
        })
    return lab
}