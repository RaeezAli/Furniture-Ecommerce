import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './config';

// Generic firestore service for dashboard
export const firestoreService = {
  // Fetch all documents from a collection
  getAll: async (collectionName, orderByField = "createdAt", direction = "desc") => {
    try {
      const q = query(collection(db, collectionName), orderBy(orderByField, direction));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error fetching collection ${collectionName}:`, error);
      throw error;
    }
  },

  // Get a single document
  getById: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching document ${id} from ${collectionName}:`, error);
      throw error;
    }
  },

  // Update a document
  update: async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw error;
    }
  },

  // Add a document
  add: async (collectionName, data) => {
    try {
      const colRef = collection(db, collectionName);
      const docRef = doc(colRef);
      await setDoc(docRef, {
        ...data,
        id: docRef.id,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  },

  // Delete a document
  delete: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }
};
