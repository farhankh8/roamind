import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, orderBy, limit, onSnapshot, QueryConstraint, writeBatch, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export { db }

export interface BaseDocument {
  id: string
  createdAt?: ReturnType<typeof serverTimestamp>
  updatedAt?: ReturnType<typeof serverTimestamp>
}

class DatabaseError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

async function getDocument<T extends BaseDocument>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId)
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null
    return { id: snapshot.id, ...snapshot.data() } as T
  } catch (error) {
    console.error(`Error getting document ${collectionName}/${docId}:`, error)
    throw new DatabaseError(`Failed to get document: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GET_DOCUMENT_ERROR')
  }
}

async function setDocument<T extends BaseDocument>(collectionName: string, docId: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    console.error(`Error setting document ${collectionName}/${docId}:`, error)
    throw new DatabaseError(`Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`, 'SET_DOCUMENT_ERROR')
  }
}

async function updateDocument<T extends Record<string, unknown>>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error(`Error updating document ${collectionName}/${docId}:`, error)
    throw new DatabaseError(`Failed to update document: ${error instanceof Error ? error.message : 'Unknown error'}`, 'UPDATE_DOCUMENT_ERROR')
  }
}

async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document ${collectionName}/${docId}:`, error)
    throw new DatabaseError(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DELETE_DOCUMENT_ERROR')
  }
}

async function getCollection<T extends BaseDocument>(collectionName: string, ...constraints: QueryConstraint[]): Promise<T[]> {
  try {
    const collRef = collection(db, collectionName)
    const q = query(collRef, ...constraints)
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T))
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw new DatabaseError(`Failed to get collection: ${error instanceof Error ? error.message : 'Unknown error'}`, 'GET_COLLECTION_ERROR')
  }
}

function subscribeToDocument<T extends BaseDocument>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
): () => void {
  const docRef = doc(db, collectionName, docId)
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null)
    } else {
      callback({ id: snapshot.id, ...snapshot.data() } as T)
    }
  })
}

function subscribeToCollection<T extends BaseDocument>(
  collectionName: string,
  callback: (data: T[]) => void,
  ...constraints: QueryConstraint[]
): () => void {
  const collRef = collection(db, collectionName)
  const q = query(collRef, ...constraints)
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T))
    callback(data)
  })
}

async function batchWrite(operations: Array<{
  type: 'set' | 'update' | 'delete'
  collectionName: string
  docId: string
  data?: Record<string, unknown>
}>): Promise<void> {
  try {
    const batch = writeBatch(db)
    for (const op of operations) {
      const docRef = doc(db, op.collectionName, op.docId)
      if (op.type === 'set') {
        batch.set(docRef, { ...op.data, updatedAt: serverTimestamp() })
      } else if (op.type === 'update') {
        batch.update(docRef, { ...op.data, updatedAt: serverTimestamp() })
      } else {
        batch.delete(docRef)
      }
    }
    await batch.commit()
  } catch (error) {
    console.error('Error in batch write:', error)
    throw new DatabaseError(`Failed to batch write: ${error instanceof Error ? error.message : 'Unknown error'}`, 'BATCH_WRITE_ERROR')
  }
}

export const dbUtils = {
  getDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  getCollection,
  subscribeToDocument,
  subscribeToCollection,
  batchWrite
}

export default dbUtils