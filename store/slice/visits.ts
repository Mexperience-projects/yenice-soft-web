import { VisitType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: VisitType[] = [];

const slices = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setVisits: (state, action: PayloadAction<VisitType[]>) => action.payload,
  },
});

export default slices.reducer;
export const { setVisits } = slices.actions;
