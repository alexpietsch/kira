import firebase from "firebase/app"
import 'firebase/firestore'
import "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBlIpFTYpZ0WvTxm-RE6NKm56SZ2QgE1DU",
    authDomain: "kira-9d1ff.firebaseapp.com",
    projectId: "kira-9d1ff",
    storageBucket: "kira-9d1ff.appspot.com",
    messagingSenderId: "413564936354",
    appId: "1:413564936354:web:9ed2c7923f664262b477fb"
};

firebase.initializeApp(firebaseConfig)

// init service
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, timestamp }