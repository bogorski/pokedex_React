import { createSlice } from "@reduxjs/toolkit";

export const scrollTopSlice = createSlice({
	name: "scrollTop",
	initialState: {
		value: 0,
	},
	reducers: {
		changeScroll: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { changeScroll } = scrollTopSlice.actions;

export default scrollTopSlice.reducer;
