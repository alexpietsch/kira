import BoardSelection from "../../components/BoardSelection";
import { useAuthContext } from "../../hooks/useAuthContext"
import { useCollection } from "../../hooks/useCollection"

export default function Home() {

  const { user } = useAuthContext()
  const { documents, error } = useCollection(
    "tasks_new_structure", 
    ["user", "==", user.uid])
  
  return (
    <div>
      <br />
      {documents && <BoardSelection data={documents} />}
      {!documents && <p>Loading...</p>}
    </div>
  )
}