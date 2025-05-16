import { createSlice } from "@reduxjs/toolkit";

const sidebarToggleSlice = createSlice({
  name: "sidebarToggle",
  initialState: { menu: false, subMenu: false },
  reducers: {
    setSidebarToggle: (state, action) =>
      action.payload
        ? { ...state, menu: action.payload }
        : { ...state, menu: !state.menu },
    setSubMenuToggle: (state, action) =>
      action.payload !== undefined
        ? { ...state, subMenu: action.payload }
        : { ...state, subMenu: !state.subMenu },
  },
});

export const { setSidebarToggle, setSubMenuToggle } =
  sidebarToggleSlice.actions;

export default sidebarToggleSlice.reducer;
