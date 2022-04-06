import ListBoard from "../../components/ListBoard";
import Test from "../../components/Test";
import { v4 as uuidv4 } from "uuid"
import { useState } from "react";
import TaskAdd from "../../components/TaskAdd";
import { useAuthContext } from "../../hooks/useAuthContext"
import { useCollection } from "../../hooks/useCollection"
import { useFirestore } from "../../hooks/useFirestore";

const initialTasks = {
  columns: [{title: "ToDo", id: "b5dff43e-81b6-43cf-aa7a-52e125c97b7c"},{title: "In Work", id: "dbdcbe1c-b3f0-4fa8-85ff-4774db63cd3d"}, {title: "Done", id: "98bffe0f-25d3-4801-b760-92eadf98f5b4"}],
  cards: [
    {title: "todo-1", worker: "gei", belongsTo: "b5dff43e-81b6-43cf-aa7a-52e125c97b7c"},
    {title: "todo-2", worker: "gei", belongsTo: "b5dff43e-81b6-43cf-aa7a-52e125c97b7c"},
    {title: "todo-3", worker: "gek", belongsTo: "b5dff43e-81b6-43cf-aa7a-52e125c97b7c"},
    {title: "todo-61", worker: "gek", belongsTo: "dbdcbe1c-b3f0-4fa8-85ff-4774db63cd3d"}
  ]
}
// [
//   [
//     {
//       id: uuidv4(),
//       taskName: "ToDo-41",
//       worker: "hio"
//     },
//     {
//       id: uuidv4(),
//       taskName: "ToDo-321",
//       worker: "lwh"
//     }
//   ],[
//     {
//       id: uuidv4(),
//       taskName: "DoTo-61",
//       worker: "kbm"
//     }
//   ]
//]


export default function Home() {

  const { addDocument, response } = useFirestore("tasks")
  const { user } = useAuthContext()
  const { documents, error } = useCollection(
    "tasks", 
    ["user", "==", user.uid])
  // const [ userData, setUserData ] = useState([...documents])
 

  const addToFb = () => {
    // addDocument(initialTasks)
    console.log(documents)
    // const data = [...documents]
    // documents.forEach(element => {
    //   data.push(element)
    // })
    // console.log("data:",data.cards, user.uid)
  }
  
  // const data = Object.values(documents)
  // console.log("data:",data)
  
  // const get = () => {
    
  //   arr.forEach(element => {
  //     console.log(element)
  //   });
  // }
  
  
  

  return (
    <div>
      <button onClick={addToFb}>get</button>
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