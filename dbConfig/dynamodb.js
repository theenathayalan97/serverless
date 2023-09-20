const AWS = require('aws-sdk');
require(`dotenv`).config();
//const dynamoose = require('dynamoose');
// Set up AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
  debug: true
});
//dynamoose.aws.sdk=AWS
const dynamoose = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });
module.exports = dynamoose