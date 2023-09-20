

function validDate(str) {
  // console.log(str);
  let [yyyy, mm, dd] = str?.split(/[\.\-\/]/); // adjust the regular expression if needed
  dd = +dd;     // cast to number
  yyyy = +yyyy; // cast to number
  let mm0 = mm - 1; // js months are 0 based
  let date = new Date(yyyy, mm0, dd, 0, 0, 0, 0); // normalize
  // console.log("the value is ",date);
  return mm0 === date.getMonth() && dd === date.getDate() && yyyy === date.getFullYear();
}

function isDateBeforeToday(start_Date,end_Date) {
  let normalizedDate = new Date(start_Date);
  let currentDate = new Date(end_Date);
  if(normalizedDate <= currentDate){
    return true
  }else{
    return false
  };
}

function validDateCollection(date, count) {
  d = new Date();
  utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  nd = new Date(utc + (3600000 * +5.5));
  var currentTime = new Date(nd);

  const currentTimeDate = {
    year: currentTime.getFullYear(),
    month: currentTime.getMonth() + 1,
    day: currentTime.getDate()
  };

  let updatedDate = new Date(date.year, (date.month), ((date.day)))
  let updatedDay
  if ((updatedDate.getDate()) < 10) {
    updatedDay = `0${updatedDate.getDate()}`
  } else {
    updatedDay = `${updatedDate.getDate()}`
  }
  let updated_months
  if ((updatedDate.getMonth()) < 10) {
    updated_months = `0${updatedDate.getMonth()}`
  } else {
    updated_months = `${updatedDate.getMonth()}`
  }
  let updated = `${updatedDate.getFullYear()}-${updated_months}-${updatedDay}`

  for (let i = 0; i <= count; i++) {
    let currentDate = new Date(currentTimeDate.year, (currentTimeDate.month), ((currentTimeDate.day + i)))
    let currentDay
    if ((currentDate.getDate()) < 10) {
      currentDay = `0${currentDate.getDate()}`
    } else {
      currentDay = `${currentDate.getDate()}`
    }
    let current_months
    if ((currentDate.getMonth()) < 10) {
      current_months = `0${currentDate.getMonth()}`
    } else {
      current_months = `${currentDate.getMonth()}`
    }
    let checkDate = `${currentDate.getFullYear()}-${current_months}-${currentDay}`

    if (checkDate == updated) {
      return true;
    }

  }
  return false
}

function isCurrentTimeAfter(inputTime, now) {
  var isValid = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputTime);
  if (isValid) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * +5.5));
    var currentTime = new Date(nd);

    const currentTimeDate = {
      year: currentTime.getFullYear(),
      month: currentTime.getMonth() + 1,
      day: currentTime.getDate()
    };
    // console.log("now_obj", currentTimeDate)
    const endTimeDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };
    // console.log("endTimeDate", endTimeDate)
    let value = {
      "hour" : currentTime.getHours(),
      "mins" : currentTime.getMinutes()
    }
    let currentHours = currentTime.getHours();
    if (value.hour < 10) {
      currentHours = `0${currentTime.getHours()}`
    } else {
      currentHours = currentTime.getHours()
    }

    let currentMinutes 
    if (value.mins < 10) {
      currentMinutes = `0${currentTime.getMinutes()}`
    } else {
      currentMinutes = currentTime.getMinutes()
    }

    let currentTimeCheck = `${currentHours}:${currentMinutes}`

    let [hours, minutes] = inputTime.split(':');
    // let inputTimeCheck = `${hours}:${minutes}`
    // console.log(inputTimeCheck > currentTimeCheck)
    // if (currentTimeCheck < inputTimeCheck) {
    //   return true
    // } else {
    //   return false;
    // }
    if ((((currentTimeDate.day > endTimeDate.day) || (currentTimeDate.day < endTimeDate.day)) && (currentTimeDate.month < endTimeDate.month)) && (currentTimeDate.year <= endTimeDate.year)) {

      var inputTimeCheck = `${hours}:${minutes}`
      return true

    } else if (((currentTimeDate.day < endTimeDate.day) && (currentTimeDate.month == endTimeDate.month)) && (currentTimeDate.year <= endTimeDate.year)) {
      var inputTimeCheck = `${hours}:${minutes}`
      return true
    }else if ((currentTimeDate.day == endTimeDate.day) && (currentTimeDate.month == endTimeDate.month) && (currentTimeDate.year <= endTimeDate.year)) {
      var inputTimeCheck = `${hours}:${minutes}`
      if (currentTimeCheck < inputTimeCheck) {
        return true
      } else {
        return false;
      }
    }
    // else {
    //   return false;
    // }

  }
  return false
}

