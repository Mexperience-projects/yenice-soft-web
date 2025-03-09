import { ClientType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ClientType[] = [];

const slices = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<ClientType[]>) => action.payload,
  },
});

export default slices.reducer;
export const { setClients } = slices.actions;
