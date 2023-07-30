import { createSlice } from "@reduxjs/toolkit";

export const valueSearchSlice = createSlice({
	name: "valueSearch",
	initialState: {
		value: "",
	},
	reducers: {
		changeValue: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { changeValue } = valueSearchSlice.actions;

export default valueSearchSlice.reducer;
