import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useFirestore } from "../hooks/useFirestore"
import { timestamp } from "../firebase/config"
import { GithubPicker } from 'react-color'

import ConfirmModal from "./ConfirmModal"

// icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// MUI components
    //Dialog
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";

import "./TaskEdit.css"

export default function TaskEdit({ sourceCard , sourceColumn, boardData, setBoardData, isTaskEditModalOpen, setIsTaskEditModalOpen}) {
    const [showLabelCreator, setShowLabelCreator] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [isEdit, setIsEdit] = useState({state: true, text: "Edit"})

    const [cardName, setCardName] = useState(sourceCard.cardName)
    const [cardWorker, setCardWorker] = useState(sourceCard.cardWorker)
    const [deadline, setDeadline] = useState(sourceCard.cardDeadline ? sourceCard.cardDeadline.toDate().toString().toLocaleString('en-US') : null)
    const [cardDescription, setCardDescription] = useState(sourceCard.cardDescription)
    const [cardLabels, setCardLabels] = useState(sourceCard.cardLabels)

    const [newCardLabelName, setNewCardLabelName] = useState("")
    const [newCardLabelNameColor, setNewCardLabelNameColor] = useState("#fff")
    const [newCardLabelColor, setNewCardLabelColor] = useState("#b80000")
    const { updateDocument } = useFirestore("tasks")


    function handleEditButton(e){
        e.preventDefault()

        if(isEdit.state){
            setIsEdit({state: false, text: "Save Changes"})
        } else {
            let newBoardData = boardData
            // get column from boardData.columns 
            let newBoardDataColumn = newBoardData.columns.find(col => col.columnID === sourceColumn)
            // get card from column.cards
            let newBoardDataColumnCard = newBoardDataColumn.cards.find(card => card.cardID === sourceCard.cardID)
            
            // update card
            newBoardDataColumnCard = {
                ...newBoardDataColumnCard,
                cardName,
                cardWorker,
                cardDeadline: deadline ? timestamp.fromDate(new Date(deadline)) : null,
                cardDescription,
                cardLabels
            }

            // insert card to same position in column
            newBoardDataColumn.cards = newBoardDataColumn.cards.map(card => {
                if(card.cardID === sourceCard.cardID){
                    return newBoardDataColumnCard
                } else {
                    return card
                }})
            
            // insert column to same position in boardData
            newBoardData.columns = newBoardData.columns.map(col => {
                if(col.columnID === sourceColumn){
                    return newBoardDataColumn
                } else {
                    return col
                }})

            // update boardData
            setBoardData(newBoardData)
            updateDocument(boardData.boardID, {columns: newBoardData.columns})

            setCardName("")
            setCardWorker("")
            setDeadline("")
            setCardDescription("")
            setCardLabels([])
            setIsTaskEditModalOpen(false)
        }
    }
    function handleAdd(e){
        e.preventDefault()
        const labelName = newCardLabelName.trim()
        const labelColor = newCardLabelColor.trim()
        const labelTextColor = newCardLabelNameColor.trim()

        if(labelName && !cardLabels.filter((label) => label.labelName === labelName).length > 0){
            setCardLabels(prevLabels => [...prevLabels, {labelID: uuidv4(), labelName, labelColor, labelTextColor}])
        }
        setNewCardLabelName("")
        setNewCardLabelColor("#b80000")
        setNewCardLabelNameColor("#fff")
        setShowLabelCreator(false)
    }
    function handleDeleteLabel(labelID){
        setCardLabels(cardLabels => cardLabels.filter((label) => label.labelID !== labelID))
    }
    function handleCloseModal(){
        if(!isEdit.state){
            setShowConfirmModal(true)
        } else {
            setIsTaskEditModalOpen(false)
        }
    }
  return (
    <>
        {showConfirmModal && 
            <ConfirmModal handleYesAction={() => {
                setShowConfirmModal(false)
                setIsTaskEditModalOpen(false)
            }} handleNoAction={() => setShowConfirmModal(false)} title="Close without saving?" message="Do you really want to close without saving?"/>}
        <Dialog
            open={isTaskEditModalOpen}
            onClose={() => handleCloseModal()}
            maxWidth="lg"
            fullWidth={true}
        >
            <DialogTitle>{cardName}</DialogTitle>
            <DialogContent style={{paddingTop: "10px"}}>
                <form >
                    <Stack spacing={1.5}>
                    <label>
                        <TextField
                            className="formInput"
                            required
                            label="Taskname"
                            onChange={(e) => setCardName(e.target.value)}
                            value={cardName}
                            size="small"
                            InputProps={{
                                readOnly: isEdit.state
                            }}
                        />
                    </label>
                    
                    <label>
                        <TextField
                            className="formInput"
                            label="Worker"
                            onChange={(e) => setCardWorker(e.target.value)}
                            value={cardWorker}
                            size="small"
                            InputProps={{
                                readOnly: isEdit.state
                            }}
                        />
                    </label>
                    
                    <label>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker 
                                label="Deadline"
                                onChange={(date) => setDeadline(date)}
                                value={deadline}
                                size="small"
                                inputFormat="dd.MM.yyyy"
                                mask="__.__.____"
                                renderInput={(params) => <TextField {...params} />}
                                readOnly={isEdit.state}
                                
                            />
                        </LocalizationProvider>
                    </label>
                    <label>
                        <TextField
                            className="formInput"
                            label="Description"
                            multiline
                            rows={4}
                            onChange={(e) => setCardDescription(e.target.value)}
                            value={cardDescription}
                            size="small"
                            InputProps={{
                                readOnly: isEdit.state
                            }}
                        />
                    </label>
                    
                    <label>
                        <span>Labels:</span>
                        {showLabelCreator &&
                            <Dialog
                            open={showLabelCreator}
                            onClose={() => setShowLabelCreator(false)}
                            >
                                <DialogTitle>Add Label</DialogTitle>
                                <DialogContent style={{paddingTop: "10px"}}>
                                    <div>
                                        <TextField
                                            className="formInput"
                                            required
                                            label="Label Name"
                                            onChange={(e) => setNewCardLabelName(e.target.value)}
                                            value={newCardLabelName}
                                            sx={{ color: newCardLabelColor}}
                                            size="small"
                                        />
                                        <p className="label" style={{backgroundColor: newCardLabelColor, color: newCardLabelNameColor }}>{newCardLabelName==="" ? "Label Name" : newCardLabelName}</p>
                                        <GithubPicker
                                            className="colorPicker"
                                            color={newCardLabelColor}
                                            // triangle="top-left"
                                            onChangeComplete={(color) => {
                                                setNewCardLabelColor(color.hex)
                                                color.hsl.l >= 0.5 ?  setNewCardLabelNameColor("#000") : setNewCardLabelNameColor("#fff") 
                                            }} />
                                        
                                    </div>
                                </DialogContent>
                            <DialogActions>
                                <Button onClick={handleAdd}>Add label</Button>
                                <Button onClick={() => setShowLabelCreator(false)}>
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>}
                    </label>
                    <p className="labelWrapper">{cardLabels.map((label) => (
                        <span className="label" key={label.labelID} style={{backgroundColor: label.labelColor, color: label.labelTextColor}}>
                            {label.labelName}
                            {!isEdit.state && <span className="deleteButton" onClick={() => {
                                handleDeleteLabel(label.labelID)
                                }}>
                                    <DeleteOutlineIcon sx={{fontSize: "1.7em"}} />
                            </span>
                            }
                        </span>
                    ))}
                        <button className="addLabel" onClick={(e) => {
                            e.preventDefault()
                            setShowLabelCreator(true)}}>+</button>
                    </p>
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleCloseModal()}>Cancel</Button>
                <Button variant="contained" onClick={handleEditButton}>{isEdit.text}</Button>
            </DialogActions>
        </Dialog>
    </>
  )
}
