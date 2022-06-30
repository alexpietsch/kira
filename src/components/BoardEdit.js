import React, { useState } from 'react'

// hooks
import { useFirestore } from "../hooks/useFirestore"
import { useHistory } from "react-router-dom"

// components
import ConfirmModal from './ConfirmModal';

// mui components
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
    //Dialog
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';

export default function ColumnEdit({ boardData, setBoardData, isBoardEditOpen, setIsBoardEditOpen }) {

    const { changeDocument, deleteDocument } = useFirestore("tasks")
    
    const history = useHistory()

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [boardName, setBoardName] = useState(boardData.boardName)
    const [isEdit, setIsEdit] = useState({state: true, text: "Edit"})

    function handleEditButton(e){
        e.preventDefault()

        if(isEdit.state){
            setIsEdit({state: false, text: "Save Changes"})
        } else {
            let newBoardData = boardData
            
            // update board name
            newBoardData = {
                ...newBoardData,
                boardName: boardName
            }

            // update boardData
            setBoardData(newBoardData)
            changeDocument(boardData.boardID, newBoardData)

            setIsEdit({state: true, text: "Edit"})
            setIsBoardEditOpen(false)
        }
    }

    function handleDeleteBoard(){
        deleteDocument(boardData.boardID)
        history.push("/")
        // updateDocument(boardData.boardID, {columns: newState.columns})
    }

    return (
    <>
    {showConfirmModal && <ConfirmModal 
        title={"Delete Board?"}
        message={"Do you want to delete this Board?"}
        handleYesAction={handleDeleteBoard}
        handleNoAction={() => {
            setShowConfirmModal(false)
        }} />}

    <Dialog
        open={isBoardEditOpen}
        fullWidth={true}
        style={{ minWidth: "300px" }}>
        <DialogTitle>Edit Board</DialogTitle>
        <DialogContent>
            <br />
            <TextField
                size='small'
                label="Board Name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                InputProps={{
                    readOnly: isEdit.state
                }}
            />
            <Box m={2}>
                <Divider variant='fullWidth'/>
            </Box>
            <Button color="error" variant="contained" onClick={setShowConfirmModal}>Delete Board</Button>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsBoardEditOpen(false)} color="primary">Cancel</Button>
            <Button variant="contained" onClick={handleEditButton}>{isEdit.text}</Button>
        </DialogActions>
    </Dialog>
    </>
  )
}
