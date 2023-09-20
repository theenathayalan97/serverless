module.exports = (database, Sequelize) => {
    const Doctor = database.define('doctor_professionals', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        professional_title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        board: {
            type: Sequelize.STRING,
            allowNull: false
        },
        registration_council: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        specialty: {
            type: Sequelize.STRING,
            allowNull: false
        },
        registration_number: {
            type: Sequelize.STRING,
            allowNull: false
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
        created_by: {
            type: Sequelize.UUID,
            allowNull: false
        },
        updated_by: {
            type: Sequelize.UUID,
            allowNull: false
        },
        provider_id: {
            type: Sequelize.UUID,
            allowNull: false
        }
    },
        {
            timeStamps: true
        })
    return Doctor
}
