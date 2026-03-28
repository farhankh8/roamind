import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBNceR3FuxAnVdKYwM6Bh6zOzoRvjAt6xs",
  authDomain: "roamind-a6638.firebaseapp.com",
  projectId: "roamind-a6638",
  storageBucket: "roamind-a6638.firebasestorage.app",
  messagingSenderId: "658642218186",
  appId: "1:658642218186:web:0c95a95532f7d1c39b5833",
  measurementId: "G-D7CEC6LQ3M"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export default app
