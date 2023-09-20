module.exports = (database, Sequelize) => {
    var RX = database.define('rx_details', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        medicine_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Composition: {
            type: Sequelize.STRING,
            allowNull: false
        },
        strength: {
            type: Sequelize.STRING,
            allowNull: true
        },
        intake: {
            type: Sequelize.STRING,
            allowNull: false
        },
        morning: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        afternoon: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        night: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Additional_comments_Instructions: {
            type: Sequelize.BOOLEAN,
            allowNull: true
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
            allowNull: false
        },
        updated_by: {
            type: Sequelize.UUID,
            allowNull: false
        },
        order_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        provider_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        consumer_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
    }, {
        timeStamps: true
    })
    return RX
}