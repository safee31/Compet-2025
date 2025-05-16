import { createSlice } from "@reduxjs/toolkit";

let init = {
  x: 0,
  y: 0,
};

const resolutionSlice = createSlice({
  name: "resolution",
  initialState: init,
  reducers: {
    setResolution(state, action) {
      return action.payload;
    },
  },
});

export const { setResolution } = resolutionSlice.actions;

export default resolutionSlice.reducer;
