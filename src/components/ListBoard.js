// styles
import { useAuthContext } from "../hooks/useAuthContext"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useCollection } from "../hooks/useCollection"
import { useFirestore } from "../hooks/useFirestore"
import TaskAdd from "./TaskAdd";
import "./ListBoard.css"
    
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
        "tasks", 
        ["boardId", "==", id]
    )
    const { updateDocument } = useFirestore("tasks")

    let data = null
    if(documents){
        data = documents[0]
    }

    
    const [boardData, setBoardData] = useState(null)
    const fetch = useEffect(() => {
        setBoardData(data)
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
            console.log(source, destination)
            const movedCardIndex = newState.cards.findIndex(card => card.id === result.draggableId)
            newState.cards[movedCardIndex].belongsTo = destination.droppableId
            console.log(result)
        }
        setBoardData(newState)
        updateDocument(boardData.boardId, {cards: newState.cards})
    }
  return (
    <div className="list-container">
        {!error && <>
            {boardData && <p>Projektname: {boardData.boardName}</p>}
            <DragDropContext onDragEnd={handleOnDragEnd}>
                {boardData && boardData.columns.map((column, index) => (
                    <Droppable droppableId={column.id} key={column.id}>
                    {(provided, snapshot) => (
                    <ul className="con" {...provided.droppableProps} ref={provided.innerRef}>
                        <h2>{column.title}</h2>
                        {boardData && boardData.cards.map((card, index) => {
                            if (column.id === card.belongsTo){
                                return (
                                    <Draggable key={card.id} draggableId={card.id} index={index}>
                                        {(provided, snapshot) => (
                                            <li className="taskCard" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                            {card.title}
                                            </li>
                                        )}
                                    </Draggable>
                            );}     
                        })}
                        {provided.placeholder}
                    </ul>
                    )}
                </Droppable>
                ))}
            </DragDropContext>
            <TaskAdd boardId={id}/>
            </>
        }
        
    </div>
  )
}