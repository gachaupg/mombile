import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, storage, auth } from "../../services/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { deleteUser, updateProfile } from "firebase/auth";

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ userId, profileData, profileImage }, { rejectWithValue }) => {
    try {
      // Start with existing data
      let updatedProfile = {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      // Handle profile image upload if provided
      if (profileImage) {
        try {
          const imageRef = ref(storage, `profile_images/${userId}`);
          const response = await fetch(profileImage);

          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }

          const blob = await response.blob();

          await uploadBytes(imageRef, blob);
          const downloadURL = await getDownloadURL(imageRef);

          // Only update photoURL if we got a valid URL back
          if (downloadURL) {
            updatedProfile.photoURL = downloadURL;
          }
        } catch (imageError) {
          console.error("Error uploading profile image:", imageError);
          // Continue with profile update even if image upload fails
        }
      }

      // Ensure photoURL is never undefined
      if (updatedProfile.photoURL === undefined) {
        updatedProfile.photoURL = "";
      }

      // Update Firestore profile
      await setDoc(doc(db, "users", userId), updatedProfile, { merge: true });

      // Update Auth profile display name if it changed
      if (
        auth.currentUser &&
        (auth.currentUser.displayName !== profileData.displayName ||
          auth.currentUser.photoURL !== updatedProfile.photoURL)
      ) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.displayName,
          photoURL: updatedProfile.photoURL,
        });
      }

      return updatedProfile;
    } catch (error) {
      console.error("Profile update error:", error);
      return rejectWithValue(
        error.message || "Failed to update profile. Please try again."
      );
    }
  }
);

export const createUserProfile = createAsyncThunk(
  "profile/createUserProfile",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const userProfile = {
        uid: userId,
        displayName: userData.displayName || "",
        email: userData.email,
        photoURL: userData.photoURL || "",
        favoriteTeam: userData.favoriteTeam || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userId), userProfile);
      return userProfile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  "profile/deleteUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      // Delete profile image if exists
      try {
        const imageRef = ref(storage, `profile_images/${userId}`);
        await deleteObject(imageRef);
      } catch (error) {
        // Ignore if image doesn't exist
        console.log("No profile image to delete or error deleting:", error);
      }

      // Delete user document
      await deleteDoc(doc(db, "users", userId));

      // Delete user account
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }

      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create User Profile
      .addCase(createUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User Profile
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
