import {
  type ThunkAction,
  configureStore,
  type Action,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistCombineReducers, persistStore } from "redux-persist";

import personels from "./slice/personels";
import items from "./slice/items";
import services from "./slice/services";
import payments from "./slice/payments";
import visits from "./slice/visits";
import clients from "./slice/clients";
import users from "./slice/users";
import auth from "./slice/auth";

const reducer = {
  users,
  personels,
  services,
  items,
  payments,
  clients,
  visits,
  auth,
};

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["auth"],
};

const persist = persistCombineReducers(persistConfig, reducer);

export const store = configureStore({
  reducer: persist,
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
