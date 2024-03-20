import { createSlice } from "@reduxjs/toolkit";

export const workSpaceHeaderSlice = createSlice({
  name: "Workspace header",
  initialState: {
    header: "Visits",
  },
  reducers: {
    toogleChanges: (state, action) => {
      const { name } = action.payload;
      state.header = name;
    },
  },
});

export const { toogleChanges } = workSpaceHeaderSlice.actions;

export default workSpaceHeaderSlice.reducer;
