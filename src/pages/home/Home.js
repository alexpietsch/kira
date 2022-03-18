import ListBoard from "../../components/ListBoard";
import { v4 as uuidv4 } from "uuid"
import { useState } from "react";
import TaskAdd from "../../components/TaskAdd";

const initialTasks = [
  {
      id: uuidv4(),
      taskName: "ToDo-1",
      worker: "aal"
  }
]

export default function Home() {

  const [tasks, setTasks] = useState([...initialTasks])

  return (
    <div>
      <br />
      <TaskAdd tasks={tasks} setTasks={setTasks} />
      <ListBoard tasks={tasks} setTasks={setTasks} />
    </div>
  )
}