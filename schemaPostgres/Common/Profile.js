module.exports = (database, Sequelize) => {
    const Patient = database.define('profile', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        otp: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        marital_status: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        dob: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        emergency_contact: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        Profile_photo: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        age: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        language: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
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
        user_id: {
            type: Sequelize.UUID,
            allowNull: false
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
    return Patient
}
