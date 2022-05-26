// hooks
import { useAuthContext } from "../hooks/useAuthContext"
import { useCollection } from "../hooks/useCollection"
import { useFirestore } from "../hooks/useFirestore"

// packages
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useHistory } from "react-router-dom";

// components
import Modal from "./Modal"
import TaskAdd from "./TaskAdd";
import TaskEdit from "./TaskEdit"

// icons
import EditIcon from '@mui/icons-material/Edit';

// mui components
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// styles
import "./ListBoard.css"




    
    // START-OF handle task movment helper functions

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
        
        destClone.splice(droppableDestination.index, 0, removed);
        
        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;
        
        return result;
    };

    // END-OF handle task movment helper functions






export default function ListBoard() {

    const { user } = useAuthContext()
    const { id } = useParams()
    const history = useHistory();
    const { documents, error } = useCollection(
        "tasks_new_structure", 
        ["boardID", "==", id],
        user
    )
    const { updateDocument } = useFirestore("tasks_new_structure")

    let data = null
    let columnWidth = null
    let columnWidthDiff = null
    if(documents){
        data = documents[0]
    }

    
    const [boardData, setBoardData] = useState(null)

    const [isEditColumnOpen, setIsEditColumnOpen] = useState(false)
    const [isTaskAddModalOpen, setIsTaskAddModalOpen] = useState(false)
    const [isColumnAddOpen, setIsColumnAddOpen] = useState(false)
    const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [modalActiveColumn, setModalActiveColumn] = useState(null)
    const [modalActiveCard, setModalActiveCard] = useState(null)
    const [showError, setShowError] = useState(false)

    const [newColumnName, setNewColumnName] = useState("")

    const fetch = useEffect(() => {
        setBoardData(data)
    }, [data])

    function handleOnDragEnd(result) {

        const { source, destination } = result;
        // check if the card is dropped outside of the column area
        if(!destination){
            return
        } 
        // check if the card is dropped in the same column and the index
        // does not change (case if card is dragged and then dropped at the same position)
        else if(source.droppableId === destination.droppableId && source.index === destination.index){
            return
        }

        const sInd = source.droppableId;
        const dInd = destination.droppableId;
        let newState = boardData

        if (sInd === dInd) {
            const column = newState.columns.find(column => column.columnID === sInd)
            const items = reorder(column.cards, source.index, destination.index);
            const isTargetColumn = (column) => column.columnID === sInd
            const indexOfColumn = newState.columns.findIndex(isTargetColumn)
            newState.columns[indexOfColumn].cards = items
        } else {
            // find the source and destination columns for the move function
            const sourceColumn = newState.columns.find(column => column.columnID === sInd)
            const destColumn = newState.columns.find(column => column.columnID === dInd)
            // call move function with the source and destination columns as arrays
            // and the source and destination which are the two droppables
            //
            // the move function returns an object with the source and destination as attibutes
            // and each of them has an array of cards for their column
            const items = move(sourceColumn.cards, destColumn.cards, source, destination);
            // find the index of the source and destination columns in the columns array
            const indexOfSourceColumn = newState.columns.findIndex((column) => column.columnID === sInd)
            const indexOfDestColumn = newState.columns.findIndex((column) => column.columnID === dInd)
            // set the cards arrays in both columns in the new state to befor calculated arrays from the move function
            newState.columns[indexOfSourceColumn].cards = items[ sInd ]
            newState.columns[indexOfDestColumn].cards = items[ dInd ]
        }
        setBoardData(newState)
        updateDocument(boardData.boardID, {columns: newState.columns})
    }

    function handleDeleteCard(sourceColumn, sourceCard){
        let newState = boardData
        const isTargetColumn = (column) => column.columnID === sourceColumn.columnID
        const indexOfColumn = newState.columns.findIndex(isTargetColumn)
        newState.columns[indexOfColumn].cards = newState.columns[indexOfColumn].cards.filter(c => c.cardID !== sourceCard.cardID)
        setBoardData(newState)
        updateDocument(boardData.boardID, {columns: newState.columns})
    }
    function handleDeleteColumn(){
        let newState = boardData
        const isTargetColumn = (column) => column.columnID === modalActiveColumn
        const indexOfColumn = newState.columns.findIndex(isTargetColumn)
        // remove the column from the columns array
        newState.columns.splice(indexOfColumn, 1)
        setBoardData(newState)
        setShowConfirmModal(false)
        setIsEditColumnOpen(false)
        updateDocument(boardData.boardID, {columns: newState.columns})
    }
    function handleAddColumn(e){
        e.preventDefault()
        if (!newColumnName) {
            setShowError(true)
            return
        }
        const column = { 
            columnID: uuidv4(),
            columnName: newColumnName,
            cards: []
        }
        let columns = boardData.columns
        columns.push(column)
        setShowError(false)
        updateDocument(boardData.boardID, {columns: columns})
        setIsColumnAddOpen(false)
        setNewColumnName("")
    }
  return (
    <>

    {/* Modals */}

    {isTaskAddModalOpen && <TaskAdd boardData={boardData} sourceColumnID={modalActiveColumn} setBoardData={setBoardData} isTaskAddModalOpen={isTaskAddModalOpen} setIsTaskAddModalOpen={setIsTaskAddModalOpen} />}
    {isTaskEditModalOpen && <TaskEdit sourceCard={modalActiveCard} sourceColumn={modalActiveColumn} boardData={boardData} setBoardData={setBoardData} isTaskEditModalOpen={isTaskEditModalOpen} setIsTaskEditModalOpen={setIsTaskEditModalOpen}/>}
    {isEditColumnOpen &&
        <Modal customWidth={"80%"} isCenter={true}>
            <h1>Edit and view column here</h1>
            <ul style={{listStyle: "none"}}>
                <li>
                <button className="button-danger" onClick={() => {
                        setShowConfirmModal(true)
                }}>Delete Column</button>
                </li>
            </ul>
            <button onClick={() => setIsEditColumnOpen(false)} className="button-dark">Close</button>
        </Modal>}

    {showConfirmModal && 
        <Modal customWidth={"30%"}>
            <h1>Delete Column?</h1>
            <button className="button-danger" onClick={() => handleDeleteColumn()}>Yes</button>
            <button className="button-dark" onClick={() => {
                setShowConfirmModal(false)
                setModalActiveColumn(null)
            }}>No</button>
        </Modal>}
    {/* End Modals */}


    <span style={{
        position: "absolute",
        top: "70px",
        left: "5px",
        fontSize: "3em",
        cursor: "pointer"
    }}
    onClick={() => {
        history.push("/")
    }}>&#8592;</span>

    {boardData && <p>Projektname: {boardData.boardName}</p>}
    <Box style={{ width: "100%", overflowX: "auto"}}>
    <div className="list-container">
        {!error && <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                {boardData && boardData.columns.map((column, index) => (
                    <div key={column.columnID} className="taskColumn">
                        <h2>
                            {column.columnName}
                            <button onClick={() => {
                                    setIsEditColumnOpen(true)
                                    setModalActiveColumn(column.columnID)
                                    }} 
                                    className="button-dark">
                                <EditIcon sx={{ fontSize: 15 }} />
                            </button>
                        </h2>
                        <Droppable droppableId={column.columnID}>
                        {(provided) => (
                        <>
                            <button className="button-dark" onClick={() => {
                                setIsTaskAddModalOpen(true)
                                setModalActiveColumn(column.columnID)
                            }}>Add Task</button>
                            <Paper elevation={1}>
                            <ul className="column" {...provided.droppableProps} ref={provided.innerRef}>
                                {boardData && column.cards.map((card, index) => {
                                        return (
                                            <Draggable key={card.cardID} draggableId={card.cardID} index={index}>
                                                {(provided) => (
                                                    <li className="taskCard" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} onDoubleClick={() => {
                                                        setIsTaskEditModalOpen(true)
                                                        setModalActiveCard(card)
                                                        setModalActiveColumn(column.columnID)
                                                        }}>
                                                        <p>{card.cardName}</p>
                                                        {/* <p>{card.cardDeadline ? console.log(card.cardDeadline.toDate().toString().toLocaleString('en-US')) : null}</p> */}
                                                        <span className="deleteButton" onClick={() => handleDeleteCard(column, card)}>✕</span>
                                                        <div className="labelWrapper">
                                                            {card.cardLabels.map((label) => {
                                                                return (
                                                                    <span key={label.labelID} className="label" style={{backgroundColor: label.labelColor, color: label.labelTextColor}}>{label.labelName}</span>
                                                                )})}
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ); 
                                })}
                                {provided.placeholder}
                            </ul>
                            </Paper>
                        </>
                        )}
                    </Droppable>
                </div>
                ))}
            </DragDropContext>
            <div className="taskColumn" style={{paddingTop: "4.5em"}}>
                {!isColumnAddOpen && <button style={{marginBottom: "1.4em"}} onClick={() => setIsColumnAddOpen(true)} className="button-dark">+ New Column</button>}
                {isColumnAddOpen && <button style={{marginBottom: "1.4em"}} onClick={() => {
                    setIsColumnAddOpen(false)
                    setNewColumnName("")
                }} className="button-dark">Cancel</button>}
                {isColumnAddOpen &&
                    <div className="column">
                        <form onSubmit={handleAddColumn}>
                            <label>
                                <span>Column Name:</span>
                                {showError && <><br/><span style={{color: "red"}}>Column Name can't be empty</span></>}
                                <input type="text" placeholder="Column Name" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} />
                            </label>
                            <button type="submit" className="button-dark">add Column</button>
                        </form>
                    </div>}
            </div>
            </>
        }
    </div>
    </Box>
    </>
  )
}