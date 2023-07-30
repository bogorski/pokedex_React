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
import EvolutionComponent from "../components/EvolutionComponent";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import { changeLocationPathname } from "../redux/locationPathnameSlice";
import { useDispatch } from "react-redux";

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function decimalPoint(number) {
	return number / 10;
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

function Pokemon() {
	const dispatch = useDispatch();
	const location = useLocation();
	const [error, setError] = useState(null);
	const [dataPokemon, setDataPokemon] = useState([]);
	const [dataEvolution, setDataEvolution] = useState([]);
	const [tabNameEvolution, setTabNameEvolution] = useState([]);
	const [arrayAbility, setArrayAbility] = useState([]);
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
			setArrayAbility([]);
			listData.abilities.map(async (obj) => {
				if (obj.is_hidden === false) {
					const dataAbilities = await fetch(obj.ability.url);
					const jsonAbilitie = await dataAbilities.json();
					setArrayAbility((oldArray) => [...oldArray, jsonAbilitie]);
				}
			});

			const dataSpecies = await fetch(listData.species.url);
			const jsonSpecies = await dataSpecies.json();
			const dataEvolution = await fetch(jsonSpecies.evolution_chain.url);
			const jsonEvolution = await dataEvolution.json();
			setDataEvolution(jsonEvolution.chain);
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
		if (
			name.target.id !== params.pokemonId &&
			name.target.alt !== params.pokemonId
		) {
			setIsLoaded(false);
			navigate(`/pokemon/${name.target.id}`);
		}
		window.scrollTo({
			top: 0,
			behavior: "instant",
		});
	}
	function AbilitiesComponent({ array }) {
		return (
			<>
				<Accordion defaultActiveKey="0">
					{array.map((el, i) => {
						return (
							<Accordion.Item key={i} eventKey={i}>
								<Accordion.Header>{el.name}</Accordion.Header>
								<Accordion.Body>
									{el.effect_entries.map((lang) => {
										return lang.language.name === "en" && lang.effect;
									})}
								</Accordion.Body>
							</Accordion.Item>
						);
					})}
				</Accordion>
			</>
		);
	}

	useEffect(() => {
		fetchData();
		dispatch(changeLocationPathname(location.pathname));
		window.scrollTo({
			top: 0,
			behavior: "instant",
		});
	}, [location.pathname]); // location.pathname - fix not re-renders when the current location is already a dynamic path (pokemon/:pokemonId)

	if (error) {
		return <div>Error: {error.message}</div>;
	} else if (!isLoaded) {
		return (
			<Container fluid="xl" className="backgroundLoader">
				<Spinner
					animation="border"
					role="status"
					style={{
						position: "fixed",
						left: "50%",
						top: "50%",
					}}
				></Spinner>
			</Container>
		);
	} else {
		return (
			<div>
				<Container fluid="xl">
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
							<h1>{capitalizeFirstLetter(dataPokemon.species.name)}</h1>
							<ItemStyle number={dataPokemon.id} />
						</Col>
					</Row>
					<Row className="align-items-start p-3">
						<Col className="text-center">
							<Image
								style={{ width: "20rem" }}
								src={
									dataPokemon.sprites.other["official-artwork"].front_default
								}
								alt={dataPokemon.name}
							/>
						</Col>
						<Col className="text-center">
							<Row>
								<Col
									xs={{ span: 10, offset: 1 }}
									className="border rounded-5 p-2"
								>
									<p className="h3 ">
										Height: {decimalPoint(dataPokemon.height)}m
									</p>
									<p className="h3 ">
										Weight: {decimalPoint(dataPokemon.weight)}kg
									</p>
									<p className="h3 ">Type</p>
									<Row>
										<Col xs={{ span: 8, offset: 2 }}>
											<p className="h4">
												{dataPokemon.types.map((type, i) => {
													return (
														<Badge
															bg=""
															key={i}
															className={`mx-2 ${type.type.name}`}
														>
															{type.type.name}
														</Badge>
													);
												})}
											</p>
										</Col>
									</Row>
								</Col>
								<Col
									xs={{ span: 10, offset: 1 }}
									lg={{ span: 6, offset: 3 }}
									className="py-5"
								>
									<AbilitiesComponent array={arrayAbility} />
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="align-items-center px-5  ">
						<p className="h1 text-center">Stats</p>
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
						<Col
							className="text-center"
							xs={{ span: 12 }}
							md={{ span: 4, offset: 1 }}
						>
							<ListGroup>
								{dataPokemon.stats.map((type, i) => {
									return (
										<ListGroupItem className={type.stat.name} key={i}>
											<p className="h5">
												{" "}
												{type.stat.name} {type.base_stat}
											</p>
										</ListGroupItem>
									);
								})}
							</ListGroup>
						</Col>
					</Row>
					<Row className="align-items-center px-5 py-5">
						<Col
							xs={12}
							xl={{ span: 10, offset: 1 }}
							className="text-center evolutions border rounded-5 "
						>
							<p className="h1 white">Evolutions</p>
							<EvolutionComponent
								dataPokemonEvolution={dataEvolution}
								dataPokemon={tabNameEvolution}
								onClick={handleDetail}
							/>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}
export default Pokemon;
