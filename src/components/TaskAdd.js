import { useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { useFirestore } from "../hooks/useFirestore"
import { timestamp } from "../firebase/config"

export default function TaskAdd({ boardData, setBoardData, setIsModalOpen, sourceColumnID }) {

    const [cardName, setCardName] = useState("")
    const [cardWorker, setCardWorker] = useState("")
    const [deadline, setDeadline] = useState("")
    const { updateDocument } = useFirestore("tasks_new_structure")

    const handleSubmit = (e) => {
        e.preventDefault()
        const card = {
            cardID: uuidv4(),
            cardName,
            cardWorker,
            cardDeadline: deadline ? timestamp.fromDate(new Date(deadline)) : null,
            cardCreated: timestamp.fromDate(new Date()),
            cardLabels: []

        }
        let newBoardData = boardData
        // get column from boardData.columns 
        const column = newBoardData.columns.find(column => column.columnID === sourceColumnID)
        // add new task to column
        column.cards.push(card)
        const isTargetColumn = (column) => column.columnID === sourceColumnID
        const indexOfColumn = newBoardData.columns.findIndex(isTargetColumn)
        newBoardData.columns[indexOfColumn] = column
        setBoardData(newBoardData)
        // updateDocument(boardData.boardID, {columns: newBoardData.columns})
        setCardName("")
        setCardWorker("")
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
                    onChange={(e) => setCardName(e.target.value)}
                    value={cardName}
                />
            </label>
            <br/>
            <label>
                <span>Bearbeiter:</span>
                <input 
                    type="text"
                    onChange={(e) => setCardWorker(e.target.value)}
                    value={cardWorker}
                />
            </label>
            <br/>
            <label>
                <span>Deadline:</span>
                <input 
                    type="date"
                    onChange={(e) => setDeadline(e.target.value)}
                    value={deadline}
                />
            </label>
            <br/>
            <button className="button-dark">Add task</button>    
        </form>
    </>
  )
}