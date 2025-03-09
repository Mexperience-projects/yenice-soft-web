import { ItemsType, PersonelType, ServicesType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ServicesType[] = [];

const slices = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<ServicesType[]>) =>
      action.payload,
  },
});

export default slices.reducer;
export const { setServices } = slices.actions;
