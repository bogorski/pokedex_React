import { createSlice } from "@reduxjs/toolkit";

export const locationPathnameSlice = createSlice({
	name: "locationPathname",
	initialState: {
		value: "/",
	},
	reducers: {
		changeLocationPathname: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { changeLocationPathname } = locationPathnameSlice.actions;

export default locationPathnameSlice.reducer;
