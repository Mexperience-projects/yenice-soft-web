import { ItemsType, PersonelType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ItemsType[] = [];

const slices = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ItemsType[]>) => action.payload,
  },
});

export default slices.reducer;
export const { setItems } = slices.actions;
