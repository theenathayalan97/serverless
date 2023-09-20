module.exports = (database, Sequelize) => {
    const Email = database.define('emails', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        template_title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        template_description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        //doctor,patient,admin
        template_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subject: {
            type: Sequelize.STRING,
            allowNull: false
        },
        body: {
            type: Sequelize.STRING,
            allowNull: false
        },
        attachments: {
            type: Sequelize.STRING,
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

        //foreign key
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        updated_by: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        send_from: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        send_to: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        cc: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
        {
            timeStamps: true
        })
    return Email
}