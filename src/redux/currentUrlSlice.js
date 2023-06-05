import { createSlice } from "@reduxjs/toolkit";

export const currentUrlSlice = createSlice({
	name: "currentUrl",
	initialState: {
		valueCurrent: "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=12",
		valueNext: null,
	},
	reducers: {
		changeUrl: (state, action) => {
			state.valueNext !== null && (state.valueCurrent = state.valueNext);
			state.valueNext = action.payload;
		},
	},
});

export const { changeUrl } = currentUrlSlice.actions;

export default currentUrlSlice.reducer;
