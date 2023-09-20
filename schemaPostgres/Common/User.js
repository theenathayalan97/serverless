module.exports = (database, Sequelize) => {
    const User = database.define('users', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            validator(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid Email')
                }
            }
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [10, 10],
                isNumeric: true,
            },
        },
        emergency_contact: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [10, 10],
                isNumeric: true,
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate(value) {
                if (value.toLowercase().includes('password')) {
                    throw new Error('Please enter a Strong password')
                }
            }
        },

        is_verified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        last_login: {
            type: Sequelize.STRING,
            allowNull: true
        },
        submitted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false

        },
        resubmitted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        //ForeignKey
        approved_by: {
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
        role_id: {
            type: Sequelize.UUID,
            allowNull: true,
        },
        iu_id: {
            type: Sequelize.UUID,
            allowNull: true,
        },
    },
        {
            timeStamps: true
        })
    return User
}
