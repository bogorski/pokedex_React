import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/esm/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import RadarStats from "../components/Canvas";
import "./Pokemon.css";

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function ItemStyle({ number }) {
	if (number.toString().length === 1) {
		return <h3 className="mb-2 text-muted">#000{number}</h3>;
	} else if (number.toString().length === 2) {
		return <h3 className="mb-2 text-muted">#00{number}</h3>;
	} else if (number.toString().length === 3) {
		return <h3 className="mb-2 text-muted">#0{number}</h3>;
	} else {
		return <h3 className="mb-2 text-muted">#{number}</h3>;
	}
}

function EvoCol({ className, xs, md, style, src, alt, onClick }) {
	return (
		<Col className={className} xs={xs} md={md}>
			{
				<Image
					roundedCircle
					style={{
						maxWidth: "10em",
						width: "60%",
						backgroundColor: "#b0a8b9",
						cursor: "pointer",
					}}
					src={src}
					alt={alt}
					onClick={onClick}
				/>
			}
		</Col>
	);
}
function evolves(data, dataSprite, onClick) {
	const evoTab = []; // tablica rozgalezienia ewolucji 0 - brak, 1- jeden rodzaj ewolucji...

	function evolvesTo(dataEvolves, tab) {
		tab.push(dataEvolves.evolves_to.length);
		if (dataEvolves.evolves_to) {
			dataEvolves.evolves_to.map((evo) => {
				return evolvesTo(evo, tab);
			});
		}
	}

	function evolve(data, tablica) {
		if (data.evolves_to.length === 0) {
			tablica.push({
				evolve: false,
				name: data.species.name,
				sprite: dataSprite[0].sprites.other["official-artwork"].front_default,
			});
		} else {
			tablica.push({
				evolve: true,
				name: data.species.name,
				sprite: dataSprite[0].sprites.other["official-artwork"].front_default,
			});
			data.evolves_to.map((el, i) => {
				if (el.evolves_to.length === 0) {
					return tablica.push({
						evolve: false,
						name: el.species.name,
						sprite:
							dataSprite[i].sprites.other["official-artwork"].front_default,
					});
				} else {
					return evolve(el, tablica);
				}
			});
		}
	}
	const tablica = [];
	evolve(data.chain, tablica);
	evolvesTo(data.chain, evoTab);
	let maxLevelEvolution = 1; // mogą być max 3 poziomy ewolucji
	evoTab.map((el) => {
		if (el > 0 && maxLevelEvolution < 3) {
			return maxLevelEvolution++;
		}
		return 0;
	});
	if (maxLevelEvolution === 1) {
		return (
			<Row>
				<EvoCol
					className="text-center p-2"
					xs={12}
					src={dataSprite[0].sprites.other["official-artwork"].front_default}
					alt={data.chain.species.name}
					onClick={onClick}
				/>
			</Row>
		);
	} else if (maxLevelEvolution === 2) {
		if (dataSprite.length <= 3) {
			return (
				<Row className="align-items-center">
					<EvoCol
						className="text-center p-2"
						xs={12}
						md={6}
						src={dataSprite[0].sprites.other["official-artwork"].front_default}
						alt={data.chain.species.name}
						onClick={onClick}
					/>
					{dataSprite.length === 2 ? (
						<EvoCol
							className="text-center p-2"
							xs={12}
							md={6}
							src={
								dataSprite[1].sprites.other["official-artwork"].front_default
							}
							alt={data.chain.evolves_to[0].species.name}
							onClick={onClick}
						/>
					) : (
						<Col className="text-center p-2" xs={12} md={6}>
							<Row>
								{dataSprite.map((el, i) => {
									if (i > 0) {
										return (
											<EvoCol
												key={i}
												className="text-center p-2"
												xs={6}
												md={12}
												src={el.sprites.other["official-artwork"].front_default}
												alt={el.species.name}
												onClick={onClick}
											/>
										);
									}
									return 0;
								})}
							</Row>
						</Col>
					)}
				</Row>
			);
		} else {
			return (
				<Row className="align-items-center">
					<EvoCol
						className="text-center p-2"
						xs={12}
						md={4}
						src={dataSprite[0].sprites.other["official-artwork"].front_default}
						alt={data.chain.species.name}
						onClick={onClick}
					/>
					<Col className="text-center p-2" xs={12} md={8}>
						{dataSprite.length % 2 === 0 ? (
							<Row className="align-items-center">
								{dataSprite.map((el, i) => {
									if (i > 0 && i !== dataSprite.length - 1) {
										return (
											<EvoCol
												key={i}
												className="text-center p-2"
												xs={6}
												md={6}
												src={el.sprites.other["official-artwork"].front_default}
												alt={el.species.name}
												onClick={onClick}
											/>
										);
									}
									if (i === dataSprite.length - 1) {
										return (
											<EvoCol
												key={i}
												className="text-center p-2"
												xs={{ span: 6, offset: 3 }}
												src={el.sprites.other["official-artwork"].front_default}
												alt={el.species.name}
												onClick={onClick}
											/>
										);
									}
									return 0;
								})}
							</Row>
						) : (
							<Row>
								{dataSprite.map((el, i) => {
									if (i > 0) {
										return (
											<EvoCol
												key={i}
												className="text-center p-2"
												xs={6}
												src={el.sprites.other["official-artwork"].front_default}
												alt={el.species.name}
												onClick={onClick}
											/>
										);
									}
									return 0;
								})}
							</Row>
						)}
					</Col>
				</Row>
			);
		}
	} else {
		if (dataSprite.length === 3) {
			return (
				<Row>
					{dataSprite.map((el, i) => {
						return (
							<EvoCol
								key={i}
								className="text-center p-2"
								xs={12}
								md={4}
								src={el.sprites.other["official-artwork"].front_default}
								alt={el.species.name}
								onClick={onClick}
							/>
						);
					})}
				</Row>
			);
		} else {
			return (
				<Row className="align-items-center">
					<EvoCol
						className="text-center p-2"
						xs={12}
						md={4}
						src={dataSprite[0].sprites.other["official-artwork"].front_default}
						alt={data.chain.species.name}
						onClick={onClick}
					/>
					<Col className="text-center p-2 " xs={12} md={8}>
						{data.chain.evolves_to.length === 1 ? (
							<Row className="align-items-center">
								<EvoCol
									className="text-center p-2"
									xs={12}
									md={6}
									src={
										dataSprite[1].sprites.other["official-artwork"]
											.front_default
									}
									alt={data.chain.evolves_to[0].species.name}
									onClick={onClick}
								/>
								<Col className="text-center p-2" xs={12} md={6}>
									<Row>
										{dataSprite.map((el, i) => {
											if (i > 1) {
												return (
													<EvoCol
														key={i}
														className="text-center p-2"
														xs={6}
														md={12}
														src={
															el.sprites.other["official-artwork"].front_default
														}
														alt={el.species.name}
														onClick={onClick}
													/>
												);
											}
											return 0;
										})}
									</Row>
								</Col>
							</Row>
						) : (
							<Row className="align-items-center">
								{dataSprite.map((el, i) => {
									if (i > 0 && evoTab[i] > 0) {
										return (
											<Col xs={6} md={12} key={i}>
												<Row>
													<EvoCol
														className="text-center p-2"
														xs={12}
														md={6}
														src={
															el.sprites.other["official-artwork"].front_default
														}
														alt={el.species.name}
														onClick={onClick}
													/>
													<EvoCol
														className="text-center p-2"
														xs={12}
														md={6}
														src={
															dataSprite[i + 1].sprites.other[
																"official-artwork"
															].front_default
														}
														alt={dataSprite[i + 1].species.name}
														onClick={onClick}
													/>
												</Row>
											</Col>
										);
									}
									return 0;
								})}
							</Row>
						)}
					</Col>
				</Row>
			);
		}
	}
}
function Pokemon() {
	const location = useLocation();
	const [error, setError] = useState(null);
	const [dataPokemon, setDataPokemon] = useState([]);
	const [dataEvolution, setDataEvolution] = useState([]);
	const [tabNameEvolution, setTabNameEvolution] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const params = useParams();
	const url = `https://pokeapi.co/api/v2/pokemon/${params.pokemonId}`;
	const navigate = useNavigate();
	const fetchData = async () => {
		try {
			setIsLoaded(false);
			const data = await fetch(url);
			const listData = await data.json();
			setDataPokemon(listData);
			const dataSpecies = await fetch(listData.species.url);
			const jsonSpecies = await dataSpecies.json();
			const dataEvolution = await fetch(jsonSpecies.evolution_chain.url);
			const jsonEvolution = await dataEvolution.json();
			setDataEvolution(jsonEvolution);
			const tabName = [];
			function searchPokemonName(data) {
				let newUrl = data.species.url.replace("-species", "");
				tabName.push(newUrl);
				data.evolves_to.map((e) => {
					if (e.evolves_to) {
						return searchPokemonName(e);
					}
					return 0;
				});
			}
			searchPokemonName(jsonEvolution.chain);
			await Promise.all(tabName.map((u) => fetch(u)))
				.then(async (responses) =>
					Promise.all(responses.map(async (res) => res.json()))
				)
				.then(async (json) => {
					setTabNameEvolution(json);
				});
			setIsLoaded(true);
		} catch (error) {
			setError(error);
		}
	};
	function handleNext() {
		setIsLoaded(false);
		dataPokemon.id < 1010
			? navigate(`/pokemon/${dataPokemon.id + 1}`)
			: navigate(`/pokemon/1`);
	}
	function handlePrevious() {
		setIsLoaded(false);
		dataPokemon.id > 1
			? navigate(`/pokemon/${dataPokemon.id - 1}`)
			: navigate(`/pokemon/1010`);
	}
	function handleList() {
		navigate(`/`);
	}
	function handleDetail(name) {
		if (name.target.alt !== params.pokemonId) {
			setIsLoaded(false);
			navigate(`/pokemon/${name.target.alt}`);
		}

		window.scrollTo(0, 0);
	}

	useEffect(() => {
		fetchData();
	}, [location.pathname]); // location.pathname - fix not re-renders when the current location is already a dynamic path (pokemon/:pokemonId)

	if (error) {
		return <div>Error: {error.message}</div>;
	} else if (!isLoaded) {
		return (
			<Spinner
				animation="border"
				role="status"
				style={{
					position: "fixed",
					left: "50%",
					top: "50%",
				}}
			>
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		);
	} else {
		return (
			<div>
				<Container>
					<Nav className="justify-content-center">
						<Nav.Item onClick={handlePrevious}>
							<Nav.Link>Previous</Nav.Link>
						</Nav.Item>
						<Nav.Item onClick={handleList}>
							<Nav.Link>Pokemon List</Nav.Link>
						</Nav.Item>

						<Nav.Item onClick={handleNext}>
							<Nav.Link>Next</Nav.Link>
						</Nav.Item>
					</Nav>
					<Row>
						<Col className="text-center">
							<h1>{capitalizeFirstLetter(dataPokemon.name)}</h1>
							<ItemStyle number={dataPokemon.id} />
						</Col>
					</Row>
					<Row className="align-items-center p-3">
						<Col className="text-center">
							<Image
								style={{ width: "20rem" }}
								src={
									dataPokemon.sprites.other["official-artwork"].front_default
								}
								alt={dataPokemon.name}
							/>
						</Col>
					</Row>
					<Row className="align-items-center p-5">
						<Col className="text-center" xs={12} md={6}>
							<RadarStats
								hp={dataPokemon.stats[0].base_stat}
								at={dataPokemon.stats[1].base_stat}
								de={dataPokemon.stats[2].base_stat}
								sa={dataPokemon.stats[3].base_stat}
								sd={dataPokemon.stats[4].base_stat}
								sp={dataPokemon.stats[5].base_stat}
							/>
						</Col>
						<Col className="text-center " xs={12} md={6}>
							<ListGroup>
								{dataPokemon.stats.map((type, i) => {
									return (
										<ListGroupItem className={type.stat.name} key={i}>
											{type.stat.name} {type.base_stat}
										</ListGroupItem>
									);
								})}
							</ListGroup>
						</Col>
					</Row>
					{/*<h1>HEIGHT {decimalPoint(dataPokemon.height)}m</h1>
					<h1>WEIGHT {decimalPoint(dataPokemon.weight)}kg</h1>
					{dataPokemon.types.map((type, i) => {
						return <h1 key={i}>TYPE: {type.type.name}</h1>;
					})}
					{dataPokemon.abilities.map((type, i) => {
						return <h1 key={i}>ABILITY {type.ability.name}</h1>;
					})}
					<img
						src={dataPokemon.sprites.other["official-artwork"].front_default}
						alt={dataPokemon.name}
				/>*/}
					<Row className="align-items-center p-1">
						<Col xs={12} className="text-center pt-3 pb-2">
							<h1>Ewolucje</h1>
						</Col>
						<Col xs={12}>
							{evolves(dataEvolution, tabNameEvolution, handleDetail)}
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}
export default Pokemon;
