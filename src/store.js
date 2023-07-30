import { configureStore } from "@reduxjs/toolkit";
import pokemonDataReducer from "./redux/pokemonDataSlice";
import currentUrlReducer from "./redux/currentUrlSlice";
import scrollTopReducer from "./redux/scrollTopSlice";
import valueSearchReducer from "./redux/valueSearchSlice";
import locationPathnameReducer from "./redux/locationPathnameSlice";

export default configureStore({
	reducer: {
		pokemonData: pokemonDataReducer,
		currentUrl: currentUrlReducer,
		scrollTop: scrollTopReducer,
		valueSearch: valueSearchReducer,
		locationPathname: locationPathnameReducer,
	},
});
