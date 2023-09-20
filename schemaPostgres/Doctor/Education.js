module.exports = (database, Sequelize) => {
    const Education = database.define('educations', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        college: {
            type: Sequelize.STRING,
            allowNull: true
        },
        qualification: {
            type: Sequelize.STRING,
            allowNull: true
        },
        graduation_type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        specialization: {
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
    return Education
}