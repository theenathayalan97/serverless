module.exports = (database, Sequelize) => {
    const Payment = database.define('payment', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        mode_of_payment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        payment_type: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "cash"
        },
        payment_status: {
            type: Sequelize.STRING,
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
        payment_id: {
            type: Sequelize.STRING,
            allowNull: true
        },
        //foreign key
        order_id: {
            type: Sequelize.UUID,
            allowNull: true
        },
        order_type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        iu_id: {
            type: Sequelize.UUID,
            allowNull: true
        },
        created_by: {
            type: Sequelize.UUID,
            allowNull: true
        },
        updated_by: {
            type: Sequelize.UUID,
            allowNull: true
        },

    },
        {
            timeStamps: true
        })
    return Payment
}