module.exports = (database, Sequelize) => {
    const Vitals = database.define('vitals', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        blood_pressure_systolic: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        blood_pressure_diastolic: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        height: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        weight: {
            type: Sequelize.INTEGER,
            allowNull: true

        },
        temperature: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        pulse_rate: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        bmi: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        waist_circumference: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        triglycerides: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        fast_blood_glucose: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        SPO2: {
            type: Sequelize.INTEGER,
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
        // foreign key
        iu_id: {
            type: Sequelize.UUID,
            allowNull: true
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: true,
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
    return Vitals
}

