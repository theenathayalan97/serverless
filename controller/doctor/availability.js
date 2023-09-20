"use strict"

const DoctorService = require(`../../service/doctor/availabilityService`);
const tableName = require(`../../constant/dbTablesName`)

class AvailabilityController {
    // create a new availability
    async CreateDoctorAvailability(req, res) {
        const result = await DoctorService.createAvailability(req, res,tableName.Available)
        return result
    }

    // get availability information
    async GetDoctorAvailability(req, res) {
        const data = await DoctorService.GetDoctorAvailability(req,res,tableName.Available)
        return data
    }

    // update availability statusCode
    async UpdateDoctorAvailability(req, res) {
        const result = await DoctorService.UpdateDoctorAvailability(req,res,tableName.Available)
        return result;
    }
    
    // delete availability statusCode
    async DeleteDoctorAvailability(req, res) {
        const result = await DoctorService.DeleteDoctorAvailability(req,res,tableName.Available)
        return result;
    }

}
module.exports = new AvailabilityController()




// let date1=[{
//     "start_Date": "2023-05-11",
//     "end_Date": "2023-05-12",
//     "schedule_starttime":"10:55",
//     "schedule_endtime":"12:25"
// },{
//     "start_Date": "2023-05-11",
//     "end_Date": "2023-05-12",
//     "schedule_starttime":"11:55",
//     "schedule_endtime":"14:25"
// },{
//     "start_Date": "2023-05-11",
//     "end_Date": "2023-05-13",
//     "schedule_starttime":"11:55",
//     "schedule_endtime":"14:30"
// }]

// let b = "2023-05-11"
// let d = "12:20"

// let c =[]
// for(let i=0;i<date1.length;i++){
//   if(b==date1[i].start_Date){
//       if((d>date1[i].schedule_starttime) && (d<date1[i].schedule_endtime)){
//         //   console.log("the work is",date1[i])
//           c.push(date1[i])
//       }
//     //   c.push(date1[i])
//   }
// }

// // console.log(c)



// var maxObject = date1.reduce(function(x, y) {
//   return (x.schedule_endtime > y.schedule_endtime) ? x : y;
// });

// console.log(maxObject);

// // console.log(maxXObject);





