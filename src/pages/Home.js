import React, { useState, useEffect } from "react";
import { addPokemon } from "../redux/pokemonDataSlice";
import { changeUrl } from "../redux/currentUrlSlice";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { changeScroll } from "../redux/scrollTopSlice";
import { changeValue } from "../redux/valueSearchSlice";
import { changeLocationPathname } from "../redux/locationPathnameSlice";

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function ItemStyle({ number }) {
	if (number.toString().length === 1) {
		return (
			<Card.Subtitle className="mb-2 text-muted">#000{number}</Card.Subtitle>
		);
	} else if (number.toString().length === 2) {
		return (
			<Card.Subtitle className="mb-2 text-muted">#00{number}</Card.Subtitle>
		);
	} else if (number.toString().length === 3) {
		return (
			<Card.Subtitle className="mb-2 text-muted">#0{number}</Card.Subtitle>
		);
	} else {
		return <Card.Subtitle className="mb-2 text-muted">#{number}</Card.Subtitle>;
	}
}

function SearchComponent({ value, onChange, onClick }) {
	return (
		<Form>
			<Form.Group className="mb-3" controlId="formBasicPassword">
				<Form.Label>Search Pokemon</Form.Label>
				<Form.Control
					type="text"
					placeholder="Number or name"
					value={value}
					onChange={onChange}
				/>
			</Form.Group>
			<Button type="submit" onClick={onClick}>
				Search
			</Button>
		</Form>
	);
}

function Home() {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [error, setError] = useState(null);
	const [onClickBtn, setOnClickBtn] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	//const [valueSearch, setValueSearch] = useState("");
	const valueSearch = useSelector((state) => state.valueSearch.value);
	const pokemonData = useSelector((state) => state.pokemonData.pokemon);
	const currentUrl = useSelector((state) => state.currentUrl.valueCurrent);
	const nextUrl = useSelector((state) => state.currentUrl.valueNext);
	const valueScrollTop = useSelector((state) => state.scrollTop.value);
	const locationPathname = useSelector((state) => state.locationPathname.value);
	//console.log(valueSearch);
	function handleSearch(e) {
		console.log("search");
		e.preventDefault();
		dispatch(changeScroll(0));
		navigate(`/pokemon/${valueSearch}`);
	}
	function handleChange(e) {
		e.preventDefault();
		dispatch(changeLocationPathname(location.pathname));
		dispatch(changeValue(e.target.value));
	}
	function handleSubmit(e) {
		const scrollTop = document.documentElement.scrollTop;
		dispatch(changeScroll(scrollTop));
		navigate(`/pokemon/${e.currentTarget.id}`);
	}

	const fetchData = async (url) => {
		const scrollTop = document.documentElement.scrollTop;
		dispatch(changeScroll(scrollTop));
		try {
			const data = await fetch(url);
			const listData = await data.json();
			const requestAll = listData.results.map(async (result) => {
				let response = {};
				await fetch(result.url)
					.then((res) => res.json())
					.then((res) => (response = { ...res }));
				return response;
			});
			let detailData = [];
			await Promise.all(requestAll).then((responses) => {
				responses.map((response) => detailData.push(response));
			});
			setIsLoaded(true);
			dispatch(addPokemon(detailData));
			dispatch(changeUrl(listData.next));
			setOnClickBtn(false);
		} catch (error) {
			setError(error);
		}
	};

	let button;
	if (onClickBtn === false) {
		button = (
			<div className="text-center">
				<Button
					onClick={() => {
						setOnClickBtn(true);
						fetchData(nextUrl);
					}}
				>
					Load
				</Button>
			</div>
		);
	} else {
		button = (
			<div className="text-center">
				<Button variant="primary" disabled>
					<Spinner
						as="span"
						animation="grow"
						size="sm"
						role="status"
						aria-hidden="true"
					/>
					Loading...
				</Button>
			</div>
		);
	}
	useEffect(() => {
		console.log("useEffect");
		pokemonData.length === 0 ? fetchData(currentUrl) : setIsLoaded(true);
		locationPathname !== location.pathname &&
			window.scrollTo({
				top: valueScrollTop,
				behavior: "instant",
			});
	}, [fetchData]);

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
				<Container fluid="xl">
					<Row>
						<Col xs={6}>
							<SearchComponent
								value={valueSearch}
								onChange={handleChange}
								onClick={handleSearch}
							/>
						</Col>
					</Row>
					<Row>
						{pokemonData.map((data) => (
							<Col
								sm={6}
								md={4}
								lg={3}
								className="p-2 text-center"
								key={data.id}
							>
								<Card
									style={{ cursor: "pointer" }}
									onClick={handleSubmit}
									id={data.name}
								>
									<Card.Img
										className="mx-auto"
										style={{ width: "14rem", cursor: "pointer" }}
										variant="top"
										src={data.sprites.other["official-artwork"].front_default}
									/>
									<Card.Body>
										<Card.Title>
											<b>{capitalizeFirstLetter(data.name)}</b>
										</Card.Title>
										<ItemStyle number={data.id} />
										<Row>
											{data.types.map((type, id) => {
												if (data.types.length === 1) {
													return (
														<Col
															xs={{ span: 4, offset: 4 }}
															sm={{ span: 6, offset: 3 }}
															key={type.type.name}
															className={type.type.name + " pb-1 text-center"}
														>
															{type.type.name}
														</Col>
													);
												} else if (id === 0) {
													return (
														<Col
															xs={{ span: 3, offset: 3 }}
															sm={{ span: 5, offset: 1 }}
															md={{ span: 6, offset: 0 }}
															xl={{ span: 4, offset: 2 }}
															key={type.type.name}
															className={
																type.type.name +
																" pb-1 text-center align-self-center"
															}
														>
															{type.type.name}
														</Col>
													);
												} else {
													return (
														<Col
															xs={3}
															sm={5}
															md={6}
															xl={4}
															key={type.type.name}
															className={
																type.type.name +
																" pb-1 text-center align-self-center"
															}
														>
															{type.type.name}
														</Col>
													);
												}
											})}
										</Row>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
					{button}
				</Container>
			</div>
		);
	}
}
export default Home;
