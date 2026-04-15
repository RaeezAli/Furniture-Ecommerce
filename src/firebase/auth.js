import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";
import { nanoid } from "nanoid";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

/**
 * Sign up a new user and create their Firestore document with default 'customer' role
 */
export const registerUser = async (email, password, name) => {
  try {
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update Auth Profile with name
    await updateProfile(user, { displayName: name });

    // 3. Create user document in Firestore with 'customer' role
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: "customer",
      internalId: nanoid(8).toUpperCase(),
      createdAt: new Date(),
      isBlocked: false
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Log in an existing user
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Log out the current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Fetch a user's role and profile data from Firestore
 */
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
