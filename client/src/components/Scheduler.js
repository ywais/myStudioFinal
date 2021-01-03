import { useEffect, useState } from "react";
import styled from 'styled-components';
import axios from 'axios';
import BookForm from "./BookForm.js";
// import SignIn from "./SignIn.js";

const CalendarCell = styled.div`
  grid-area: ${props => props.row} / ${props => props.column} / span ${props => props.duration || 1} / ${props => props.column + 1};
  background-color: ${props => props.status === 'scheduled first' ? '#fdeab4' : props.status === 'booked first' ? '#d9d9d9' : props.status === 'appended' ? '#ffb3b3' : 'white'};
  border-width: ${props => props.border === 'thin' ? '1px 1px 0 0' : props.border === 'horizontal' ? '1px 0 0 0' : '0'};
  border-style: solid;
  border-color: black;
  word-break: break-word;
  z-index: ${props => props.duration > 1 ? 10 : 5};
`

const Shader = styled.div`
  height: 70vh;
  width: 72vw;
  position: fixed;
  background-color: ${props => props.showForm === 'none' ? 'white' : 'rgba(128,128,128,0.4)'};
  z-index: ${props => props.showForm === 'none' ? '-' : ''}90;
`

const DateH2 = styled.h2`
  height: 1.5em;
  width: 1.5em;
  margin: 0 auto;
  border-radius: 50%;
  background-color: ${props => props.children === new Date().getDate() ? '#FEC627' : 'white'};
`


// TODO: why need 2 renders for new appointments
// TODO: reset form


function Scheduler(props) {
  const [week, setWeek] = useState([[]]);
  const [hours, setHours] = useState([]);
  const [showForm, setShowForm] = useState('none');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');

  const changeWeek = async (newWeek) => {
    const { data } = await axios.get(`http://localhost:8080/api/v1/scheduling/update/${newWeek}`);
    setWeek(data);
    setDate(data[0][0]);
  }

  const generateHours = () => {
    const hoursArray = new Array(48).fill();
    hoursArray.forEach((hour, index) => {
      if(index % 2 === 0) {
        hoursArray[index] = `${index < 20 ? 0 : ''}${index / 2}:00`;
      } else {
        hoursArray[index] = `${index < 20 ? 0 : ''}${(index - 1) / 2}:30`;
      }
    });
    setHours(hoursArray);
  }

  useEffect(() => {
    changeWeek('thisWeek');
    generateHours();
  }, []);

  // useEffect(() => {
  //   const weekCopy = [...week];
  //   setWeek(weekCopy);
  // }, [showForm]);

  const handleTileClick = (tileDate, tileHour) => {
    setShowForm('block');
    setDate(tileDate);
    setHour(tileHour);
  }

  const handleTileClose = () => {
    setShowForm('none');
    axios.post(
      'http://localhost:8080/api/v1/scheduling/unappend',
      {
        week: new Date(week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
        day: new Date(date).getDay(),
        hour: `${hour}:00`,
        userId: props.user ? props.user.id : 1 // send user and remove default
      }
    )
    .catch(e => console.log(e));
  }

  return (
    <div className='calendarContainer'>
      {/* {props.user ?
        <> */}
          <Shader showForm={showForm} onClick={handleTileClose}></Shader>
          <div className='calendar'>
            {/* <div className='calendarWeeks'>
              <button onClick={() => changeWeek('thisWeek')}>‹</button> // check current view and one disable button
              <button onClick={() => changeWeek('nextWeek')}>›</button> // check current view and one disable button
              <span>
                {week[0].length && `${new Date(week[0][0]).toLocaleDateString()} - ${new Date(week[5][0]).toLocaleDateString()}`}
              </span>
            </div> */}
            <div className='calendarDates'>
              <CalendarCell
                className='calendarToggle'
                row={1}
                column={1}
              >
                <div className='calendarMonths'>
                  <span>
                    {week[0].length && `${new Date(week[0][0]).getMonth() + 1}/${new Date(week[0][0]).getFullYear()}`}
                  </span>
                  <span>
                    {week[0].length && new Date(week[5][0]).getMonth() !== new Date(week[0][0]).getMonth() &&
                    ` - ${new Date(week[5][0]).getMonth() + 1}/${new Date(week[5][0]).getFullYear()}`}
                  </span>
                </div>
                <div className='calendarButtons'>
                  <button onClick={() => changeWeek('thisWeek')}>‹</button> {/* check current view and one disable button */}
                  <button onClick={() => changeWeek('nextWeek')}>›</button> {/* check current view and one disable button */}
                </div>
              </CalendarCell>
              {week[0].length && week.map((day, index) => 
                <CalendarCell
                  key={index}
                  className='calendarHeader'
                  row={1}
                  column={index + 3}
                >
                  <h5 className='calendarHeaderDay'>{`יום ${String.fromCharCode(`0x5D${index}`)}'`}</h5>
                  <DateH2 className='calendarHeaderDate'>{new Date(day[0]).getDate()}</DateH2>
                </CalendarCell>
              )}
            </div>
            <div className='calendarBody'>
              {hours.map((elemnt, index) =>
                index > 0 && index % 2 === 0 ?
                <CalendarCell
                  key={index}
                  className='calendarHour'
                  row={index + 1}
                  column={1}
                >
                  {elemnt}
                </CalendarCell> : ''
              )}
              {hours.map((elemnt, index) =>
                index % 2 === 0 ?
                <CalendarCell
                  key={index}
                  className='calendarLine'
                  row={index + 1}
                  column={2}
                  border='horizontal'
                >
                </CalendarCell> : ''
              )}
              {week[0].length && week.map((day, columnIndex) => 
                day.slice(1).map((hour, rowIndex) => 
                  <CalendarCell
                    key={`${columnIndex}, ${rowIndex}`}
                    className='calendarTile'
                    row={rowIndex + 1}
                    column={columnIndex + 3}
                    duration={hour.duration}
                    status={hour.status}
                    border='thin'
                    onClick={() => hour.status === 'available' && handleTileClick(day[0], hours[rowIndex])}
                  >
                    {
                      hour.status.slice(-5) === 'first' ?
                      <div className='appointmentTile'>
                        <h5 className='tilePreview' id='tileHeader'>{hour.title}</h5>
                        <p className='tilePreview' id='tileHours'>{hour.startHour}-{hour.endHour}</p>
                        <p className='tilePreview' id='tileGroup'>{hour.groupNAME}</p>
                        <p className='tilePreview' id='tileUser'>{hour.userName}</p>
                      </div> :
                      ''
                    }
                  </CalendarCell>
                )
              )}
            </div>
          </div>
        {/* </> :
        <SignIn />
      } */}
      <BookForm showForm={showForm} setShowForm={setShowForm} /*setWeek={setWeek}*/ date={date} hour={hour} week={week} /> {/* send user */}
    </div>
  );
}

export default Scheduler;
