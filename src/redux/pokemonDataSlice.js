import { createSlice } from "@reduxjs/toolkit";

export const pokemonDataSlice = createSlice({
	name: "pokemonData",
	initialState: {
		pokemon: [],
	},
	reducers: {
		addPokemon: (state, { payload }) => {
			return {
				pokemon: [...state.pokemon, ...payload],
			};
		},
	},
});

export const { addPokemon } = pokemonDataSlice.actions;

export default pokemonDataSlice.reducer;
