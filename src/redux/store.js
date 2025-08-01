import { configureStore, combineReducers } from "@reduxjs/toolkit";
import CartSlice from "./slices/CartSlice";
import CompareSlice from "./slices/compareSlice"
import RecentlyViewedSlice from "./slices/recentlyViewedSlice"
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productSlice from "./slices/productSlice";
import { 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';



const rootReducer = combineReducers({
  cart: CartSlice,
    compare: CompareSlice,
    recentlyViewed: RecentlyViewedSlice,
      products: productSlice,
   

});


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart','compare','recentlyViewed','products'] 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(Store);


export default Store;