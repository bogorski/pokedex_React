import React, { useState, useEffect, useRef } from "react";
import { addPokemon } from "../redux/pokemonDataSlice";
import { changeUrl } from "../redux/currentUrlSlice";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { changeScroll } from "../redux/scrollTopSlice";
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
function Home() {
	const [error, setError] = useState(null);
	const [onClickBtn, setOnClickBtn] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();
	function handleSubmit(e) {
		const scrollTop = document.documentElement.scrollTop;
		dispatch(changeScroll(scrollTop));
		navigate(`/pokemon/${e.currentTarget.id}`);
	}
	const pokemonData = useSelector((state) => state.pokemonData.pokemon);
	const dispatch = useDispatch();
	const currentUrl = useSelector((state) => state.currentUrl.valueCurrent);
	const nextUrl = useSelector((state) => state.currentUrl.valueNext);
	const valueScrollTop = useSelector((state) => state.scrollTop.value);
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
			console.log(detailData, "data");
			dispatch(addPokemon(detailData));
			dispatch(changeUrl(listData.next));
			setOnClickBtn(false);
		} catch (error) {
			//	console.log("There was a SyntaxError", error);
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
		pokemonData.length === 0 ? fetchData(currentUrl) : setIsLoaded(true);

		window.scrollTo(0, valueScrollTop);

		console.log(valueScrollTop);
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
				<Container>
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
									id={data.id}
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
												console.log(data.types.length, "totoot");
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
