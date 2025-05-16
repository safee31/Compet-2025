import { createSlice } from "@reduxjs/toolkit";

let init = JSON.parse(localStorage.getItem("dummy-cld"));

// const validateUser = createAsyncThunk("/auth", async () => {
//   let data = "function here";

//   return data;
// });

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
