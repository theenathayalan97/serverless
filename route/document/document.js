const express = require('express')
const route = express()
const documentUpload = require('../../service/Document/documentUpload');

route.post("/upload",documentUpload.uploadDocument)
route.delete("/DeleteDocument",documentUpload.deleteDocument)

module.exports = route 

