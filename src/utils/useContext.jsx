import { useState, useEffect, createContext } from "react";
import { nanoid } from "nanoid";
const UserContext = createContext();

function AppContextProvider(props) {
  const [tasks, setTasks] = useState(
    () =>
      JSON.parse(localStorage.getItem("tasks")) || [
        {
          name: "Task 1",
          start: "2022-12-31",
          end: "2023-02-05",
          id: 1,
        },
      ]
  );
  const [tasksCounter, setTasksCounter] = useState(tasks.length);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function createNewTask() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate();
    const newTask = {
      name: `Task ${tasksCounter}`,
      start: `${year}-${month + 1}-${day}`,
      end: `${year}-${month + 1}-${day + 1}`,
      id: nanoid(),
    };
    setTasksCounter((prevCount) => prevCount + 1);
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }
  function updateTask(event, id) {
    const { name, value } = event.target;
    setTasks((prevTasks) =>
      prevTasks.map((prevTask) =>
        prevTask.id === id ? { ...prevTask, [name]: value } : prevTask
      )
    );
  }
  function deleteTask(taskId) {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(filteredTasks);
  }

  return (
    <UserContext.Provider
      value={{ createNewTask, updateTask, deleteTask, tasks }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export { AppContextProvider, UserContext };
