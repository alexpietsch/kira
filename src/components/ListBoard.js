// styles
import { useAuthContext } from "../hooks/useAuthContext"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import "./ListBoard.css"

export default function ListBoard({ tasks, setTasks }) {

    const { user } = useAuthContext()

    const handleOnDragEnd = (result) => {
        if(!result.destination){
            return
        }
        const items = Array.from(tasks);
        const [newSortItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, newSortItem);

        setTasks(items)
    }
    

  return (
    <div className="list-container">
        {/* <button onClick={addGroup}>Add Group</button> */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="tasks">
                {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks.map(({id, taskName, worker}, index) => {
                        return (
                            <Draggable key={id} draggableId={id} index={index}>
                                {(provided) => (
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
        </DragDropContext>
    </div>
  )
}