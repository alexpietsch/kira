import { useAuthContext } from "../../hooks/useAuthContext"

export default function NewBoard() {
    const { user } = useAuthContext()

  return (
    <div>Create a New Board {user.uid}</div>
  )
}