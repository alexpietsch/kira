// styles
import { useAuthContext } from "../hooks/useAuthContext"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
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






export default function ListBoard({ tasks, setTasks }) {

    const { user } = useAuthContext()

    function handleOnDragEnd(result) {

        const { source, destination } = result;
        console.log(result)
        if(!destination){
            return
        }

        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(tasks[sInd], source.index, destination.index);
            const newState = [...tasks];
            newState[sInd] = items;
            setTasks(newState);
        } else {
            const result = move(tasks[sInd], tasks[dInd], source, destination);
            const newState = [...tasks];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setTasks(newState.filter((group) => group.length));
        }
    }
  return (
    <div className="list-container">
        {/* <button onClick={addGroup}>Add Group</button> */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
            {tasks.map((task, index) => (
            <Droppable droppableId={`${index}`} key={`${index}`}>
                {(provided, snapshot) => (
                <ul className="con" {...provided.droppableProps} ref={provided.innerRef}>
                    <TaskAdd id={`${index}`} tasks={tasks} setTasks={setTasks} />
                    {task.map(({id, taskName, worker}, index) => {
                        return (
                            <Draggable key={id} draggableId={id} index={index}>
                                {(provided, snapshot) => (
                                    <li className="taskCard" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                        <p>{taskName}</p>
                                        <p className="taskCard-worker">Wird bearbeitet von: {worker}</p>
                                    </li>
                                )}
                                
                            </Draggable>
                        );
                    })}
                    {provided.placeholder}
                </ul>
                )}
            </Droppable>
            ))}
        </DragDropContext>
        
    </div>
  )
}