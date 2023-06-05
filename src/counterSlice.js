import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
	name: "counter",
	initialState: {
		value: 10,
	},
	reducers: {
		increment: (state) => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes
			console.log(state.value, "toto");
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
			console.log(state.pokemon, "toto");
		},
		/*	addPokemon: (state, { payload }) => {
			return {
				pokemon: [...state.pokemon, ...payload],
			};
		},*/
		/*{
			reducer: (state, action) => {
				//state.pokemon.push(action.payload);
				[...state.pokemon, action.payload];
			},
			prepare: (text) => {
				return { payload: text };
			},
		},*/
	},
});

// Action creators are generated for each case reducer function
export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;
