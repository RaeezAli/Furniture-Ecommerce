import { useState, useCallback } from "react";
import { firestoreService } from "../firebase/firestore";

/**
 * Custom hook to abstract firestore operations
 */
export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCollection = useCallback(async (collectionName, orderByField, direction) => {
    setLoading(true);
    setError(null);
    try {
      const data = await firestoreService.getAll(collectionName, orderByField, direction);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDocument = useCallback(async (collectionName, id, data) => {
    setLoading(true);
    setError(null);
    try {
      await firestoreService.update(collectionName, id, data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (collectionName, id) => {
    setLoading(true);
    setError(null);
    try {
      await firestoreService.delete(collectionName, id);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const addDocument = useCallback(async (collectionName, data) => {
    setLoading(true);
    setError(null);
    try {
      const id = await firestoreService.add(collectionName, data);
      return id;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const setDocument = useCallback(async (collectionName, id, data) => {
    setLoading(true);
    setError(null);
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("../firebase/config");
      await setDoc(doc(db, collectionName, id), { ...data, updatedAt: new Date() }, { merge: true });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchCollection, updateDocument, deleteDocument, addDocument, setDocument };
};
