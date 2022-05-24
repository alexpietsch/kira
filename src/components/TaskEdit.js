import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useFirestore } from "../hooks/useFirestore"
import { timestamp } from "../firebase/config"
import { GithubPicker } from 'react-color'

// icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// MUI components
    //Dialog
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from "@mui/material/Stack";

import "./TaskEdit.css"
import Modal from "./Modal"

export default function TaskEdit({ sourceCard: card , sourceColumn: column , boardData, setBoardData, isTaskEditModalOpen, setIsTaskEditModalOpen}) {
    const [showLabelCreator, setShowLabelCreator] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [isEdit, setIsEdit] = useState({state: true, buttonText: "Edit"})

    const [cardName, setCardName] = useState(card.cardName)
    const [cardWorker, setCardWorker] = useState(card.cardWorker)
    const [deadline, setDeadline] = useState(card.cardDeadline ? card.cardDeadline.toDate().toString().toLocaleString('en-US') : null)
    const [cardDescription, setCardDescription] = useState(card.cardDescription)
    const [cardLabels, setCardLabels] = useState(card.cardLabels)

    const [newCardLabelName, setNewCardLabelName] = useState("")
    const [newCardLabelNameColor, setNewCardLabelNameColor] = useState("#fff")
    const [newCardLabelColor, setNewCardLabelColor] = useState("#b80000")
    const { updateDocument } = useFirestore("tasks_new_structure")


    function handleEditButton(e){
        e.preventDefault()

        if(isEdit.state){
            setIsEdit({state: false, buttonText: "Save Changes"})
        } else {

            const card = {
                cardID: uuidv4(),
                cardName,
                cardWorker,
                cardDeadline: deadline ? timestamp.fromDate(new Date(deadline)) : null,
                cardCreated: timestamp.fromDate(new Date()),
                cardDescription,
                cardLabels
            }
            let newBoardData = boardData
            // get column from boardData.columns 
            const column = newBoardData.columns.find(column => column.columnID === column)
            // add new task to column
            column.cards.push(card)
            const isTargetColumn = (column) => column.columnID === column
            const indexOfColumn = newBoardData.columns.findIndex(isTargetColumn)
            newBoardData.columns[indexOfColumn] = column
            setBoardData(newBoardData)
            // updateDocument(boardData.boardID, {columns: newBoardData.columns})
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
    function handleCloseModal(){
        if(cardName || cardWorker || deadline || cardLabels.length > 0){
            setShowConfirmModal(true)
        } else {
            setIsTaskEditModalOpen(false)
        }
    }
  return (
    <>
        <Dialog
                open={isTaskEditModalOpen}
                onClose={() => setIsTaskEditModalOpen(false)}
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
                                            <p className="label" style={{backgroundColor: newCardLabelColor, color: newCardLabelNameColor }}>{newCardLabelName=="" ? "Label Name" : newCardLabelName}</p>
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
                            <span className="label" key={label.labelID} style={{backgroundColor: label.labelColor, color: label.labelTextColor}}>{label.labelName}</span>
                        ))}
                            <button className="addLabel" onClick={(e) => {
                                e.preventDefault()
                                setShowLabelCreator(true)}}>+</button>
                        </p>
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsTaskEditModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditButton}>{isEdit.buttonText}</Button>
                </DialogActions>
            </Dialog>
    </>
  )
}
