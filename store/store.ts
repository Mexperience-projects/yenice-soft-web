import {
  type ThunkAction,
  configureStore,
  type Action,
} from "@reduxjs/toolkit";

import personels from "./slice/personels";
import core from "./core/slice";

export const store = configureStore({
  reducer: {
    core,
    personels,
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
