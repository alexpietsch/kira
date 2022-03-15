import { useEffect, useReducer, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case "IS_PENDING":
            return { isPending: true, document: null, success: false, error: null }
        case "NEW_DOCUMENT_ADDED":
            return { isPending: false, document: action.payload, success: true, error: null }
        case "DELETED_DOCUMENT":
            return { isPending: false, document: null, success: true, error: null }
        case "ERROR":
            return { isPending: false, document: null, success: false, error: action.payload}
        default:
            return state
    }
}

export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // collectioon reference
    const ref = projectFirestore.collection(collection)

    // dispatch if not cancelled
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) { dispatch(action) }
    }

    // add new document
    const addDocument = async (doc) => {

        dispatch({ type: "IS_PENDING" })
        
        try {
            const createdAt = timestamp.fromDate(new Date())
            const newDocumentAdded = await ref.add({ ...doc, createdAt })
            dispatchIfNotCancelled({ type: "NEW_DOCUMENT_ADDED", payload: newDocumentAdded })
        } catch (err) {
            dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
        }
    }

    const deleteDocument = async (id) => {
        dispatch({ type: "IS_PENDING" })

        try {
            await ref.doc(id).delete()
            dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" })
        } catch (err) {
            dispatchIfNotCancelled({ type: "ERROR", payload: "Could not delete document." })
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, deleteDocument, response }

}