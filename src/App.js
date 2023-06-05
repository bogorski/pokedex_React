import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Pokemon from "./pages/Pokemon";
import ErrorPage from "./pages/ErrorPage";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
			errorElement: <ErrorPage />,
		},
		{
			path: "pokemon/:pokemonId",
			element: <Pokemon />,
		},
	]);
	return <RouterProvider router={router} />;
}
export default App;
