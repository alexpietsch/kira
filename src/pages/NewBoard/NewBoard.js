import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore";
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

export default function NewBoard() {
    const { user } = useAuthContext()
    const { addDocumentCustomId, response } = useFirestore("tasks_new_structure")

    const [boardName, setBoardName] = useState("")
    const [boardDescription, setBoardDescription] = useState("")

    function handleSubmit(e) {
        e.preventDefault()
        const board = {
            boardID: uuidv4(),
            boardName,
            boardDescription,
            boardMember: [],
            columns: [],
            user: user.uid
        }
        setBoardName("")
        setBoardDescription("")
        addDocumentCustomId(board.boardID, board)
    }

  return (
    <div>
        <h1>Create a New Board</h1>
        <form onSubmit={handleSubmit}>
            <label>
                <span>Boardname:</span>
                <input
                    type="text"
                    required
                    onChange={(e) => setBoardName(e.target.value)}
                    value={boardName}
                />
            </label>
            <br />
            <label>
                <span>Description:</span>
                <textarea
                    onChange={(e) => setBoardDescription(e.target.value)}
                    value={boardDescription}
                    rows="5"
                    cols="50"
                    style={{ resize: "none" }}
                />
            </label>
            <br />
            <button type="submit" className="button-dark">Create Board</button>
        </form>
    </div>
  )
}