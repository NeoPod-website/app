import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],

  currentCategory: {
    id: null,
    title: "",
    description: "",
    icon: "/dashboard/category/icon-1.png",
    background: "/dashboard/category/background-2.jpg",
  },

  isLoading: false,
  error: null,
};

export const categorySlice = createSlice({
  name: "category",

  initialState,

  reducers: {
    // Set the current category being edited/viewed
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },

    // Update a specific field in the current category
    updateCurrentCategory: (state, action) => {
      const { field, value } = action.payload;

      state.currentCategory = {
        ...state.currentCategory,
        [field]: value,
      };
    },

    // Reset the current category to initial state
    resetCurrentCategory: (state) => {
      state.currentCategory = initialState.currentCategory;
    },

    // Set all categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    // Add a new category to the list
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },

    // Update an existing category in the list
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(
        (cat) => cat.id === action.payload.id,
      );

      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },

    // Delete a category from the list
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(
        (cat) => cat.id !== action.payload,
      );
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentCategory,
  updateCurrentCategory,
  resetCurrentCategory,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setLoading,
  setError,
} = categorySlice.actions;

export default categorySlice.reducer;

// // Example thunk for async operations (optional)
// // src/redux/features/categoryThunks.js
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import {
//   setLoading,
//   setError,
//   setCategories,
//   setCurrentCategory,
//   addCategory,
//   updateCategory,
//   deleteCategory
// } from './categorySlice';

// // Fetch all categories
// export const fetchCategories = createAsyncThunk(
//   'category/fetchCategories',
//   async (_, { dispatch }) => {
//     try {
//       dispatch(setLoading(true));
//       // Replace with your API call
//       const response = await fetch('/api/categories');
//       const data = await response.json();

//       dispatch(setCategories(data));
//       return data;
//     } catch (error) {
//       dispatch(setError(error.message));
//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );

// // Fetch a single category
// export const fetchCategory = createAsyncThunk(
//   'category/fetchCategory',
//   async (categoryId, { dispatch }) => {
//     try {
//       dispatch(setLoading(true));
//       // Replace with your API call
//       const response = await fetch(`/api/categories/${categoryId}`);
//       const data = await response.json();

//       dispatch(setCurrentCategory(data));
//       return data;
//     } catch (error) {
//       dispatch(setError(error.message));
//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );

// // Create a new category
// export const createCategory = createAsyncThunk(
//   'category/createCategory',
//   async (categoryData, { dispatch }) => {
//     try {
//       dispatch(setLoading(true));
//       // Replace with your API call
//       const response = await fetch('/api/categories', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(categoryData)
//       });
//       const data = await response.json();

//       dispatch(addCategory(data));
//       return data;
//     } catch (error) {
//       dispatch(setError(error.message));
//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );

// // Update an existing category
// export const saveCategory = createAsyncThunk(
//   'category/saveCategory',
//   async (categoryData, { dispatch }) => {
//     try {
//       dispatch(setLoading(true));
//       // Replace with your API call
//       const response = await fetch(`/api/categories/${categoryData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(categoryData)
//       });
//       const data = await response.json();

//       dispatch(updateCategory(data));
//       return data;
//     } catch (error) {
//       dispatch(setError(error.message));
//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );

// // Remove a category
// export const removeCategory = createAsyncThunk(
//   'category/removeCategory',
//   async (categoryId, { dispatch }) => {
//     try {
//       dispatch(setLoading(true));
//       // Replace with your API call
//       await fetch(`/api/categories/${categoryId}`, {
//         method: 'DELETE'
//       });

//       dispatch(deleteCategory(categoryId));
//       return categoryId;
//     } catch (error) {
//       dispatch(setError(error.message));
//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }
// );
