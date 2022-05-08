import { Link } from "react-router-dom"

export default function BoardSelection({data}) {
  return (
    <div>
        {data.map((board) => (
            <div key={board.boardID}>
                <p>{board.boardName}</p>
                <p>{board.boardID}</p>
                <Link to={`/board/${board.boardID}`}>Open this board</Link>
            </div>
        ))}
        <div>
            <Link to="/new">Create a new board</Link>
        </div>
    </div>
  )
}
