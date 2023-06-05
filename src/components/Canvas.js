import React, { useRef, useEffect, useState } from "react";

export default function RadarStats({ hp, at, de, sa, sd, sp }) {
	const canvasRef = useRef(null);
	const [canvasWidth, setCanvasWidth] = useState(320);
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		//let canvasWidth;
		const handleResize = (e) => {
			window.innerWidth < 400
				? setCanvasWidth(window.innerWidth / 1.4)
				: setCanvasWidth(320);
			console.log("resized to: ", window.innerWidth, "x", window.innerHeight);
		};
		handleResize();
		window.addEventListener("resize", handleResize);

		console.log(canvasWidth);
		canvas.width = canvasWidth;
		canvas.height = canvasWidth;
		ctx.fillStyle = "white"; //"#b0a8b9";
		ctx.fillRect(0, 0, canvasWidth, canvasWidth);
		const r = canvasWidth / 2;
		const maxStat = Math.max(hp, at, de, sa, sd, sp);
		let iScale = 0;
		if (maxStat > 249) {
			iScale = 100;
		} else if (maxStat > 124) {
			iScale = 50;
		} else if (maxStat > 52) {
			iScale = 25;
		} else {
			iScale = 10;
		}

		let scale = (r - 30) / (Math.ceil(maxStat / iScale) * iScale);
		console.log(scale, "scale");

		// statystyki pokemona
		ctx.beginPath();
		//ctx.font = "bold 15px Arial";
		ctx.strokeStyle = "#845ec2";
		ctx.fillStyle = "#845ec2";
		ctx.moveTo(r, r);
		ctx.arc(r, r, hp * scale, 1.5 * Math.PI, -Math.PI / 6);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "#d65db1";
		ctx.fillStyle = "#d65db1";
		ctx.moveTo(r, r);
		ctx.arc(r, r, at * scale, -Math.PI / 6, Math.PI / 6);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "#ff6f91";
		ctx.fillStyle = "#ff6f91";
		ctx.moveTo(r, r);
		ctx.arc(r, r, de * scale, Math.PI / 6, Math.PI / 2);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "#ff9671";
		ctx.fillStyle = "#ff9671";
		ctx.moveTo(r, r);
		ctx.arc(r, r, sa * scale, Math.PI / 2, Math.PI - Math.PI / 6);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "#ffc75f";
		ctx.fillStyle = "#ffc75f";
		ctx.moveTo(r, r);
		ctx.arc(r, r, sd * scale, Math.PI - Math.PI / 6, Math.PI + Math.PI / 6);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "#f9f871";
		ctx.fillStyle = "#f9f871";
		ctx.moveTo(r, r);
		ctx.arc(r, r, sp * scale, Math.PI + Math.PI / 6, 1.5 * Math.PI);
		ctx.fill();
		ctx.stroke();

		//osie wykresu
		const circleRadius = Math.ceil(maxStat / iScale) * iScale * scale;
		ctx.beginPath();
		ctx.font = "bold 12px Arial";
		//ctx.fillStyle = "red";
		ctx.strokeStyle = "#b0a8b9"; //"#fef7ff";
		ctx.lineWidth = 1.5;
		ctx.moveTo(r, r);
		ctx.arc(r, r, circleRadius, 1.5 * Math.PI, 1.5 * Math.PI);
		//ctx.fillText("HP", r, r - circleRadius - 5);
		ctx.moveTo(r, r);
		ctx.arc(r, r, circleRadius, Math.PI / 2, Math.PI / 2);
		//ctx.fillText("Sp. Atk", r, r + circleRadius + 15);
		ctx.moveTo(r, r);
		ctx.arc(r, r, circleRadius, -Math.PI / 6, -Math.PI / 6);
		//ctx.fillText("Atack", r + circleRadius + 5, r);
		ctx.moveTo(r, r);
		ctx.arc(r, r, circleRadius, Math.PI / 6, Math.PI / 6);
		//ctx.fillText("Defense", r + (r * sqrt3) / 2 - 30, r + r / 2 + 15);
		ctx.moveTo(r, r);
		ctx.arc(r, r, circleRadius, Math.PI + Math.PI / 6, Math.PI + Math.PI / 6);
		//ctx.fillText("Speed", r - (r * sqrt3) / 2, r - r / 2);
		ctx.moveTo(r, r);
		ctx.arc(r, r, circleRadius, Math.PI - Math.PI / 6, Math.PI - Math.PI / 6);
		/*ctx.fillText(
			"Sp. Def",
			r - circleRadius - ctx.measureText("Sp. Def").width - 5,
			r
		);*/
		ctx.fill();
		ctx.stroke();

		//skala
		ctx.beginPath();
		ctx.fillStyle = "#b0a8b9"; //"#fef7ff";
		ctx.lineWidth = 2;

		for (let i = 0; i < maxStat + iScale; i = i + iScale) {
			if (i !== 0) {
				ctx.moveTo(r, r);
				ctx.beginPath();
				ctx.strokeStyle = "#b0a8b9"; //"#fef7ff";
				ctx.strokeStyle = "#b0a8b9"; //"#fef7ff";
				ctx.arc(r, r, i * scale, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.moveTo(r, r - i * scale);
				ctx.fillText(i, r + 2, r - i * scale - 5);
			} else {
				ctx.moveTo(r, r - i * scale);
				ctx.fillText(i, r + 2, r + i * scale - 15);
			}
		}
	}, [canvasWidth]);

	return <canvas ref={canvasRef} />;
}
