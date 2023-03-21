import { useContext } from "react";
import { UserContext } from "./utils/useContext";
import QuarterlyView from "./components/Table/QuarterlyView";
function App() {
  const {tasks} = useContext(UserContext);

  return (
    <div className="App">
      <QuarterlyView tasks={tasks} />
    </div>
  )
}

export default App
