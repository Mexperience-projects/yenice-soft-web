import { USER_PERMISSIONS } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthType {
  username: string;
  permissions: USER_PERMISSIONS[];
}

const initialState: { user?: AuthType } = {};

const slices = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthType>) => ({
      ...state,
      user: action.payload,
    }),
  },
});

export default slices.reducer;
export const { setAuth } = slices.actions;
