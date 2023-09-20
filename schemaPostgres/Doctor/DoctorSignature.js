module.exports = (database, Sequelize) => {
    const DoctorSignature = database.define('doctor_signature', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        signature: {
            type: Sequelize.STRING,
            allowNull: false
        },
        //foreign key
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
    return DoctorSignature
}
