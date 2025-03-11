import {
  type ThunkAction,
  configureStore,
  type Action,
} from "@reduxjs/toolkit";

import personels from "./slice/personels";
import items from "./slice/items";
import services from "./slice/services";
import payments from "./slice/payments";
import visits from "./slice/visits";
import clients from "./slice/clients";
import users from "./slice/users";
// import core from "./core/slice";

export const store = configureStore({
  reducer: {
    // core,
    users,
    personels,
    services,
    items,
    payments,
    clients,
    visits,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