function endTimeCheck(inputTime, now) {
  var isValid = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputTime);
  if (isValid) {
    let [currentHours, currentMinutes] = now.split(':')
    if (currentMinutes > 59) {
      return false
    }
    // let valueHour
    // let valueMinute
    // if(currentHours < 10){
    //   valueHour = `0${currentHours}`
    // }else if(currentMinutes < 10) {
    //   valueMinute = `0${currentMinutes}`
    // }
    // let value = `${valueHour}:${valueMinute}`
    let latestHour
    let latestMinutes//fail
  
    if ((Number(currentMinutes) + 15) < 60) {
      latestMinutes = Number(currentMinutes)
      latestHour = Number(currentHours)
    } else {
      latestHour = Number(currentHours) + 1
      latestMinutes = (Number(currentMinutes) + 15) - 60
     
    }

    if (latestHour > 23) {
      return false
    } else if (latestMinutes > 59) {
      return false
    }

    if (latestHour < 10) {
      latestHour = `0${latestHour}`
    }
    if(latestMinutes < 10) {
      latestMinutes = `0${latestMinutes}`
    }

    let nowTime = `${latestHour}:${latestMinutes}`
    let [hours, minutes] = inputTime.split(':')
    var inputTimeCheck = `${hours}:${minutes}`
    if (now < inputTimeCheck) {
      if (nowTime < inputTimeCheck) {
        return true
      } else {
        return 1
      }
    } else {
      return false
    }

  } else {
    return false
  }

}

function dataCount(now_obj, end, count) {
  // console.log(now_obj,end)
  for (let i = 0; i <= count; i++) {
    let currentDate = new Date(now_obj.year, (now_obj.month), ((now_obj.day + i)))
    // console.log('jjjj',currentDate)
    let currentDay
    if ((currentDate.getDate()) < 10) {
      currentDay = `0${currentDate.getDate()}`
    } else {
      currentDay = `${currentDate.getDate()}`
    }
    let current_months
    if ((currentDate.getMonth()) < 10) {
      current_months = `0${currentDate.getMonth()}`
    } else {
      current_months = `${currentDate.getMonth()}`
    }
    let checkDate = `${currentDate.getFullYear()}-${current_months}-${currentDay}`

    // console.log(checkDate)
    if (checkDate == end) {
      return i;
    }

  }

}

function checkTime(getDate, data) {
  // console.log("Check",getDate,data)
  let value = []
  for (let i = 0; i < getDate.length; i++) {
    if ((getDate[i].schedule_starttime <= data.schedule_starttime && getDate[i].schedule_endtime >= data.schedule_starttime && getDate[i].schedule_endtime <= data.schedule_endtime)) {
      getDate[i].schedule_endtime = data.schedule_endtime
      value.push(getDate[i])
    } else if ((getDate[i].schedule_starttime >= data.schedule_starttime && getDate[i].schedule_starttime <= data.schedule_endtime && getDate[i].schedule_endtime >= data.schedule_endtime)) {
      getDate[i].schedule_starttime = data.schedule_starttime
      value.push(getDate[i])
    } else if ((getDate[i].schedule_starttime >= data.schedule_starttime && getDate[i].schedule_endtime <= data.schedule_endtime)) {
      getDate[i].schedule_starttime = data.schedule_starttime
      getDate[i].schedule_endtime = data.schedule_endtime
      value.push(getDate[i])
    } else if ((getDate[i].schedule_starttime <= data.schedule_endtime && getDate[i].schedule_endtime >= data.schedule_endtime)) {
      getDate[i].schedule_endtime = data.schedule_endtime
      value.push(getDate[i])
    }
  }
  // console.log("Check",value)
  return value
}

function UpdateDateTime(get_date) {
  let minStartTime = get_date[0].schedule_starttime;
  let maxEndTime = get_date[0].schedule_endtime;

  for (let i = 1; i < get_date.length; i++) {
    if (get_date[i].schedule_starttime < minStartTime) {
      minStartTime = get_date[i].schedule_starttime;
    }

    if (get_date[i].schedule_endtime > maxEndTime) {
      maxEndTime = get_date[i].schedule_endtime;
    }
  }
  let TimeValid = {
    "startTime": `${minStartTime}`,
    "endTime": `${maxEndTime}`
  }
  return TimeValid;
}

function validTimeMax(a) {
  let maxTime = Math.max(...a.map(time => {
    let [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
  }));

  var value = maxTime
  // console.log((value))
  let hour
  let add = Math.floor(value / 60)
  if (add < 10) {
    hour = `0${add}`
  } else {
    hour = add
  }
  let mins
  let b = value % 60
  if (b < 10) {
    mins = `0${b}`
  } else {
    mins = b
  }

  // console.log(typeof hour, hour)
  var minValid = mins.toString();
  var hourValid = hour.toString()
  const data = `${hourValid}:${minValid}`
  return data

}

function validTimeMin(a) {
  let maxTime = Math.min(...a.map(time => {
    let [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
  }));

  var value = maxTime
  // console.log((value))
  let hour
  let add = Math.floor(value / 60)
  if (add < 10) {
    hour = `0${add}`
  } else {
    hour = add
  }
  let mins
  let b = value % 60
  if (b < 10) {
    mins = `0${b}`
  } else {
    mins = b
  }

  // console.log(typeof hour, hour)
  var minValid = mins.toString();
  var hourValid = hour.toString()
  const data = `${hourValid}:${minValid}`
  return data

}



module.exports = { validDate, isDateBeforeToday, isCurrentTimeAfter, dataCount, UpdateDateTime, endTimeCheck, checkTime, validDateCollection }