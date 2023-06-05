import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import pokemonDataReducer from "./redux/pokemonDataSlice";
import currentUrlReducer from "./redux/currentUrlSlice";
import scrollTopReducer from "./redux/scrollTopSlice";

export default configureStore({
	reducer: {
		counter: counterReducer,
		pokemonData: pokemonDataReducer,
		currentUrl: currentUrlReducer,
		scrollTop: scrollTopReducer,
	},
});
