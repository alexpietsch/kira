// styles
import { useAuthContext } from "../hooks/useAuthContext"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useCollection } from "../hooks/useCollection"
import { useFirestore } from "../hooks/useFirestore"
import { timestamp } from "../firebase/config"
import TaskAdd from "./TaskAdd";
import "./ListBoard.css"
import { v4 as uuidv4 } from "uuid"
import Modal from "./Modal"
    
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
    const { documents, error } = useCollection(
        "tasks_new_structure", 
        ["boardID", "==", id]
    )
    const { updateDocument } = useFirestore("tasks_new_structure")

    let data = null
    let columnWidth = null
    let columnWidthDiff = null
    if(documents){
        data = documents[0]
    //     let colwidth = Math.floor(100/data.columns.length)
    //     let diff = 100 - colwidth*data.columns.length
    //     columnWidth = {
    //         width: colwidth + "%"
    //     }
    //     columnWidthDiff = {
    //         paddingLeft: diff/2 + "%",
    //         paddingRight: diff/2 + "%"
    //     }
    }

    
    const [boardData, setBoardData] = useState(null)
    const fetch = useEffect(() => {
        setBoardData(data)
        console.log(data)
    }, [data])

    function handleOnDragEnd(result) {

        const { source, destination } = result;
        console.log(source,destination)
        if(!destination){
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
    function handleDeleteCard(card){
        // let newState = boardData
        // newState.cards = newState.cards.filter(c => c.id !== card.id)
        // setBoardData(newState)
        // updateDocument(boardData.boardId, {cards: newState.cards})
    }
  return (
    <>
    {boardData && <p>Projektname: {boardData.boardName}</p>}
    <div className="list-container" style={columnWidthDiff}>
        {!error && <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                {boardData && boardData.columns.map((column, index) => (
                    <div key={column.columnID} className="taskColumn" style={columnWidth}>
                        <h2>{column.columnName}</h2>

                        <TaskAdd boardData={boardData} columnId={column.columnID} setBoardData={setBoardData} />
                    
                        <Droppable droppableId={column.columnID}>
                        {(provided) => (
                        <ul className="con" {...provided.droppableProps} ref={provided.innerRef}>
                            {boardData && column.cards.map((card, index) => {
                                    return (
                                        <Draggable key={card.cardID} draggableId={card.cardID} index={index}>
                                            {(provided) => (
                                                <li className="taskCard" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <p>{card.cardName}</p>
                                                    {/* <p>{card.cardDeadline ? console.log(card.cardDeadline.toDate().toString().toLocaleString('en-US')) : null}</p> */}
                                                    <span className="deleteButton" onClick={() => console.log("del")}>✕</span>
                                                </li>
                                            )}
                                        </Draggable>
                                    ); 
                            })}
                            {provided.placeholder}
                        </ul>
                        )}
                    </Droppable>
                </div>
                ))}
            </DragDropContext>
            </>
        }
    </div>
    </>
    
  )
}