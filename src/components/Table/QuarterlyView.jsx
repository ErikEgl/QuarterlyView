import { Table } from "react-bootstrap";
import { useState, useContext } from "react";
import { UserContext } from "../../utils/useContext";
import { nanoid } from "nanoid";

const QuarterlyView = () => {
  const {tasks, createNewTask, updateTask} = useContext(UserContext);

  const todaysQuarter = Math.floor((new Date(2022, 0, 1).getMonth() + 3) / 3);
  const [currentQuarter, setCurrentQuarter] = useState(todaysQuarter);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());


  function getISO8601_week_no(day) { // day is monday
    day.setDate(day.getDate() + 3); // move day from monday to thursday
    const firstThursday = day.valueOf(); //get timestamp
    const firstJanuary = new Date(day.setMonth(0, 1)); // set day to 1st january
    const januarysFirstThursday = firstJanuary;
    while (januarysFirstThursday.getDay() != 4) {
      januarysFirstThursday.setDate(januarysFirstThursday.getDate() + 1); // if day is not thursday move day forward to thursday
    }
    const oneWeek = 604800000;
    return 1 + Math.ceil((firstThursday - januarysFirstThursday) / oneWeek);
  }

  const getWeeksInQuarter = (quarter, year) => {
    const weeks = [];
    const quarterFirstDay = new Date(year, (quarter - 1) * 3, 1);
    const quarterLastDay = new Date(year, quarter * 3, 0);

    while (quarterFirstDay.getDay() != 1) {
      quarterFirstDay.setDate(quarterFirstDay.getDate() + 1); // if day is not monday move day forward till get monday
    }
    const currentMonday = quarterFirstDay;
    while (currentMonday <= quarterLastDay) {
      const currentSunday = new Date(currentMonday);
      currentSunday.setDate(currentMonday.getDate() + 6); // move day from monday to sunday
      weeks.push({
        start: new Date(currentMonday),
        end: currentSunday,
        number: getISO8601_week_no(new Date(currentMonday)),
      });
      currentMonday.setDate(currentMonday.getDate() + 7); // move day to the next week
    }
    return weeks;
  };

  const renderMonthHeader = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const startMonth = (currentQuarter - 1) * 3;
    const headers = [];

    for (let i = 0; i < 3; i++) {
      const monthIndex = startMonth + i;
      const monthName = monthNames[monthIndex];
      const weeks = getWeeksInQuarter(currentQuarter, currentYear);

      let colSpanSize = 0;
      {
        weeks.map((item) => {
          if (new Date(item.start).getMonth() === monthIndex) {
            colSpanSize++;
          }
        });
      }
      headers.push(
        <th className="p-0" colSpan={colSpanSize} key={monthIndex}>
          <table style={{ tableLayout: "fixed", width: "100%" }}>
            <thead>
              <tr>
                <th colSpan={colSpanSize} className="text-center">
                  <h4>{monthName}</h4>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {weeks.map((item) => {
                  if (new Date(item.start).getMonth() === monthIndex) {
                    return (
                      <td className="text-center" key={item.number}> 
                        {item.number}  
                      </td>
                    ); // render week number
                  }
                })}
              </tr>
            </tbody>
          </table>
        </th>
      );
    }

    return headers;
  };

  const renderTaskRow = ({ name, start, end, id }) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const weeks = getWeeksInQuarter(currentQuarter, currentYear);
    const cells = [];

    for (let week of weeks) {
      const cellClassName =
        week.start <= endDate && week.end >= startDate ? "bg-success" : "";
      cells.push(
        <td key={`${id}-${week.number}`} className={cellClassName}></td>
      );
    }
    return (
      <tr key={id}>
        <td title={`Description of ${name}`}>{name}</td>
        <td> 
          <input
              type="date"
              placeholder="Start date"
              onChange={() => updateTask(e, id) }
              name="start"
              value={start}
          />
        </td>
        <td>
        <input
              type="date"
              placeholder="End date"
              onChange={(e) => updateTask(e, id)}
              name="end"
              value={end}
              id={`endDate-${id}`}
          />
        </td>
        {cells}
      </tr>
    );
  };

  const handlePreviousQuarterClick = () => {
    setCurrentQuarter((prevQuarter) =>
      prevQuarter === 1 ? 4 : prevQuarter - 1
    );
    setCurrentYear((prevYear) =>
      currentQuarter === 1 ? prevYear - 1 : prevYear
    );
  };

  const handleNextQuarterClick = () => {
    setCurrentQuarter((prevQuarter) =>
      prevQuarter === 4 ? 1 : prevQuarter + 1
    );
    setCurrentYear((prevYear) =>
      currentQuarter === 4 ? prevYear + 1 : prevYear
    );
  };

  return (
    <>
      <div className="d-flex">
        <h1>{`Quarter ${currentQuarter} ${currentYear}`}</h1>
        <div className="mx-auto">
          <button
            className="text-dark fw-semibold btn btn-success btn-lg me-1 rounded-0"
            onClick={handlePreviousQuarterClick}
          >{`< Previous 3 Months`}</button>
          <button
            className="text-dark fw-semibold btn btn-success btn-lg rounded-0"
            onClick={handleNextQuarterClick}
          >{`Next 3 Months >`}</button>
        </div>
        <button 
          disabled={tasks && tasks.length == 10}
          onClick={createNewTask}
          className="text-dark fw-semibold btn btn-success btn-lg me-1 rounded-0"
        >
          {tasks && tasks.length != 10 ? 'Add task +' : "Maximum Number of Tasks Allowed Has Been Reached"} 
        </button>
      </div>
      <Table bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
        <thead>
          <tr>
            <th>Task</th>
            <th>Start Date</th>
            <th>End Date</th>
            {renderMonthHeader()}
          </tr>
        </thead>
        {tasks && <tbody>{tasks.map(renderTaskRow)}</tbody>}
      </Table>
    </>
  );
};

export default QuarterlyView;
