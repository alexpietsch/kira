// styles
import { useAuthContext } from "../hooks/useAuthContext"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useCollection } from "../hooks/useCollection"
import { useFirestore } from "../hooks/useFirestore"
import TaskAdd from "./TaskAdd";
import "./ListBoard.css"
import { v4 as uuidv4 } from "uuid"
    
    // START-OF handle task movment helper functions

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    //Due to update of functionality and structure of data this function is not used anymore

    /* const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
        
        destClone.splice(droppableDestination.index, 0, removed);
        
        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;
        
        return result;
    }; */

    // END-OF handle task movment helper functions






export default function ListBoard() {

    const { user } = useAuthContext()
    const { id } = useParams()
    const { documents, error } = useCollection(
        "tasks_new_structure", 
        ["boardID", "==", id]
    )
    const { updateDocument } = useFirestore("tasks")

    let data = null
    let columnWidth = null
    let columnWidthDiff = null
    if(documents){
        data = documents[0]
        console.log(documents)
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
        if(!destination){
            return
        }

        const sInd = source.droppableId;
        const dInd = destination.droppableId;
        let newState = boardData

        if (sInd === dInd) {
            const items = reorder(boardData.cards, source.index, destination.index);
            newState.cards = items
        } else {
            const movedCardIndex = newState.cards.findIndex(card => card.id === result.draggableId)
            newState.cards[movedCardIndex].belongsTo = destination.droppableId

        }
        setBoardData(newState)
        updateDocument(boardData.boardId, {cards: newState.cards})
    }
    function handleDeleteCard(card){
        let newState = boardData
        newState.cards = newState.cards.filter(c => c.id !== card.id)
        setBoardData(newState)
        updateDocument(boardData.boardId, {cards: newState.cards})
    }
  return (
    <>
    {boardData && <p>Projektname: {boardData.boardName}</p>}
    <div className="list-container" style={columnWidthDiff}>
        {!error && <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                {boardData && boardData.columns.map((column, index) => (
                    <div key={column.id} className="taskColumn" style={columnWidth}>
                        <h2>{column.title}</h2>
                        {/* <h5>{column.id}</h5> */}
                        <TaskAdd boardData={boardData} columnId={column.id} setBoardData={setBoardData} />
                    
                        <Droppable droppableId={column.id}>
                        {(provided) => (
                        <ul className="con" {...provided.droppableProps} ref={provided.innerRef}>
                            {boardData && boardData.cards.map((card, index) => {
                                if (column.id === card.belongsTo){
                                    return (
                                        <Draggable key={card.id} draggableId={card.id} index={index}>
                                            {(provided) => (
                                                <li className="taskCard" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <p>{card.title}</p>
                                                    <button onClick={() => handleDeleteCard(card)}>X</button>
                                                    {/* <p>Worked on by: {card.worker}</p> */}
                                                </li>
                                            )}
                                        </Draggable>
                                );} 
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