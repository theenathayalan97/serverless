module.exports = (database, Sequelize) => {
    const providerProfileMasterSchema = database.define('ProviderProfileMaster', {
        uuid:
        {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        profile_view: {
            type: Sequelize.STRING,
            allowNull: false
        },
        answer_document_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        questions_document_name: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        doctype: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        channels: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updated_required: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        default_required: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        mandatory: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        //foreign key
        created_by: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updated_by: {
            type: Sequelize.STRING,
            allowNull: false
        },
        attachment_required: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
    },
        {
            timeStamps: true
        })
    return providerProfileMasterSchema

}
