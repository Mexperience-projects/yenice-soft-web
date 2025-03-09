import { PersonelType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PersonelType[] = [];

const slices = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setPersonels: (state, action: PayloadAction<PersonelType[]>) =>
      action.payload,
  },
});

export default slices.reducer;
export const { setPersonels } = slices.actions;
