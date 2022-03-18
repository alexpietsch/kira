import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

export default function TaskAdd({ tasks, setTasks }) {

    const [taskName, setTaskName] = useState("")
    const [worker, setWorker] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        setTasks([...tasks, {id: uuidv4(), taskName, worker}])
        console.log(tasks)
    }

  return (
    <div>
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
    </div>
  )
}