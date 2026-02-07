import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';
import wishlistReducer from './wishlistSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    wishlist: wishlistReducer
  }
});

export default store;
