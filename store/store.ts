import {
  type ThunkAction,
  configureStore,
  type Action,
} from "@reduxjs/toolkit";

import personels from "./slice/personels";
import items from "./slice/items";
import services from "./slice/services";
import payments from "./slice/payments";
import clients from "./slice/clients";
import core from "./core/slice";

export const store = configureStore({
  reducer: {
    core,
    personels,
    services,
    items,
    payments,
    clients,
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
