

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

function isDateBeforeToday(date) {
  let normalizedDate = new Date(date.toDateString());
  console.log("normal date ", normalizedDate)
  let currentDate = new Date(new Date().toDateString());
  console.log("current Date ", currentDate)
  return normalizedDate >= currentDate;
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
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();

    var currentTimeCheck = `${currentHours}:${currentMinutes}`

    let [hours, minutes] = inputTime.split(':');
    if ((((currentTimeDate.day < endTimeDate.day) || ((currentTimeDate.day > endTimeDate.day) && (currentTimeDate.month < endTimeDate.month))) && (currentTimeDate.month <= endTimeDate.month)) && (currentTimeDate.year <= endTimeDate.year)) {

      var inputTimeCheck = `${hours}:${minutes}`
      // console.log(inputTimeCheck)
      return true

    } else if ((currentTimeDate.day == endTimeDate.day) && (currentTimeDate.month == endTimeDate.month) && (currentTimeDate.year == endTimeDate.year)) {
      if (currentTimeCheck < inputTimeCheck) {
        return true
      } else {
        return false;
      }
    }
    else {
      return false;
    }

  }
  return false
}

function dataCount(now_obj, end) {
  for (let i = 0; i != undefined; i++) {
    let currentDate = new Date(now_obj.year, now_obj.month, (now_obj.day + i))
    let currentDay
    if ((currentDate.getDate() + 1) <= 10) {
      currentDay = `0${currentDate.getDate()}`
    } else {
      currentDay = `${currentDate.getDate()}`
    }
    let current_months
    if ((currentDate.getMonth() + 1) <= 10) {
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

async function UpdateDateTime(get_date, available) {
  let min = []
  let max = []
  for (let i = 0; i < get_date.length; i++) {
    if ((get_date[i].schedule_starttime <= available.schedule_starttime) && (get_date[i].schedule_endtime >= available.schedule_endtime)) {
      min.push(get_date[i].schedule_starttime)
      max.push(get_date[i].schedule_endtime)

    } else if ((get_date[i].schedule_starttime >= available.schedule_starttime) && (get_date[i].schedule_endtime <= available.schedule_endtime)) {
      min.push(available.schedule_starttime)
      max.push(available.schedule_endtime)

    } else if ((get_date[i].schedule_starttime <= available.schedule_starttime) && (get_date[i].schedule_endtime <= available.schedule_endtime)) {
      min.push(get_date[i].schedule_starttime)
      max.push(available.schedule_endtime)

    } else if ((get_date[i].schedule_starttime >= available.schedule_starttime) && (get_date[i].schedule_endtime >= available.schedule_endtime)) {
      min.push(available.schedule_starttime)
      max.push(get_date[i].schedule_endtime)
    }
  }
  let endTime = validTimeMax(max)
  let startTime = validTimeMin(min)
  let TimeValid = {
    "startTime": startTime,
    "endTime": endTime
  }

  return TimeValid;
}

function validTimeMax(a) {
  let maxTime = Math.min(...a.map(time => {
    let [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
  }));

  var value = maxTime
  console.log((value))
  let hour = Math.floor(value / 60)
  let mins = value % 60

  console.log(typeof hour, hour)
  var hourMin = mins.toString();
  var vadild = hour.toString()
  const data = `${hour}:${hourMin}`
  return data

}

function validTimeMin(a) {
  let maxTime = Math.min(...a.map(time => {
    let [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
  }));

  var value = maxTime
  console.log((value))
  let hour = Math.floor(value / 60)
  let mins = value % 60

  console.log(typeof hour, hour)
  var hourMin = mins.toString();
  var vadild = hour.toString()
  const data = `${hour}:${hourMin}`
  return data

}



module.exports = { validDate, isDateBeforeToday, isCurrentTimeAfter, dataCount, UpdateDateTime }
