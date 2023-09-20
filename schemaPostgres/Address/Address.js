module.exports = (database, Sequelize) => {
    const Address = database.define('address', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            // defaultValue: Sequelize.literal('gen_random_uuid()'),
            unique: true,
        },
        address_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address1: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        address2: {
            type: Sequelize.STRING,
            allowNull: true
        },
        address3:{
            type: Sequelize.STRING,
            allowNull:  true
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false
        },
        zip_code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        mobile_number: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        set_default: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        remarks:{
            type: Sequelize.STRING,
            allowNull: true
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        //foreign key
        user_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        tenant_id: {
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
        is_active: {
            type:Sequelize.BOOLEAN,
            allowNull: false
        }
    },
        {
            timeStamps: true
        })
    return Address
}