const db = require(`../dbConfig/dynamodb`);
const { v4: uuidv4 } = require('uuid');

class DynamodbRepository {
    // create
    async create(data, TableName) {
        data.uuid = uuidv4()
        data.created_At = Date.now()
        data.updated_At = Date.now()
        const params = {
            TableName: TableName,
            Item: data
        };
        await db.put(params).promise();
        // console.log(" params.Item", params.Item)
        return params.Item;
    }
    //updateOne
    async updateOne(key, attribute_name, attribute_value, TableName) {
        const params = {
            TableName: TableName,
            Key: key,
            UpdateExpression: `set #data = :value`,
            ExpressionAttributeNames: {
                '#data': `${attribute_name}`,
            },
            ExpressionAttributeValues: {
                ":value": attribute_value,
            },
            ReturnValues: `UPDATED_NEW`,
        };

        const update = await db.update(params).promise();

        return update.Attributes;
    }
    //find by uuid
    async GetOne(key, TableName) {
        const params = {
            TableName: TableName,
            Key: key,
        };
        return (await db.get(params).promise()).Item;
    }
    //to update all 
    async updateMultipleFields(key, data, TableName) {
        data.updated_At = Date.now()
        const updateExpression = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        // loop through the data object and create the UpdateExpression and ExpressionAttributeValues
        for (const key in data) {
            updateExpression.push(`#${key} = :${key}`);
            expressionAttributeValues[`:${key}`] = data[key];
            expressionAttributeNames[`#${key}`] = key;
        }

        const params = {
            TableName: TableName,
            Key: key,
            UpdateExpression: 'set ' + updateExpression.join(','),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW',
        };


        const updateResult = await db.update(params).promise();
        return updateResult.Attributes;

    }
    //delete by id
    async deleteByID(uuid, tableName) {
        const params = {
            TableName: tableName,
            Key: {
                uuid,
            },
        };
        return await db.delete(params).promise();
    }
    //scan table by attribute name and value
    async ScanItemsByAttributeValue(attribute_name, attribute_value, TableName) {
        const params = {
            TableName: TableName,
            FilterExpression: `#names = :value`,
            ExpressionAttributeNames: {
                '#names': `${attribute_name}`
            },
            ExpressionAttributeValues: {
                ':value': `${attribute_value}`
            },
        };
        return (await db.scan(params).promise()).Items;
        //return value
    }

   
    //get all from the table name
    async GetAllItems(tableName) {
        const params = {
            TableName: tableName,
        };
        // Call the scan method to get all items
        const data = (await db.scan(params).promise()).Items;
        return data;
    }
    
    //query to get data using pk and sk
    async queryBySortKey(tableName, partitionKey, partitionKeyValue, sortKey, sortKeyValue) {
        const params = {
            TableName: tableName,
            KeyConditionExpression: `#${partitionKey} = :partitionKeyValue and #${sortKey} = :sortKeyValue`,
            ExpressionAttributeNames: {
                [`#${partitionKey}`]: partitionKey,
                [`#${sortKey}`]: sortKey
            },
            ExpressionAttributeValues: {
                ':partitionKeyValue': partitionKeyValue,
                ':sortKeyValue': sortKeyValue
            }
        };

        try {
            const queryResult = await db.query(params).promise();
            return queryResult.Items;
        } catch (error) {
            console.error(`Query failed: ${error.message}`);
            return [];
        }
    }
    //get particular data in the array data type
    async queryArray(tableName, key, value) {
        const params = {
            TableName: tableName,
            FilterExpression: 'contains(#attribute, :value)',
            ExpressionAttributeNames: {
                '#attribute': key
            },
            ExpressionAttributeValues: {
                ':value': value
            }
        };

        try {
            const result = await db.scan(params).promise();
            return result.Items;
        } catch (err) {
            console.error(`Query failed: ${err}`);
            return [];
        }
    }
    // to delete multiple data by id
    async batchDelete(partitionKeyValues, tableName) {
        const params = {
            RequestItems: {
                [tableName]: partitionKeyValues.map((keyValue) => ({
                    DeleteRequest: {
                        Key: {
                            'uuid': keyValue
                        }
                    }
                }))
            }
        };

        try {
            await db.batchWrite(params).promise();
        } catch (error) {
            console.error(`Batch delete operation failed for ${tableName}: ${error.message}`);
        }
    }
    //scan the data with AND operation
    async queryItemsByAttributesAndIN(tableName, attributeValueMap) {
        // Create expression attribute names and expression attribute values objects
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        let filterExpression = "";
        // Loop through the attributeValueMap parameter to add each attribute name and value to the expression attribute names and expression attribute values objects
        Object.entries(attributeValueMap).forEach(([attributeName, attributeValue], index) => {
            const attributeNameKey = `#${attributeName}_${index}`;
            const attributeValueKey = `:${attributeName}_${index}`;
            expressionAttributeNames[attributeNameKey] = attributeName;
            expressionAttributeValues[attributeValueKey] = attributeValue;
            filterExpression += `${attributeNameKey} = ${attributeValueKey}`;
            if (index < Object.keys(attributeValueMap).length - 1) {
                filterExpression += " and ";
            }
        });
        // Construct the scan parameters object
        const params = {
            TableName: tableName,
            FilterExpression: filterExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ScanIndexForward: false,
        };
        // if (schedule_starttime) {
        //     params.FilterExpression += " and #schedule_endtime >= :schedule_endtime";
        //     params.ExpressionAttributeNames["#schedule_endtime"] = "schedule_endtime";
        //     params.ExpressionAttributeValues[":schedule_endtime"] = schedule_starttime;
        //   }
      
        try {
            const queryResult = await db.scan(params).promise();
            return queryResult.Items;
        } catch (error) {
            console.error(`Unable to query items. Error JSON: ${JSON.stringify(error, null, 2)}`);
            return [];
        }
    }
    //scan the data with OR operation
    async queryItemsByAttributesOrIN(tableName, attributeValueMap) {
        // Create expression attribute names and expression attribute values objects
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        let filterExpression = "";
        // Loop through the attributeValueMap parameter to add each attribute name and value to the expression attribute names and expression attribute values objects
        Object.entries(attributeValueMap).forEach(([attributeName, attributeValue], index) => {
            const attributeNameKey = `#${attributeName}_${index}`;
            const attributeValueKey = `:${attributeName}_${index}`;
            expressionAttributeNames[attributeNameKey] = attributeName;
            expressionAttributeValues[attributeValueKey] = attributeValue;
            filterExpression += `${attributeNameKey} = ${attributeValueKey}`;
            if (index < Object.keys(attributeValueMap).length - 1) {
                filterExpression += " or ";
            }
        });
        // Construct the scan parameters object
        const params = {
            TableName: tableName,
            FilterExpression: filterExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
        };
        try {
            const queryResult = await db.scan(params).promise();
            return queryResult.Items;
        } catch (error) {
            console.error(`Unable to query items. Error JSON: ${JSON.stringify(error, null, 2)}`);
            return [];
        }
    }

