module.exports = (database, Sequelize) => {
    const Order = database.define('orders', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        order_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        consultation_type: {//video, audio
            type: Sequelize.STRING,
            allowNull: false
        },
        primary_complaint: {
            type: Sequelize.STRING,
            allowNull: false
        },
        complaint_description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        doctor_specialists: {
            type: Sequelize.STRING,
            allowNull: false
        },
        order_status: {
            type: Sequelize.STRING,
            allowNull: true
        },
        Appointment_type: {//on-demand
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'On_demand'
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        mode_of_payment: {
            type: Sequelize.STRING,
            allowNull: true
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
        accepted_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        rejected_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        //foreign key
        consumer_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        provider_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        iu_id: {
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
    return Order
}