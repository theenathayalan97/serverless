module.exports = (database, Sequelize) => {
    const Notes = database.define('notes', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        symptoms: {
            type: Sequelize.STRING,
            allowNull: false
        },
        chief_complaints: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Diagnosis: {
            type: Sequelize.STRING,
            allowNull: false
        },
        treatment_plan: {
            type: Sequelize.STRING,
            allowNull: false
        },
        advices_instructions: {
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
    return Notes
}