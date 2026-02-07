import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Async thunks for backend synchronization
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (animalId, { rejectWithValue }) => {
    try {
      const response = await api.post('/wishlist/', { animal_id: animalId });
      return response.data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (itemId, { rejectWithValue }) => {
    try {
      await api.delete(`/wishlist/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const initialState = {
  items: [], // Array of wishlist items with animal details
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    // Optimistic update for instant UI feedback
    optimisticAddToWishlist(state, action) {
      const animalId = action.payload;
      const exists = state.items.some(item => item.animal?.id === animalId || item.animal_id === animalId);
      if (!exists) {
        state.items.push({ animal: { id: animalId }, id: `temp-${Date.now()}` });
      }
    },
    // Optimistic remove from wishlist
    optimisticRemoveFromWishlist(state, action) {
      const animalId = action.payload;
      state.items = state.items.filter(
        item => item.animal?.id !== animalId && item.animal_id !== animalId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const newItem = action.payload;
        const exists = state.items.some(item => 
          item.animal?.id === newItem.animal?.id || item.animal_id === newItem.animal_id
        );
        if (!exists) {
          state.items.push(newItem);
        }
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.items = state.items.filter(item => item.id !== itemId);
      });
  },
});

export const { clearWishlist, optimisticAddToWishlist, optimisticRemoveFromWishlist } = wishlistSlice.actions;

// Selector to check if an animal is in wishlist
export const selectIsInWishlist = (state, animalId) => {
  return state.wishlist.items.some(item => 
    item.animal?.id === animalId || item.animal_id === animalId
  );
};

// Selector for all wishlist items
export const selectWishlistItems = (state) => state.wishlist.items;

// Selector for wishlist count
export const selectWishlistCount = (state) => state.wishlist.items.length;

export default wishlistSlice.reducer;
