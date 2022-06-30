import BoardSelection from "../../components/BoardSelection";
import { useAuthContext } from "../../hooks/useAuthContext"
import { useCollection } from "../../hooks/useCollection"
import React from "react"

export default function Home() {

  const { user } = useAuthContext()
  const { documents, error } = useCollection(
    "tasks", 
    ["user", "==", user.uid])
  
  return (
    <div>
      <br />
      {documents && <BoardSelection data={documents} />}
      {!documents && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}