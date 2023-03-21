import { createContext } from "react";
const UserContext = createContext();



function AppContextProvider(props) {


  const tasks = [
    {
      name: "Task 1",
      start: "2022-12-31",
      end: "2023-02-05",
      id: "Task 1"
    },
    {
      name: "Task 2",
      start: "2023-01-15",
      end: "2023-02-18",
      id: "Task 2"
    },
    {
      name: "Task 3",
      start: "2023-02-06",
      end: "2023-03-12",
      id: "Task 3"
    },
    {
      name: "Task 4",
      start: "2023-02-20",
      end: "2023-03-26",
      id: "Task 4"
    },
    {
      name: "Task 5",
      start: "2023-04-20",
      end: "2023-05-26",
      id: "Task 5"
    }
  ];

  return (
    <UserContext.Provider
      value={{tasks}}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export { AppContextProvider, UserContext };

