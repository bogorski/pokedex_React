import { Outlet, Link } from "react-router-dom";
//import React, { useState, useEffect } from "react";
import { Counter } from "../Counter";
import { useSelector } from "react-redux";
function Layout(props) {
	//const [text, setText] = useState("");
	/*	function update(event) {
		event.preventDefault();
		setText(event.target.value);
		console.log(event.target.value);
	}*/
	/*function handleSubmit(event) {
		event.preventDefault();
		console.log(text);
	} */ //(event) => setText(event.target.value)
	const count = useSelector((state) => state.counter);
	const pokemonData = useSelector((state) => state.pokemonData);
	return (
		<>
			<nav>
				<ul>
					<li>
						<Link to="/home">Home</Link>
					</li>
					<li>
						<form onSubmit={props.onSubmit}>
							<input type="text" value={props.text} onChange={props.onChange} />
							<button type="submit">Submit</button>
						</form>

						<Link to={`/pokemon/${props.text}`}>Pokemon</Link>
					</li>
				</ul>
			</nav>
			<div>
				<Counter />
			</div>
			<div>
				<h1>{count.value}</h1>
				<ul>
					{pokemonData.pokemon.map((data, id) => (
						<li key={id}>
							{data.name} {id}
						</li>
					))}
				</ul>
			</div>
			<Outlet />
		</>
	);
}

export default Layout;
