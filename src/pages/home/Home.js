import ListBoard from "../../components/ListBoard";
import Test from "../../components/Test";
import { v4 as uuidv4 } from "uuid"
import { useState } from "react";
import TaskAdd from "../../components/TaskAdd";
import { useAuthContext } from "../../hooks/useAuthContext"
import { useCollection } from "../../hooks/useCollection"
import { useFirestore } from "../../hooks/useFirestore";

/* const initialTasks = {
  boardId: uuidv4(),
  boardName: "Work",
  columns: [{title: "ToDo", id: "e3fd2ae9-6212-4495-b175-cb6241b79202"},{title: "In Work", id: "dadaef8d-bd31-4d7a-bde7-d2ae0933bf12"}, {title: "Done", id: "98bffe0f-25d3-4801-b760-92eadf98f5b4"}],
  cards: [
    {title: "Move to new Server", worker: "gei", belongsTo: "e3fd2ae9-6212-4495-b175-cb6241b79202", id: uuidv4()},
    {title: "Clean old code", worker: "gei", belongsTo: "e3fd2ae9-6212-4495-b175-cb6241b79202", id: uuidv4()},
    {title: "Update version of Flux", worker: "gek", belongsTo: "e3fd2ae9-6212-4495-b175-cb6241b79202", id: uuidv4()},
    {title: "Clean office", worker: "gek", belongsTo: "dadaef8d-bd31-4d7a-bde7-d2ae0933bf12", id: uuidv4()}
  ],
  user: "VdQwAs4eakWVfpxeucyf5TxE2ml2"
} */


export default function Home() {

  const { addDocumentCustomId, response } = useFirestore("tasks")
  const { user } = useAuthContext()
  const { documents, error } = useCollection(
    "tasks", 
    ["user", "==", user.uid])
  // const [ userData, setUserData ] = useState([...documents])
 

  /* const addToFb = () => {
    addDocumentCustomId(initialTasks.boardId, initialTasks)
    // console.log(initialTasks.boardId, initialTasks)
    // const data = [...documents]
    // documents.forEach(element => {
    //   data.push(element)
    // })
    // console.log("data:",data.cards, user.uid)
  } */
  
  // const data = Object.values(documents)
  // console.log("data:",data)
  
  // const get = () => {
    
  //   arr.forEach(element => {
  //     console.log(element)
  //   });
  // }
  
  
  

  return (
    <div>
      {/* <button onClick={addToFb}>get</button> */}
      <br />
      {documents && <Test data={documents} />}
      {!documents && <p>Loading...</p>}
      {/* <TaskAdd tasks={tasks} setTasks={setTasks} />
      <ListBoard tasks={tasks} setTasks={setTasks} /> */}
      {/* <TaskAdd tasks={tasks} />
      <ListBoard tasks={tasks} /> */}
    </div>
  )
}