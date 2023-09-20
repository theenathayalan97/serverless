module.exports = (database, Sequelize) => {
    const Availability = database.define('availability', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        mode_of_availability: {
            type: Sequelize.STRING,
            allowNull: true
        },
        repeat_availability: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        break_end_time: {
            type: Sequelize.STRING,
            allowNull: true
        },
        break_start_time: {
            type: Sequelize.STRING,
            allowNull: true
        },
        schedule_date_range: {
            type: Sequelize.STRING,
            allowNull: true
        },
        schedule_end_date: {
            type: Sequelize.STRING,
            allowNull: true
        },
        break_start_time: {
            type: Sequelize.STRING,
            allowNull: true
        },
        schedule_time_range: {
            type: Sequelize.STRING,
            allowNull: true
        },
        day_of_week: {
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
            allowNull: true
        },
        updated_by: {
            type: Sequelize.UUID,
            allowNull: true
        },
        provider_id: {
            type: Sequelize.UUID,
            allowNull: true
        },
        iu_id: {
            type: Sequelize.UUID,
            allowNull: true
        },

    },
        {
            timeStamps: true
        })
    return Availability
}
