// hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useFirestore } from "../hooks/useFirestore";

// packages
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

// components
import TaskAdd from "./TaskAdd";
import TaskEdit from "./TaskEdit";
import ColumnEdit from "./ColumnEdit";
import ConfirmModal from "./ConfirmModal";
import BoardEdit from "./BoardEdit";

// icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// mui components
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// styles
import "./ListBoard.css";

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

// END-OF handle task movement helper functions

export default function ListBoard() {
  const { user } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, error } = useCollection(
    "tasks",
    ["boardID", "==", id],
    user
  );
  const { updateDocument } = useFirestore("tasks");

  let data = null;
  if (documents) {
    data = documents[0];
  }

  const [boardData, setBoardData] = useState(null);

  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);
  const [isColumnAddOpen, setIsColumnAddOpen] = useState(false);

  const [isTaskAddModalOpen, setIsTaskAddModalOpen] = useState(false);
  const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);

  const [isBoardEditOpen, setIsBoardEditOpen] = useState(false);

  const [showCardDeleteConfirmModal, setShowCardDeleteConfirmModal] =
    useState(false);

  const [modalActiveColumn, setModalActiveColumn] = useState(null);
  const [modalActiveCard, setModalActiveCard] = useState(null);
  const [showError, setShowError] = useState(false);

  const [newColumnName, setNewColumnName] = useState("");

  useEffect(() => {
    setBoardData(data);
  }, [data]);

  function handleOnDragEnd(result) {
    const { source, destination } = result;
    // check if the card is dropped outside the column area
    if (!destination) {
      return;
    }
    // check if the card is dropped in the same column and the index
    // does not change (case if card is dragged and then dropped at the same position)
    else if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sInd = source.droppableId;
    const dInd = destination.droppableId;
    let newState = boardData;

    if (sInd === dInd) {
      const column = newState.columns.find(
        (column) => column.columnID === sInd
      );
      const items = reorder(column.cards, source.index, destination.index);
      const isTargetColumn = (column) => column.columnID === sInd;
      const indexOfColumn = newState.columns.findIndex(isTargetColumn);
      newState.columns[indexOfColumn].cards = items;
    } else {
      // find the source and destination columns for the move function
      const sourceColumn = newState.columns.find(
        (column) => column.columnID === sInd
      );
      const destColumn = newState.columns.find(
        (column) => column.columnID === dInd
      );
      // call move function with the source and destination columns as arrays
      // and the source and destination which are the two droppables
      //
      // the move function returns an object with the source and destination as attributes
      // and each of them has an array of cards for their column
      const items = move(
        sourceColumn.cards,
        destColumn.cards,
        source,
        destination
      );
      // find the index of the source and destination columns in the columns array
      const indexOfSourceColumn = newState.columns.findIndex(
        (column) => column.columnID === sInd
      );
      const indexOfDestColumn = newState.columns.findIndex(
        (column) => column.columnID === dInd
      );
      // set the cards arrays in both columns in the new state to before calculated arrays from the move function
      newState.columns[indexOfSourceColumn].cards = items[sInd];
      newState.columns[indexOfDestColumn].cards = items[dInd];
    }
    setBoardData(newState);
    updateDocument(boardData.boardID, { columns: newState.columns });
  }

  function handleDeleteCard() {
    let newState = boardData;
    const sourceColumn = modalActiveColumn;
    const sourceCard = modalActiveCard;
    const isTargetColumn = (column) =>
      column.columnID === sourceColumn.columnID;
    const indexOfColumn = newState.columns.findIndex(isTargetColumn);
    newState.columns[indexOfColumn].cards = newState.columns[
      indexOfColumn
    ].cards.filter((c) => c.cardID !== sourceCard.cardID);
    setBoardData(newState);
    setModalActiveCard(null);
    setModalActiveColumn(null);
    setShowCardDeleteConfirmModal(false);
    updateDocument(boardData.boardID, { columns: newState.columns });
  }
  function handleAddColumn(e) {
    e.preventDefault();
    if (!newColumnName) {
      setShowError(true);
      return;
    }
    const column = {
      columnID: uuidv4(),
      columnName: newColumnName,
      cards: [],
    };
    let columns = boardData.columns;
    columns.push(column);
    setShowError(false);
    updateDocument(boardData.boardID, { columns: columns });
    setIsColumnAddOpen(false);
    setNewColumnName("");
  }
  return (
    <>
      {/* Modals */}

      {isTaskAddModalOpen && (
        <TaskAdd
          boardData={boardData}
          sourceColumnID={modalActiveColumn}
          setBoardData={setBoardData}
          isTaskAddModalOpen={isTaskAddModalOpen}
          setIsTaskAddModalOpen={setIsTaskAddModalOpen}
        />
      )}
      {isTaskEditModalOpen && (
        <TaskEdit
          sourceCard={modalActiveCard}
          sourceColumn={modalActiveColumn}
          boardData={boardData}
          setBoardData={setBoardData}
          isTaskEditModalOpen={isTaskEditModalOpen}
          setIsTaskEditModalOpen={setIsTaskEditModalOpen}
        />
      )}
      {isEditColumnOpen && (
        <ColumnEdit
          boardData={boardData}
          setBoardData={setBoardData}
          isEditColumnOpen={isEditColumnOpen}
          setIsEditColumnOpen={setIsEditColumnOpen}
          modalActiveColumn={modalActiveColumn}
          setModalActiveColumn={setModalActiveColumn}
        />
      )}
      {isBoardEditOpen && (
        <BoardEdit
          boardData={boardData}
          setBoardData={setBoardData}
          isBoardEditOpen={isBoardEditOpen}
          setIsBoardEditOpen={setIsBoardEditOpen}
        />
      )}

      {showCardDeleteConfirmModal && (
        <ConfirmModal
          title={"Delete Task?"}
          message={"Do you want to delete this Task?"}
          handleYesAction={handleDeleteCard}
          handleNoAction={() => {
            setShowCardDeleteConfirmModal(false);
            setModalActiveCard(null);
            setModalActiveColumn(null);
          }}
        />
      )}

      {/* END Modals */}

      <IconButton
        style={{ position: "absolute", top: "100px", left: "5px" }}
        onClick={() => {
          navigate("/");
        }}
      >
        <ArrowBackIcon style={{ color: "#000", fontSize: "1.5em" }} />
      </IconButton>

      {boardData && (
        <h2>
          {boardData.boardName}
          <IconButton
            onClick={() => {
              setIsBoardEditOpen(true);
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        </h2>
      )}
      <Box style={{ width: "100%", overflowX: "auto" }}>
        <div className="list-container">
          {!error && (
            <>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                {boardData &&
                  boardData.columns.map((column) => (
                    <div key={column.columnID} className="taskColumn">
                      <h2>
                        {column.columnName} ({column.cards.length})
                        <IconButton
                          onClick={() => {
                            setIsEditColumnOpen(true);
                            setModalActiveColumn(column);
                          }}
                        >
                          <EditIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </h2>
                      <Droppable droppableId={column.columnID}>
                        {(provided) => (
                          <>
                            <Button
                              variant="contained"
                              onClick={() => {
                                setIsTaskAddModalOpen(true);
                                setModalActiveColumn(column.columnID);
                              }}
                            >
                              Add Task
                            </Button>
                            <Paper elevation={1}>
                              <ul
                                className="column"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {boardData &&
                                  column.cards.map((card, index) => {
                                    return (
                                      <Draggable
                                        key={card.cardID}
                                        draggableId={card.cardID}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <li
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            className={
                                              card.cardDeadline &&
                                              card.cardDeadline
                                                .toDate()
                                                .getTime() <=
                                                new Date(
                                                  new Date().setHours(
                                                    0,
                                                    0,
                                                    0,
                                                    0
                                                  )
                                                ).getTime()
                                                ? "taskCard is-expired"
                                                : "taskCard"
                                            }
                                            onDoubleClick={() => {
                                              setIsTaskEditModalOpen(true);
                                              setModalActiveCard(card);
                                              setModalActiveColumn(
                                                column.columnID
                                              );
                                            }}
                                          >
                                            <p>{card.cardName}</p>
                                            <span
                                              className="deleteButton"
                                              onClick={() => {
                                                setModalActiveColumn(column);
                                                setModalActiveCard(card);
                                                setShowCardDeleteConfirmModal(
                                                  true
                                                );
                                              }}
                                            >
                                              <DeleteOutlineIcon />
                                            </span>
                                            <div className="labelWrapper">
                                              {card.cardLabels.map((label) => {
                                                return (
                                                  <span
                                                    key={label.labelID}
                                                    className="label"
                                                    style={{
                                                      backgroundColor:
                                                        label.labelColor,
                                                      color:
                                                        label.labelTextColor,
                                                    }}
                                                  >
                                                    {label.labelName}
                                                  </span>
                                                );
                                              })}
                                            </div>
                                          </li>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                {provided.placeholder}
                              </ul>
                            </Paper>
                          </>
                        )}
                      </Droppable>
                    </div>
                  ))}
              </DragDropContext>
              <div className="taskColumn" style={{ paddingTop: "4.5em" }}>
                {!isColumnAddOpen && (
                  <Button
                    variant="outlined"
                    style={{ marginBottom: "1.4em" }}
                    onClick={() => setIsColumnAddOpen(true)}
                  >
                    + New Column
                  </Button>
                )}
                {isColumnAddOpen && (
                  <Button
                    variant="outlined"
                    style={{ marginBottom: "1.4em" }}
                    onClick={() => {
                      setIsColumnAddOpen(false);
                      setNewColumnName("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {isColumnAddOpen && (
                  <div className="column">
                    <form onSubmit={handleAddColumn}>
                      <label>
                        {showError && (
                          <>
                            <br />
                            <span style={{ color: "red" }}>
                              Column Name can't be empty
                            </span>
                          </>
                        )}
                        <TextField
                          label="Column Name"
                          onChange={(e) => setNewColumnName(e.target.value)}
                          value={newColumnName}
                          size="small"
                          style={{ marginBottom: "1.4em", marginTop: ".4em" }}
                        />
                      </label>
                      <Button variant="contained" type="submit">
                        add Column
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Box>
    </>
  );
}
