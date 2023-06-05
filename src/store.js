import { configureStore } from "@reduxjs/toolkit";
import pokemonDataReducer from "./redux/pokemonDataSlice";
import currentUrlReducer from "./redux/currentUrlSlice";
import scrollTopReducer from "./redux/scrollTopSlice";

export default configureStore({
	reducer: {
		pokemonData: pokemonDataReducer,
		currentUrl: currentUrlReducer,
		scrollTop: scrollTopReducer,
	},
});
