import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Async thunk for fetching orders from backend
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Load orders from localStorage or default to empty history
const loadOrdersFromLocalStorage = () => {
  try {
    const serializedOrders = localStorage.getItem('orders');
    if (serializedOrders === null) {
      return { history: [], status: 'idle', error: null };
    }
    return { ...JSON.parse(serializedOrders), status: 'idle', error: null };
  } catch (err) {
    console.error('Could not load orders from localStorage:', err);
    return { history: [], status: 'idle', error: null };
  }
};

// Save orders to localStorage
const saveOrdersToLocalStorage = (history) => {
  try {
    const serializedOrders = JSON.stringify({ history });
    localStorage.setItem('orders', serializedOrders);
  } catch (err) {
    console.error('Could not save orders to localStorage:', err);
  }
};

const initialState = loadOrdersFromLocalStorage();

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action) {
      // Unshift to add new order at the beginning (newest first)
      state.history.unshift(action.payload);
      // Save updated history to localStorage
      saveOrdersToLocalStorage(state.history);
    },
    clearOrders(state) {
      state.history = [];
      state.status = 'idle';
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('orders');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
