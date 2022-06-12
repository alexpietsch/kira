import { useState } from 'react'

// hooks
import { useFirestore } from "../hooks/useFirestore"

// components
import ConfirmModal from './ConfirmModal';

// mui components
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button } from "@mui/material";
    //Dialog
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';

export default function ColumnEdit({boardData, setBoardData, isEditColumnOpen, setIsEditColumnOpen, modalActiveColumn, setModalActiveColumn }) {

    const { updateDocument } = useFirestore("tasks_new_structure")

    const [showConfirmModal, setShowConfirmModal] = useState(false)

    function handleDeleteColumn(){
        let newState = boardData
        const indexOfColumn = newState.columns.findIndex((column) => column.columnID === modalActiveColumn)
        // remove the column from the columns array
        newState.columns.splice(indexOfColumn, 1)
        setBoardData(newState)
        setShowConfirmModal(false)
        setIsEditColumnOpen(false)
        updateDocument(boardData.boardID, {columns: newState.columns})
    }

    return (
    <>
    {showConfirmModal && <ConfirmModal 
        title={"Delete Column?"}
        message={"Do you want to delete this Column?"}
        handleYesAction={handleDeleteColumn}
        handleNoAction={() => {
            setShowConfirmModal(false)
            setModalActiveColumn(null)
            }} />}

    <Dialog
        open={isEditColumnOpen}
        fullWidth={true}
        style={{ minWidth: "300px" }}>
        <DialogTitle>Edit column</DialogTitle>
        <DialogContent>
            <Button color="error" variant="contained" onClick={setShowConfirmModal}>Delete column</Button>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsEditColumnOpen(false)} color="primary">Cancel</Button>
        </DialogActions>
    </Dialog>
    </>
  )
}
