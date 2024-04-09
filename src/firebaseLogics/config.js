/** @format */

import { createAsyncThunk, createSlice  } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  deleteObject, 
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, firestore, storage } from "../api/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const signup = createAsyncThunk(
  "user/createUserAndProfile",
  async (data, thunkAPI) => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(auth.currentUser, { displayName: data.userName });
      window.location.reload();
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk("login", async (data, thunkAPI) => {
  try {
    const user = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    window.location.reload();
    return user;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.message);
  }
});
export const logout = createAsyncThunk("logout", async () => {
  let localUser = JSON.parse(localStorage.getItem("localUser"));
  if (localUser) {
    localStorage.removeItem("localUser");
  }
  auth.signOut();
  window.location.reload();
});
export const newFolder = createAsyncThunk("newFolder", async (payload) => {
  console.log(payload);
  const folder = {
    name: payload.folderName,
    userId: payload.userId,
    type: "folder",
    folderId: payload.folderId,
    date: new Date(),
  };
  const folderRef = collection(firestore, "Folders");

  await addDoc(folderRef, folder);
});

export const upload = createAsyncThunk("files/upload", async (data) => {
  console.log(data);
  const { file, userId, folderId } = data;

  try {
    const storage = getStorage();
    const name = `${new Date()}_${file.name}`;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const snapshot = await uploadTask;

    const url = await getDownloadURL(snapshot.ref);

    const fileData = {
      name: name,
      filename: file.name,
      url: url,
      userId: userId,
      folderId: folderId,
      type: "file",
      date: new Date(),
    };

    const docRef = await addDoc(collection(firestore, "files"), fileData);

    return {
      id: docRef.id,
      ...fileData,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
});
export const allFiles = createAsyncThunk(
  "files/fetchUserFilesfetchUserFile",
  async (userId, { rejectWithValue }) => {
    try {
      const filesRef = collection(firestore, "files");
      const userFilesQuery = query(filesRef, where("userId", "==", userId));
      const snapshot = await getDocs(userFilesQuery);
      const files = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return files;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const userFolder = createAsyncThunk(
  "folders/get",
  async (userId, { rejectWithValue }) => {
    try {
      const filesRef = collection(firestore, "Folders");
      const userFolder = query(filesRef, where("userId", "==", userId));
      const snapshot = await getDocs(userFolder);
      const folders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return folders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteFiles = createAsyncThunk("Delete", async (payload) => {
  console.log(payload);

  const storageRef = ref(storage, payload.name);

  // Check if the file exists before attempting to delete it
  try {
    await getDownloadURL(storageRef);

    // The file exists, so delete it
    await deleteObject(storageRef);

    console.log("File deleted successfully");

    // Also delete the corresponding document in Firestore
    await deleteDoc(doc(firestore, "files", payload.id));

    console.log("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting file or document:", error);
  }
});
export const setting = createAsyncThunk(
  "user/changeProfile",
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.username,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState  = {
  error: null,
  loading: false,
  filesData: [],
  filesLoading: false,
  postLoading: false,
  foldersData: [],
};
const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newFolder.pending, (state, action) => {
        state.filesLoading = true;
        state.postLoading = true;
      })
      .addCase(newFolder.fulfilled, (state, action) => {
        state.filesLoading = false;
        state.postLoading = false;
      })
      .addCase(newFolder.rejected, (state, action) => {});
    builder
      .addCase(upload.pending, (state, action) => {
        state.postLoading = true;
      })
      .addCase(upload.fulfilled, (state, action) => {
        state.postLoading = false;
      })
      .addCase(upload.rejected, (state, action) => {});
    builder
      .addCase(allFiles.pending, (state, action) => {
        state.filesLoading = true;
      })
      .addCase(allFiles.fulfilled, (state, action) => {
        state.filesLoading = false;
        state.filesData = action.payload;
      })
      .addCase(allFiles.rejected, (state, action) => {});
    builder
      .addCase(userFolder.pending, (state, action) => {
        state.filesLoading = true;
      })
      .addCase(userFolder.fulfilled, (state, action) => {
        state.filesLoading = false;
        state.foldersData = action.payload;
      })
      .addCase(userFolder.rejected, (state, action) => {});
    builder
      .addCase(signup.pending, (state, action) => {
        state.filesLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.filesLoading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.error.message;
      });
    builder
      .addCase(login.pending, (state, action) => {
        state.filesLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.filesLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
      });
    builder
      .addCase(deleteFiles.pending, (state, action) => {
        state.postLoading = true;
      })
      .addCase(deleteFiles.fulfilled, (state, action) => {
        state.postLoading = false;
      })
      .addCase(deleteFiles.rejected, (state, action) => {
        state.error = action.error.message;
      });
    builder
      .addCase(setting.pending, (state, action) => {
        state.postLoading = true;
      })
      .addCase(setting.fulfilled, (state, action) => {
        state.postLoading = false;
      })
      .addCase(setting.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});
export const {} = filesSlice.actions;
export default filesSlice.reducer;