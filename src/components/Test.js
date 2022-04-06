export default function Test({data}) {
    console.log(data)
  return (
    <div>
        {data.map((board) => (
            <div key={board.boardId}>{console.log(board)}
                <p>{board.boardName}</p>
                <p>{board.boardId}</p>
                {board.columns.map((column)=>console.log(column))}
                {console.log(board.columns)}
            </div>
        ))}
        a
    </div>
  )
}
