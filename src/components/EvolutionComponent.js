import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { Container } from "react-bootstrap";
function EvoCol({
	className,
	xs,
	lg,
	src,
	alt,
	onClick,
	maxWidthImage = "10em",
	id,
}) {
	return (
		<Col xs={xs} lg={lg} className={className}>
			<Image
				style={{
					maxWidth: maxWidthImage,
					width: "100%",
					cursor: "pointer",
				}}
				src={src}
				alt={alt}
				id={id}
				onClick={onClick}
			/>
		</Col>
	);
}
export default function EvolutionComponent({
	dataPokemonEvolution,
	dataPokemon,
	onClick,
}) {
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);

	useEffect(() => {
		const updateDimension = () => {
			setScreenWidth(window.innerWidth);
		};
		window.addEventListener("resize", updateDimension);

		return () => {
			window.removeEventListener("resize", updateDimension);
		};
	}, [screenWidth]);
	let evolutionArr = [[dataPokemonEvolution.species.name]];
	function isEvolve(evolves_to) {
		if (evolves_to.length > 0) {
			isEvolve(evolves_to[0].evolves_to);
		}
	}

	isEvolve(dataPokemonEvolution.evolves_to);
	if (dataPokemonEvolution.evolves_to.length > 0) {
		evolutionArr.push([]);
		dataPokemonEvolution.evolves_to.map((firstLvl, j) => {
			evolutionArr[1].push(firstLvl.species.name);
			if (j === 0 && firstLvl.evolves_to.length > 0) {
				evolutionArr.push([]);
			}
			if (firstLvl.evolves_to.length > 0) {
				return firstLvl.evolves_to.map((secondLvl) => {
					return evolutionArr[2].push(secondLvl.species.name);
				});
			}
			return 0;
		});
	}
	let classNextEvolution = "";
	if (screenWidth >= 992) {
		classNextEvolution = "next-evolution-horizontally";
	} else {
		classNextEvolution = "next-evolution-vertically";
	}
	evolutionArr.map((lvl) => {
		return lvl.map((el, i) => {
			return dataPokemon.map((sprite, j) => {
				if (sprite.species.name === el) {
					return lvl.splice(i, 1, {
						name: el,
						id: dataPokemon[j].id,
						sprite: sprite.sprites.other["official-artwork"].front_default,
					});
				}
				return 0;
			});
		});
	});

	return (
		<Container>
			<Row className="align-items-center p-2 blackBack">
				{evolutionArr.map((lvl, i) => {
					let col = 12 / evolutionArr.length;
					return lvl.length > 1 ? (
						<Col xs={12} lg={col} className="text-center" key={i}>
							<Row>
								{lvl.map((el) => {
									return lvl.length > 3 ? (
										<EvoCol
											key={el.name}
											className="text-center p-2"
											xs={6}
											lg={6}
											src={el.sprite}
											alt={el.name}
											onClick={onClick}
											maxWidthImage="8em"
											id={el.id}
										></EvoCol>
									) : lvl.length === 3 ? (
										<EvoCol
											key={el.name}
											className="text-center"
											xs={4}
											lg={10}
											src={el.sprite}
											alt={el.name}
											onClick={onClick}
											maxWidthImage="8em"
											id={el.id}
										></EvoCol>
									) : evolutionArr.length - 1 === i ? (
										<EvoCol
											key={el.name}
											className="text-center"
											xs={6}
											lg={12}
											src={el.sprite}
											alt={el.name}
											onClick={onClick}
											id={el.id}
										></EvoCol>
									) : (
										<EvoCol
											key={el.name}
											className={`text-center ${classNextEvolution}`}
											xs={6}
											lg={12}
											src={el.sprite}
											alt={el.name}
											onClick={onClick}
											id={el.id}
										></EvoCol>
									);
								})}
							</Row>
						</Col>
					) : evolutionArr.length - 1 === i ? (
						<EvoCol
							className="text-center"
							xs={12}
							lg={col}
							src={lvl[0].sprite}
							alt={lvl[0].name}
							onClick={onClick}
							key={lvl[0].name}
							id={lvl[0].id}
						></EvoCol>
					) : (
						<EvoCol
							className={`text-center ${classNextEvolution}`}
							xs={12}
							lg={col}
							src={lvl[0].sprite}
							alt={lvl[0].name}
							onClick={onClick}
							key={lvl[0].name}
							id={lvl[0].id}
						></EvoCol>
					);
				})}
			</Row>
		</Container>
	);
}
