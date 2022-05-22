import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useFirestore } from "../hooks/useFirestore"
import { timestamp } from "../firebase/config"
import { GithubPicker } from 'react-color'

import "./TaskAdd.css"
import Modal from "./Modal"

// MUI components
    //Dialog
    import Dialog from '@mui/material/Dialog';
    import DialogActions from '@mui/material/DialogActions';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";

export default function TaskAdd({ boardData, setBoardData, isTaskAddModalOpen, setIsTaskAddModalOpen, sourceColumnID }) {

    const [showLabelCreator, setShowLabelCreator] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)


    const [isTasknameNameError, setIsTasknameNameError] = useState(false)
    const [tasknameHelperText, setTasknameHelperText] = useState("")
    const [isLabelNameError, setIsLabelNameError] = useState(false)
    const [labelHelperText, setLabelHelperText] = useState("")

    const [cardName, setCardName] = useState("")
    const [cardWorker, setCardWorker] = useState("")
    const [deadline, setDeadline] = useState("")
    const [cardDescription, setCardDescription] = useState("")
    const [cardLabels, setCardLabels] = useState([])

    const [newCardLabelName, setNewCardLabelName] = useState("")
    const [newCardLabelNameColor, setNewCardLabelNameColor] = useState("#fff")
    const [newCardLabelColor, setNewCardLabelColor] = useState("#b80000")
    const { updateDocument } = useFirestore("tasks_new_structure")

    function handleSubmit(e){
        e.preventDefault()

        if(cardName.length === 0){
            setTasknameHelperText("Taskname is required")
            setIsTasknameNameError(true)
            return
        } else {
            setTasknameHelperText("")
            setIsTasknameNameError(false)
        }

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
        const column = newBoardData.columns.find(column => column.columnID === sourceColumnID)
        // add new task to column
        column.cards.push(card)
        const isTargetColumn = (column) => column.columnID === sourceColumnID
        const indexOfColumn = newBoardData.columns.findIndex(isTargetColumn)
        newBoardData.columns[indexOfColumn] = column
        setBoardData(newBoardData)
        updateDocument(boardData.boardID, {columns: newBoardData.columns})
        setCardName("")
        setCardWorker("")
        setDeadline("")
        setCardDescription("")
        setCardLabels([])
        setIsTaskAddModalOpen(false)
    }
    function handleAdd(e){
        e.preventDefault()
        const labelName = newCardLabelName.trim()
        const labelColor = newCardLabelColor.trim()
        const labelTextColor = newCardLabelNameColor.trim()

        if(labelName === ""){
            setLabelHelperText("Label Name is required")
            setIsLabelNameError(true)
            return
        } else {
            setLabelHelperText("")
            setIsLabelNameError(false)
        }

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
            setIsTaskAddModalOpen(false)
        }
    }
  return (
    <>
        {showConfirmModal && 
            <Modal customWidth={"30%"}>
                <h1>Close Window?</h1>
                <button className="button-dark" onClick={() => setIsTaskAddModalOpen(false)}>Yes</button>
                <button className="button-dark" onClick={() => setShowConfirmModal(false)}>No</button>
            </Modal>}
        
            <Dialog
                open={isTaskAddModalOpen}
                onClose={() => setIsTaskAddModalOpen(false)}
            >
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent style={{paddingTop: "10px"}}>
                    <form className="addTaskForm">
                        <Stack spacing={1.5}>
                        <label className="inputWrapper">
                            {/* <span>Taskname:</span> */}
                            <TextField
                                required
                                label="Taskname"
                                onChange={(e) => setCardName(e.target.value)}
                                value={cardName}
                                size="small"
                                error={isTasknameNameError}
                                helperText={tasknameHelperText}
                            />
                            {/* <input 
                                type="text"
                                required
                                onChange={(e) => setCardName(e.target.value)}
                                value={cardName}
                            /> */}
                        </label>
                        <br/>
                        <label>
                            {/* <span>Bearbeiter:</span> */}
                            <TextField
                                label="Worker"
                                onChange={(e) => setCardWorker(e.target.value)}
                                value={cardWorker}
                                size="small"
                            />
                            {/* <input 
                                type="text"
                                onChange={(e) => setCardWorker(e.target.value)}
                                value={cardWorker}
                            /> */}
                        </label>
                        <br/>
                        <label>
                            {/* <span>Deadline:</span> */}
                            <TextField
                                style={{width: "100%"}}
                                type="date"
                                label="Deadline"
                                onChange={(e) => setDeadline(e.target.value)}
                                value={deadline}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                            {/* <input 
                                type="date"
                                onChange={(e) => setDeadline(e.target.value)}
                                value={deadline}
                            /> */}
                        </label>
                        <label>
                            <TextField
                                label="Description"
                                multiline
                                rows={4}
                                onChange={(e) => setCardDescription(e.target.value)}
                                value={cardDescription}
                                size="small"
                            />
                            {/* <span>Description</span>
                            <textarea
                                onChange={(e) => setCardDescription(e.target.value)}
                                value={cardDescription}
                                rows="5"
                                cols="50"
                                style={{resize: "none"}}
                            /> */}
                        </label>
                        <br/>
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
                                                    required
                                                    label="Label Name"
                                                    onChange={(e) => setNewCardLabelName(e.target.value)}
                                                    value={newCardLabelName}
                                                    // style={{backgroundColor: newCardLabelColor}}
                                                    sx={{ color: newCardLabelColor}}
                                                    size="small"
                                                    error={isLabelNameError}
                                                    helperText={labelHelperText}
                                                />
                                                {/* <input
                                                    // className="labelNameInput"
                                                    type="text"
                                                    onChange={(e) => {
                                                        setNewCardLabelName(e.target.value)
                                                    }}
                                                    value={newCardLabelName}
                                                    style={{backgroundColor: newCardLabelColor, color: newCardLabelNameColor}}
                                                    />
                                             */}
                                            <p className="label" style={{backgroundColor: newCardLabelColor, color: newCardLabelNameColor }}>{newCardLabelName=="" ? "Label Name" : newCardLabelName}</p>
                                            <GithubPicker
                                                className="colorPicker"
                                                color={newCardLabelColor}
                                                // triangle="top-left"
                                                onChangeComplete={(color) => {
                                                    setNewCardLabelColor(color.hex)
                                                    color.hsl.l >= 0.5 ?  setNewCardLabelNameColor("#000") : setNewCardLabelNameColor("#fff") 
                                                }} />
                                            <br/>
                                        </div>
                                    </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleAdd}>Add label</Button>
                                    {/* <button className="button-dark">Save Task</button>  */}
                                    <Button onClick={() => setShowLabelCreator(false)} color="primary">
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>}

                                {/* <Modal customWidth={"20%"}> 
                                    <div>
                                        <span>Label:</span>
                                            <input
                                                className="labelNameInput"
                                                type="text"
                                                onChange={(e) => {
                                                    setNewCardLabelName(e.target.value)
                                                }}
                                                value={newCardLabelName}
                                                style={{backgroundColor: newCardLabelColor, color: newCardLabelNameColor}}
                                                />
                                        
                                        <GithubPicker
                                            className="colorPicker"
                                            color={newCardLabelColor}
                                            triangle="top-right"
                                            onChangeComplete={(color) => {
                                                setNewCardLabelColor(color.hex)
                                                console.log(color.hex);
                                                color.hsl.l >= 0.5 ?  setNewCardLabelNameColor("#000") : setNewCardLabelNameColor("#fff") 
                                            }} />
                                        <br/>
                                        <button onClick={handleAdd} className="button-dark labelAdd">add</button>
                                    </div>
                                    <button onClick={() => setShowLabelCreator(false)} className="button-dark">Close</button>
                                </Modal> */}
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
                    <Button onClick={handleSubmit}>Save Task</Button>
                    {/* <button className="button-dark">Save Task</button>  */}
                    <Button onClick={() => setIsTaskAddModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        
        {/* <button className="button-dark" onClick={() => handleCloseModal()}>Close</button> */}
    </>
  )
}