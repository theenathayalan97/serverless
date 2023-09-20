require(`dotenv`).config();

function Repository() {
    var Repository
    if (process.env.databaseConnection == 'postgres') {
        Repository = `postgres`
    }
    if (process.env.databaseConnection == 'dynamodb') {
        Repository = `dynamodb`
    }
    return Repository 
}

module.exports = { Repository }