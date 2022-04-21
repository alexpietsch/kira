import { Link } from "react-router-dom"

export default function Test({data}) {
  return (
    <div>
        {data.map((board) => (
            <div key={board.boardId}>
                <p>{board.boardName}</p>
                <p>{board.boardId}</p>
                <Link to={`/board/${board.boardId}`}>Open this board</Link>
            </div>
        ))}
        a
    </div>
  )
}
