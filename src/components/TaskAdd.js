import { useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { useFirestore } from "../hooks/useFirestore"

export default function TaskAdd({ boardData, columnId, setBoardData }) {

    const [taskName, setTaskName] = useState("")
    const [worker, setWorker] = useState("")
    const { updateDocument } = useFirestore("tasks")

    const handleSubmit = (e) => {
        e.preventDefault()
        const newTask = {
            belongsTo: columnId,
            id: uuidv4(),
            title: taskName,
            worker
        }
        let newBoardData = boardData
        newBoardData.cards.push(newTask)
        setBoardData(newBoardData)
        updateDocument(boardData.boardId, {cards: newBoardData.cards})
        setTaskName("")
        setWorker("")
    }

  return (
    <>
        <form onSubmit={handleSubmit}>
            <label>
                <span>Taskname: </span>
                <input 
                    type="text"
                    required
                    onChange={(e) => setTaskName(e.target.value)}
                    value={taskName}
                />
            </label>
            {/* <label>
                <span>Bearbeiter:</span>
                <input 
                    type="text"
                    required
                    onChange={(e) => setWorker(e.target.value)}
                    value={worker}
                />
            </label> */}
            <button>Add task</button>    
        </form>
    </>
  )
}