import { useState, useEffect, createContext, useId } from "react";
const UserContext = createContext();

function AppContextProvider(props) {
  const [tasks, setTasks] = useState(
    () => JSON.parse(localStorage.getItem("tasks")) || 
    [{
      name: "Task 1",
      start: "2022-12-31",
      end: "2023-02-05",
      id: 1
    }]
  );


  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function createNewTask() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const day = new Date().getDate()
    const newTask = {
      name: `Task ${tasks.length +1}`,
      start: `${year}-${month+1}-${day}`,
      end: `${year}-${month+1}-${day + 1}`,
      id: tasks.length + 1,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }
console.log(tasks);
  function updateTask(event, id) {
    const { name, value } = event.target;
    console.log(name, value, id);
    setTasks(prevTasks => {
      prevTasks.map((prevTask) => {
        console.log(prevTask.id);
        prevTask.id === id ? 
        {...prevTask, [name]: value} : 
        {...prevTask}
      })
    })
}
  function deleteTask(event, taskId) {
    event.stopPropagation();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    setTasks(filteredTasks);
  }


  return (
    <UserContext.Provider value={{ createNewTask, updateTask, tasks }}>
      {props.children}
    </UserContext.Provider>
  );
}

export { AppContextProvider, UserContext };
