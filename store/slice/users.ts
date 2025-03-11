import { UsersType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UsersType[] = [];

const slices = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setuserss: (state, action: PayloadAction<UsersType[]>) => action.payload,
  },
});

export default slices.reducer;
export const { setuserss } = slices.actions;
