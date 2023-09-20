

class validation {
    
    async  availability(req, res, next) {
        // console.log('TenantProfileValidation')
        if (req == undefined || req == null) {
            return res.status(400).json({ message: "payload is empty" })
        }
    
        //hospital_name
        if (req.body.start_Date == "" || req.body.start_Date == undefined) {
            return res.status(400).json({ message: "start date is missing, need to sent a start date" })
        }
    
        if (req.body.end_Date == "" || req.body.end_Date == undefined) {
            return res.status(400).json({ message: "end date is missing, need to sent a end date" })
        } 
    
        if (req.body.schedule_starttime == "" || req.body.schedule_starttime == undefined) {
            return res.status(400).json({ message: "schedule starttime is missing, need to sent a schedule starttime" })
        }
    
        if (req.body.schedule_endtime == "" || req.body.schedule_endtime == undefined) {
            return res.status(400).json({ message: "schedule endtime is missing, need to sent a schedule endtime" })
        }
        
        if (req.body.specialty_id == "" || req.body.specialty_id == undefined) {
            return res.status(400).json({ message: "specialty id is missing, need to sent a specialty id" })
        }
    
        next();
    }

    async  specialtyMaster(req, res, next) {
        // console.log('TenantProfileValidation')
        if (req == undefined || req == null) {
            return res.status(400).json({ message: "payload is empty" })
        }
    
        //hospital_name
        if (req.body.name == "" || req.body.name == undefined) {
            return res.status(400).json({ message: "name is missing, need to sent a name" })
        }
    
        next();
    }

    async  specialty(req, res, next) {
        // console.log('TenantProfileValidation')
        if (req == undefined || req == null) {
            return res.status(400).json({ message: "payload is empty" })
        }
    
        //hospital_name
        if (req.body.name == "" || req.body.name == undefined) {
            return res.status(400).json({ message: "name is missing, need to sent a name" })
        }
    
        next();
    }
    
}

module.exports = new validation()