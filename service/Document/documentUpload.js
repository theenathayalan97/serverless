const AWS = require('aws-sdk')
const awsconfig = require("aws-config")

const s3 = new AWS.S3(awsconfig({
    accessKeyId: 'AKIA2TVEYKFLYIHWNFD5',
    secretAccessKey: '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',
    region: 'us-east-1',
}))


class documentUpload {
    async uploadDocument(req, res){
        try {
           const extensionLists = ['jpeg', 'png', 'jpg', "tiff", "gif", "svg"]
            const presign = []
            if ((req.files.image).length > 1) {
                let file = [];
                let size = [];
                let format = [];
                let filename = []
    
                for (let i = 0; i < (req.files.image).length; i++) {
                    let value = (req.files.image[i].name).indexOf('.')
                    let type = (req.files.image[i].name).slice((value + 1))
                        let image = []
                        for (let j = 0; j < extensionLists.length; j++) {
                            if (extensionLists[j] === type) {
                                type = extensionLists[j]
                                image.push(type)
                            }
                        }
                        if (image == type) {
                            const fileContents = Buffer.from(req.files.image[i].data, 'binary')
    
                            if (fileContents.length <= 15728640) {
                                const position = 'Doctor/profile/' + req.files.image[i].name
                                file.push('https://bucket-test-hms.s3.amazonaws.com/Doctor/profile/' + req.files.image[i].name)
                                const params = {
                                    Bucket: 'bucket-test-hms',
                                    Key: position,
                                    Body: fileContents,
                                    ContentType: `${extensionLists}`,
                                }
    
    
                                // upload the file
                                s3.upload(params, (err, data) => {
                                    if (err) { 
                                        throw err
                                    }
                                });
                            } else {
                                size.push('https://bucket-test-hms.s3.amazonaws.com/Doctor/profile/' + req.files.image[i].name)
                            }
                        } else {
                            format.push('https://bucket-test-hms.s3.amazonaws.com/Doctor/profile/' + req.files.image[i].name)
                        }
                    
    
                }
                if (file.length > 0) {
                    for (var i = 0; i < file.length; i++) {
                        const url = s3.getSignedUrl('getObject', {
                            Bucket: 'bucket-test-hms',
                            Key: file[i]
                        })
                        presign.push(url)
                    }
                }
                return res.status(200).json([{
                    success: { status: 'success', message: 'upload successfully', result: file },
                    large: { status: 'failure', message: 'file size too large', result: size },
                    wrongFormat: { status: 'failure', message: 'file type not allowed', result: format },
                    presignUrl: { status: 'success', message: 'create presigned url successfully', result: presign }
                }])
            } else {
                let value = (req.files.image.name).indexOf('.')
                let type = (req.files.image.name).slice((value + 1))
                let image = []
                for (let i = 0; i < extensionLists.length; i++) {
                    if (extensionLists[i] == type) {
                        type = extensionLists[i]
                        image.push(type)
                    }
                }
                if (image.length > 0) {
                    const fileContents = Buffer.from(req.files.image.data, 'binary')
    
                    if (fileContents.length <= 15728640) {
                        const key = 'Doctor/profile/' + req.files.image.name
                        const params = {
                            Bucket: 'bucket-test-hms',
                            Key: key,
                            Body: fileContents,
                            ContentType: `${extensionLists}`,
                        }
    
    
                        // upload the file
                        await s3.upload(params, (err, data) => {
                            if (err) {
                                throw err
                            }
                            presign.push(data)
                            return res.status(200).json({ status: 'success', message: 'upload successfully', result: data })
                        });
                    } else {
                        return res.status(400).json({ status: 'failure', message: 'file size too large' })
                    }
                } else {
                    return res.status(400).json({ status: 'failure', message: 'file type not allowed' })
                }
            }
        } catch (error) {
            return res.status(400).json({ status: 'failure', message: 'something went wrong', result: error.message })
        }
    }

    async deleteDocument(req, res){
        try {
            const fileContents = req.files.image.data
            const key = 'Doctor/profile/' + req.files.image.name
            const params = {
                Bucket: 'bucket-test-hms',
                Key: key,
                Body: fileContents,
            }

            const Details = {
                Bucket: 'bucket-test-hms',
                Key: params.Key
            }
    
    
            let deleteDetail = await s3.deleteObject(Details).promise()
            return res.status(200).json({ status: 'success', message: 'file deleted Successfully', result: deleteDetail })
    
        } catch (error) {
            return res.status(400).json({ status: 'failure', message: 'something went wrong', result: error.message })
        }
    }
    
}

module.exports = new documentUpload()