

class validation {
    
    async providerProfile(req, res) {
        try {
            let date = {
                    "profile_view": 123456,
                    "questions_document_name": "users.uuid",
                    "channels": "users.uuid",
                    "answer_document_name": "profile_type",
                    "doctype": "application",
                    "description": "profile_type",
                    "name": "doctor"
                
            }
            let key
            let value
            let array = Object.keys(req.body)
            let data = Object.values(req.body)
            let duplicate = []
            for (let item in date) {
                value = date[item]
                key = item
                for (let i = 0; i < array.length; i++) {
                    if ((array[i] == key) || (0 == data[i].length)) {
                        duplicate.push(array[i])
                    }
                }
            }

            let response = await array.filter(item => !duplicate.includes(item));
            if (response.length > 0) {
                return res.status(400).json({ message: "Invalid field missing ", result: response })
            }
            return;
        } catch (error) {
            return res.status(400).json({ message: "Something went wrong ", result: error.message })
        }
    }


    async availability(req, res) {
        try {
            let date = {
                "start_Date": "2023-05-13",
                "end_Date": "2023-05-15",
                "schedule_starttime":"11:55",
                "schedule_endtime":"12:25"
            }
            let key
            let value
            let array = Object.keys(req.body)
            let data = Object.values(req.body)
            let duplicate = []
            for (let item in date) {
                value = date[item]
                key = item
                for (let i = 0; i < array.length; i++) {
                    if ((array[i] == key) || (0 == data[i].length)) {
                        duplicate.push(array[i])
                    }
                }
            }

            let response = await array.filter(item => !duplicate.includes(item));
            if (response.length > 0) {
                return res.status(400).json({ message: "Invalid field missing ", result: response })
            }
            return;
        } catch (error) {
            return res.status(400).json({ message: "Something went wrong ", result: error.message })
        }
    }


    async providerProfileMaster(req, res) {
        try {
            let date = {
                "name":"heart specialist"
            } 
            let key
            let value
            let array = Object.keys(req.body)
            let data = Object.values(req.body)
            let duplicate = []
            for (let item in date) {
                value = date[item]
                key = item
                for (let i = 0; i < array.length; i++) {
                    if ((array[i] == key) || (0 == data[i].length)) {
                        duplicate.push(array[i])
                    }
                }
            }

            let response = await array.filter(item => !duplicate.includes(item));
            if (response.length > 0) {
                return res.status(400).json({ message: "Invalid field missing ", result: response })
            }
            return;
        } catch (error) {
            return res.status(400).json({ message: "Something went wrong ", result: error.message })
        }
    }


    async specialtyMaster(req, res) {
        try {
            let date = {
                "name":"heart specialist"
            } 
            let key
            let value
            let array = Object.keys(req.body)
            let data = Object.values(req.body)
            let duplicate = []
            for (let item in date) {
                value = date[item]
                key = item
                for (let i = 0; i < array.length; i++) {
                    if ((array[i] == key) || (0 == data[i].length)) {
                        duplicate.push(array[i])
                    }
                }
            }

            let response = await array.filter(item => !duplicate.includes(item));
            if (response.length > 0) {
                return res.status(400).json({ message: "Invalid field missing ", result: response })
            }
            return;
        } catch (error) {
            return res.status(400).json({ message: "Something went wrong ", result: error.message })
        }
    }


    async specialty(req, res) {
        try {
            let date = {
                "name":"heart specialist"
            } 
            let key
            let value
            let array = Object.keys(req.body)
            let data = Object.values(req.body)
            let duplicate = []
            for (let item in date) {
                value = date[item]
                key = item
                for (let i = 0; i < array.length; i++) {
                    if ((array[i] == key) || (0 == data[i].length)) {
                        duplicate.push(array[i])
                    }
                }
            }

            let response = await array.filter(item => !duplicate.includes(item));
            if (response.length > 0) {
                return res.status(400).json({ message: "Invalid field missing ", result: response })
            }
            return;
        } catch (error) {
            return res.status(400).json({ message: "Something went wrong ", result: error.message })
        }
    }
}

module.exports = new validation()