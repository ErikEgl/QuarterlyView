import { Table } from "react-bootstrap";
import { useState, useContext } from "react";
import { UserContext } from "../../utils/useContext";
import { nanoid } from "nanoid";

const QuarterlyView = () => {
  const { tasks, createNewTask, updateTask, deleteTask } =
    useContext(UserContext);

  const todaysQuarter = Math.floor((new Date(2022, 0, 1).getMonth() + 3) / 3);
  const [currentQuarter, setCurrentQuarter] = useState(todaysQuarter);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  function getISO8601_week_no(day) {
    // day is monday
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
        <th className="p-0" colSpan={colSpanSize} key={nanoid()}>
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
                      <td className="text-center" key={nanoid()}>
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
      cells.push(<td key={nanoid()} className={cellClassName}></td>);
    }
    return (
      <tr key={nanoid()}>
        <td title={`Description of ${name}`}>
          <div className="d-flex gap-1 align-items-center justify-content-between">
            <p className="m-0">{name}</p>
            <button
              onClick={() => deleteTask(id)}
              className="border-0 bg-transparent p-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#000000"
                version="1.1"
                id="Capa_1"
                width="15px"
                height="15px"
                viewBox="0 0 482.428 482.429"
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098    c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117    h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828    C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879    C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096    c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266    c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979    V115.744z" />
                    <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07    c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z" />
                    <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07    c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z" />
                    <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07    c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z" />
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </td>
        <td className="p-0">
          <input
            className="w-100"
            type="date"
            placeholder="Start date"
            onChange={(e) => updateTask(e, id)}
            name="start"
            value={start}
          />
        </td>
        <td className=" p-0">
          <input
            className="w-100"
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
          {tasks && tasks.length != 10
            ? "Add task +"
            : "Maximum Number of Tasks Allowed Has Been Reached"}
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
