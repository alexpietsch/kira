import { useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { useFirestore } from "../hooks/useFirestore"
import { timestamp } from "../firebase/config"

export default function TaskAdd({ boardData, columnId, setBoardData, setIsModalOpen }) {

    const [taskName, setTaskName] = useState("")
    const [worker, setWorker] = useState("")
    const { updateDocument } = useFirestore("tasks_new_structure")

    const handleSubmit = (e) => {
        e.preventDefault()

        const card = {
            cardID: uuidv4(),
            cardName: taskName,
            cardWorker: worker,
            cardDeadline: null,
            cardCreated: timestamp.fromDate(new Date()),
            cardLabels: [
                {
                    labelID: uuidv4(),
                    labelName: "test",
                    labelColor: "e03857"
                }
            ]

        }
        let newBoardData = boardData
        // get column from boardData.columns 
        const column = newBoardData.columns.find(column => column.columnID === columnId)
        // add new task to column
        column.cards.push(card)
        const isTargetColumn = (column) => column.columnID === columnId
        const indexOfColumn = newBoardData.columns.findIndex(isTargetColumn)
        newBoardData.columns[indexOfColumn] = column
        setBoardData(newBoardData)
        updateDocument(boardData.boardID, {columns: newBoardData.columns})
        setTaskName("")
        setWorker("")
        setIsModalOpen(false)
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