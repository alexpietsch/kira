import { useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { useFirestore } from "../hooks/useFirestore"
import { timestamp } from "../firebase/config"
import { GithubPicker } from 'react-color'

import "./TaskAdd.css"
import Modal from "./Modal"

export default function TaskAdd({ boardData, setBoardData, setIsTaskAddModalOpen, sourceColumnID }) {

    const [showLabelCreator, setShowLabelCreator] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

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
        
        <form onSubmit={handleSubmit} className="addTaskForm">
            <label>
                <span>Taskname:</span>
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
            <label>
                <span>Description</span>
                <textarea
                    onChange={(e) => setCardDescription(e.target.value)}
                    value={cardDescription}
                    rows="5"
                    cols="50"
                    style={{resize: "none"}}
                />
            </label>
            <br/>
            <label>
                <span>Labels:</span>
                {showLabelCreator &&
                    <Modal customWidth={"40%"}> 
                        <div className="">
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
                        <button onClick={() => setShowLabelCreator(false)} className="button-dark">close</button>
                    </Modal>}
            </label>
            <p className="labelWrapper">{cardLabels.map((label) => (
                <span className="label" key={label.labelID} style={{backgroundColor: label.labelColor, color: label.labelTextColor}}>{label.labelName}</span>
            ))}
                <button className="addLabel" onClick={(e) => {
                    e.preventDefault()
                    setShowLabelCreator(true)}}>+</button>
            </p>
            <br/>
            <button className="button-dark">Save Task</button>    
        </form>
        <button className="button-dark" onClick={() => handleCloseModal()}>Close</button>
    </>
  )
}