import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

export default function TaskAdd({ tasks, setTasks, id }) {

    const [taskName, setTaskName] = useState("")
    const [worker, setWorker] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!id) {
            return
        }

        let newTasksArr = [...tasks]
        newTasksArr[id].push({id: uuidv4(), taskName, worker})
        
        setTasks([...newTasksArr])
        
    }

  return (
    <>
        <form onSubmit={handleSubmit}>
            <label>
                <span>Taskname:</span>
                <input 
                    type="text"
                    required
                    onChange={(e) => setTaskName(e.target.value)}
                    value={taskName}
                />
            </label>
            <label>
                <span>Bearbeiter:</span>
                <input 
                    type="text"
                    required
                    onChange={(e) => setWorker(e.target.value)}
                    value={worker}
                />
            </label>
            <button>Task speichern</button>    
        </form>
    </>
  )
}