    //create multiple items
    async BatchCreate(data) {
        const putRequests = data.map(item => ({
            PutRequest: {
                Item: item
            }
        }));
        const params = {
            RequestItems: {
                'tenant_json_master': putRequests
            }
        };
        const result = await db.batchWrite(params).promise();
    }

    async updateMultipleFieldsSort(uuid, data, TableName) {
        const updateExpression = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        // loop through the data object and create the UpdateExpression and ExpressionAttributeValues
        for (const key in data) {
            updateExpression.push(`#${key} = :${key}`);
            expressionAttributeValues[`:${key}`] = data[key];
            expressionAttributeNames[`#${key}`] = key;
        }
        const params = {
            TableName: TableName,
            Key: {
                'uuid': uuid
            },
            UpdateExpression: 'set ' + updateExpression.join(','),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW',
        };

        try {
            const updateResult = await db.update(params).promise();
            //   console.log("value is a ",updateResult)
            return updateResult.Attributes;
        } catch (error) {
            console.error(`Update failed: ${error.message}`);
            return null;
        }
    }

    async getAvailableDate(tableName, data) {
        const params = {
            TableName: tableName,
            FilterExpression: '#datas = :date and #deleteAd = :is_deleted and #startTimeValue >= :startTime and #endTimeValue <= :endTime and #tenantId = :tenantId',
            ExpressionAttributeNames: {

                '#datas': "start_Date",
                "#deleteAd": "is_deleted",
                "#startTimeValue": "schedule_starttime",
                "#endTimeValue": "schedule_endtime",
                "#tenantId": "tenant_id"
            },
            ExpressionAttributeValues: {

                ':date': data.date,
                ':is_deleted': data.delete,
                ':startTime': data.starttime,
                ":endTime": data.endtime,
                ":tenantId": data.tenant_id
            },
        };

        try {
            const queryResult = await db.scan(params).promise();
            // console.log(queryResult, 'query');
            return queryResult.Items;
        } catch (error) {
            console.error(`Unable to query items. Error JSON: ${JSON.stringify(error, null, 2)}`);
            return [];
        }
    }

    async backGet(tableName, data) {
        return await db
            .batchGet({
                RequestItems: {
                    "users": {
                        Keys: data,
                    },

                },
            })
            .promise()
        }
    async getAvailableDateWise(tableName, data) {
        // let valu = "da6ddd9e-8000-4167-b0ed-f62f8b020872"
        console.log(data);
        const params = {
            TableName: tableName,
            FilterExpression: '(#startData >= :startData and #endData <= :endData and #tenant = :tenant and #deleteAd = :is_deleted) OR ( #startData >= :startData and #endData <= :endData and #tenant = :tenant and #deleteAd = :is_deleted and #provider = :provider)',
            ExpressionAttributeNames: {

                '#startData': "start_Date",
                "#endData": "start_Date",
                "#tenant" : "tenant_id",
                "#provider" : "provider_id", 
                "#deleteAd" : "is_deleted"
            },
            ExpressionAttributeValues: {

                ':startData': data.start_Date,
                ':endData': data.end_Date, 
                ":tenant": data.tenant_id,
                ":provider": data.provider_id,
                ":is_deleted" : false
            },
        };

        try {
            const queryResult = await db.scan(params).promise();
            // console.log(queryResult, 'query');
            return queryResult.Items;
        } catch (error) {
            console.error(`Unable to query items. Error JSON: ${JSON.stringify(error, null, 2)}`);
            return [];
        }
    }

    async search(tableName, selectedFields, searchTerm) {
        const filterExpressions = selectedFields.map(field => `contains (first_name, :term) OR contains (phone_number, :term) OR contains (email, :term)`).join(' OR ');

        const expressionAttributeValues = selectedFields.reduce((acc, field) => {
            acc[':term'] = searchTerm.toLowerCase();
            return acc;
        }, {});

        const params = {
            TableName: tableName,
            ProjectionExpression: selectedFields.length > 0 ? selectedFields.join(', ') : undefined,
            FilterExpression: selectedFields.map((field) => `contains (first_name, :term) OR contains(phone_number,:term)`).join(' OR '),
            ExpressionAttributeValues: {
              ':term': searchTerm.toLowerCase(),
            },
          };

        try {
            const data = await db.scan(params).promise();
            return data.Items;
        } catch (err) {
            console.error('Error executing search:', err);
            throw new Error('An error occurred while searching for items');
        }
    }
}




module.exports = new DynamodbRepository();