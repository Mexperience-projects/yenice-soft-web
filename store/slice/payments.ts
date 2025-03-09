import { PaymentsType, PersonelType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PaymentsType[] = [];

const slices = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<PaymentsType[]>) =>
      action.payload,
  },
});

export default slices.reducer;
export const { setPayments } = slices.actions;
