import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore";
import { useState } from "react"
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"

// mui components
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';

export default function NewBoard() {
    const { user } = useAuthContext()
    const { addDocumentCustomId } = useFirestore("tasks_new_structure")
    const history = useHistory();

    const [boardName, setBoardName] = useState("")
    const [boardDescription, setBoardDescription] = useState("")

    const [isBoardNameError, setBoardNameError] = useState(false)
    const [boardnameHelperText, setBoardnameHelperText] = useState("")

    function handleSubmit(e) {
        e.preventDefault()

        if(boardName.length === 0){
            setBoardnameHelperText("Boardname is required")
            setBoardNameError(true)
            return
        } else {
            setBoardnameHelperText("")
            setBoardNameError(false)
        }

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
        history.push("/")
    }

  return (
    <div>
        <h1>Create a New Board</h1>
        <form>
            <label>
                <TextField
                    required
                    label="Boardname"
                    onChange={(e) => setBoardName(e.target.value)}
                    value={boardName}
                    size="small"
                    sx={{ width: "20vw" }}
                    error={isBoardNameError}
                    helperText={boardnameHelperText}
                />
            </label>
            <br />
            <label>
                <TextField
                    label="Board Description"
                    onChange={(e) => setBoardDescription(e.target.value)}
                    value={boardDescription}
                    size="small"
                    sx={{ width: "30vw", marginTop: "1em" }}
                    multiline
                    rows={4}
                />
            </label>
            <br />
            <Button type="submit" variant="contained" onClick={handleSubmit} sx={{ margin: "1em" }}>Create Board</Button>
        </form>
    </div>
  )
}