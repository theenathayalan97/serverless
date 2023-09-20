module.exports = (database, Sequelize) => {
    const Awards = database.define("doctor_awards", {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        award_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        award_year: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        //foreign Key
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
    return Awards
}