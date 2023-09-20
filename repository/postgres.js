const db = require(`../dbConfig/postgresql`);
const { Sequelize, Op } = require("sequelize");

class PostgresRepository {
    // create a item
    async create(data, TableName) {
        var schema = await Schema(TableName)
        const result = await schema.create(data)
        return result._previousDataValues
    }

    //update a item using key/value pairs
    async updateOne(key, attributeName, attributeValue, TableName) {
        var data = {}
        data[attributeName] = attributeValue
        var schema = await Schema(TableName)
        const result = await schema.update(data, { where: key });
        return result
    }

    //update multiple items using key/value pairs
    async updateMultipleFields(key, data, TableName) {
        var schema = await Schema(TableName)
        const result = await schema.update(data, { where: key });
        return result
    }

    //get all items from table
    async GetAllItems(TableName) {
        var schema = await Schema(TableName)
        const result = await schema.findAll();
        return result
    }

    //get one item from table
    async GetOne(key, TableName) {
        var schema = await Schema(TableName)
        const result = await schema.findOne({ where: key })
        return result
    }

    //delete one item from table with given key
    async deleteByID(uuid, TableName) {
        var schema = await Schema(TableName)
        const result = await schema.destroy({ where: { uuid: uuid } })
        return result
    }

    //batch delete all items from table using uuid
    async batchDelete(uuids, TableName) {
        var schema = await Schema(TableName)
        const result = await schema.destroy({
            where: {
                uuid: {
                    [Op.in]: uuids
                }
            }
        });
        return result
    }

    //batch delete all items from table using uuids
    async deleteByFilter(key, TableName) {
        var schema = await Schema(TableName)
        const result = await schema.destroy({ where: key })
        return result
    }

    //get all items from table using jsonb datatype array 
    async queryArray(TableName, key, value) {
        var schema = await Schema(TableName)
        const searchValue = value;
        const result = await schema.findAll({
            where: {
                'domain': {
                    [Op.contains]: [searchValue]
                }
            }
        });
        return result
    }

    //get all items from table using AND operator
    async queryItemsByAttributesOrIN(TableName, key) {
        var schema = await Schema(TableName)
        const result = await schema.findAll({
            where: {
                [Op.or]: [key]
            }
        });

        return result
    }

    //get all items from table using OR operator
    async queryItemsByAttributesAndIN(TableName, key) {
        var schema = await Schema(TableName)
        const result = await schema.findAll({
            where: {
                [Op.and]: [key]
            }
        });

        return result
    }

    //get item using key and value 
    async ScanItemsByAttributeValue(key, value, TableName) {
        var schema = await Schema(TableName)
        const result = await schema.findOne({ where: { key: value } })
        return result
    }

    async BatchCreate(data) {
        try {
            var schema = await Schema('tenant_json_master')
            const result = await schema.bulkCreate(data)
        } catch (err) {
            console.log('err', err.message)
        }
    }
}

async function Schema(tableName) {
    if (tableName == 'tenant') {
        var table = db.tenant
        return table
    } else if (tableName == 'tenant_profile') {
        var table = db.tenantProfile
        return table
    } else if (tableName == 'tenant_profile_audit') {
        var table = db.tenantProfileAudit
        return table
    } else if (tableName == 'tenant_audit') {
        var table = db.tenantAudit
        return table
    } else if (tableName == 'tenant_json_master') {
        var table = db.tenantJsonMaster
        return table
    } else if (tableName == 'json_master') {
        var table = db.jsonMaster
        return table
    } else if (tableName == 'users') {
        var table = db.user
        return table
    }else if (tableName == 'availability') {
        var table = db.availability
        return table
    }else if (tableName == 'ProviderProfileMaster') {
        var table = db.providerProfileMaster
        return table
    }else if (tableName == 'provider_profiles') {
        var table = db.providerProfile
        return table
    }else if (tableName == 'specialty') {
        var table = db.specialty
        return table
    }else if (tableName == 'specialty_master') {
        var table = db.specialtyMaster
        return table
    }else if (tableName == 'history_provider_profiles') {
        var table = db.historyProviderProfile
        return table
    }
}

module.exports = new PostgresRepository();