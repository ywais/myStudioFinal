require('dotenv').config();
const { Router } = require('express');
const mysql = require('mysql');
const router = Router();

let mysqlCon = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'database',
  multipleStatements: true
});

mysqlCon.connect(error => {
  if(error) console.error(error);
  else console.log('Connected!');
});

let thisWeek = [], nextWeek = [];

const calcEndHour = (startHour, duration) => {
  // TODO: verify again if past midnight?
  let endHH = parseInt(startHour.slice(0,2));
  let endMM = parseInt(startHour.slice(3,5));
  if(duration % 2 === 1) {
    if(endMM === 30) {
      endHH++;
      endMM = 0;
    } else endMM = 3;
    duration -= 1;
  }
  endHH += duration / 2;
  return `${endHH < 10 ? 0 : ''}${endHH}:${endMM}0`;
}

const calcHourPosition = fullHour => (
  (
    parseInt(fullHour.slice(0,2)) +
    (fullHour.slice(3,5) === '30' ? 0.5 : 0)
  ) * 2 + 1
)

const updateWeek = async (week) => {
  try {
    mysqlCon.query(`SELECT sch_id, sch_title, sch_start_date, sch_day, sch_hour, sch_duration, sch_end_date, gro_id, gro_name
    FROM sql_derech_haketzev.schedules
    LEFT JOIN sql_derech_haketzev.groups ON sch_group = gro_id
    WHERE sch_start_date <= '${week[5][0]}' AND sch_end_date >= '${week[0][0]}';`, (error, results, fields) => {
      if(error) throw error;
      results.length > 0 && results.forEach(appointment => {
        const hourPosition = calcHourPosition(appointment['sch_hour']);
        // save appointment details
        week[appointment['sch_day']][hourPosition].status = 'scheduled first';
        week[appointment['sch_day']][hourPosition].title = appointment['sch_title'];
        week[appointment['sch_day']][hourPosition].startHour = appointment['sch_hour'].slice(0,5);
        week[appointment['sch_day']][hourPosition].endHour = calcEndHour(appointment['sch_hour'].slice(0,5), appointment['sch_duration']);
        week[appointment['sch_day']][hourPosition].duration = appointment['sch_duration'];
        week[appointment['sch_day']][hourPosition].endDate = appointment['sch_end_date'];
        week[appointment['sch_day']][hourPosition].groupID = appointment['gro_id'];
        week[appointment['sch_day']][hourPosition].groupNAME = appointment['gro_name'];
        // reserve rest of appointment
        for(let i = 1; i < appointment['sch_duration']; i++) {
          week[appointment['sch_day']][hourPosition + i].status = 'scheduled';
        }
      });
    });
    
    mysqlCon.query(`SELECT boo_id, boo_title, boo_date, boo_hour, boo_duration, boo_is_open, boo_open_to, use_id, use_name, boo_notes
    FROM sql_derech_haketzev.booking
    LEFT JOIN sql_derech_haketzev.users ON boo_booked_by = use_id
    WHERE boo_date <= '${week[5][0]}' AND boo_date >= '${week[0][0]}';`, (error, results, fields) => {
      if(error) throw error;
      results.length > 0 && results.forEach(appointment => {
        const hourPosition = calcHourPosition(appointment['boo_hour']);
        const dayPosition = new Date(appointment['boo_date']).getDay();
        // save appointment details
        week[dayPosition][hourPosition].status = 'booked first';
        week[dayPosition][hourPosition].title = appointment['boo_title'];
        week[dayPosition][hourPosition].startHour = appointment['boo_hour'].slice(0,5);
        week[dayPosition][hourPosition].endHour = calcEndHour(appointment['boo_hour'].slice(0,5), appointment['boo_duration']);
        week[dayPosition][hourPosition].duration = appointment['boo_duration'];
        week[dayPosition][hourPosition].isOpen = appointment['boo_is_open'];
        week[dayPosition][hourPosition].openTo = appointment['boo_open_to'];
        week[dayPosition][hourPosition].userID = appointment['use_id'];
        week[dayPosition][hourPosition].userName = appointment['use_name'];
        week[dayPosition][hourPosition].notes = appointment['boo_notes'];
        // reserve rest of appointment
        for(let i = 1; i < appointment['boo_duration']; i++) {
          week[dayPosition][hourPosition + i].status = 'booked';
        }
      })
    });
  } catch (error) {
    throw error;
  }  
}

const initWeeks = async () => {
  try {
    //build weeks' arrays
    for(let i = 0; i < 6; i++) {
      thisWeek[i] = [];
      nextWeek[i] = [];
      for(let j = 0; j < 48; j++) {
        thisWeek[i][j] = ({status: 'available'});
        nextWeek[i][j] = ({status: 'available'});
      }
    }
    // push date to each day's array
    let thisSunday = new Date();
    thisSunday.getDay() > 0 ? thisSunday.setDate(thisSunday.getDate() - thisSunday.getDay()) : '';
    for(let i = 0; i < 6; i++) {
      let date = new Date(thisSunday);
      date.setDate(date.getDate() + i);
      thisWeek[i].unshift(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      date.setDate(date.getDate() + 7);
      nextWeek[i].unshift(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    }
    // get appointments from DB
    await updateWeek(thisWeek);
    await updateWeek(nextWeek);
  } catch (error) {
    throw error;
  }
}

try {
  initWeeks();
} catch (error) {
  console.error(error);
}

router.get('/', (req, res) => {
});
module.exports = router;
