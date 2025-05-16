import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage

// Import reducers
import accountReducer from "./Slices/Account";
import sidebarToggleReducer from "./Slices/SidebarToggle";
import resolutionReducer from "./Slices/Resolution";
import { apiBase } from "../apis/apiBase";

// Persist configuration
const persistConfig = {
  key: "root", // Static key instead of API_BASE_URL
  storage,
  whitelist: ["account"], // Only persist account slice
  blacklist: [apiBase.reducerPath], // Fix: Corrected blacklist usage
};

// Root reducer
const rootReducer = combineReducers({
  account: accountReducer,
  toggleSidebar: sidebarToggleReducer, // Fixed naming consistency
  resolution: resolutionReducer,
  [apiBase.reducerPath]: apiBase.reducer,
});

// Apply persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiBase.middleware
    ),
  devTools: import.meta.env.MODE !== "production",
});

// Persistor
export const persistor = persistStore(store);

// Enable automatic refetching for RTK Query
setupListeners(store.dispatch);

export default store;
