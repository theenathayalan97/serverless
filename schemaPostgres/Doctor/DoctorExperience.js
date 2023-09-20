module.exports = (database, Sequelize) => {
    const Experience = database.define("experience", {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        designation: {
            type: Sequelize.STRING,
            allowNull: true
        },
        organization: {
            type: Sequelize.STRING,
            allowNull: true
        },
        number_of_years: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        department: {
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
        },
    },
        {
            timeStamps: true
        })
    return Experience
}