export default function radarStats(hp, at, de, sa, sd, sp) {
	const canvas = document.createElement("CANVAS");
	const divCanvas = document.querySelector(".canvas");
	divCanvas.appendChild(canvas);
	const ctx = canvas.getContext("2d");
	let canvasWidth = 250;

	canvas.width = canvasWidth;
	canvas.height = canvasWidth;
	const r = canvasWidth / 2;
	const sqrt3 = Math.sqrt(3);
	const maxStat = Math.max(hp, at, de, sa, sd, sp);
	let scale = canvasWidth / maxStat / 3;

	// statystyki pokemona
	ctx.beginPath();
	ctx.font = "bold 15px Arial";
	ctx.setLineDash([0, 0]);
	ctx.strokeStyle = "#9DB7F5";
	ctx.fillStyle = "#465373";
	ctx.lineWidth = 2;
	ctx.moveTo(r, r - hp * scale);
	ctx.lineTo(r + (at * scale * sqrt3) / 2, r - (at * scale) / 2);
	ctx.lineTo(r + (de * scale * sqrt3) / 2, r + (de * scale) / 2);
	ctx.lineTo(r, r + sa * scale);
	ctx.lineTo(r - (sd * scale * sqrt3) / 2, r + (sd * scale) / 2);
	ctx.lineTo(r - (sp * scale * sqrt3) / 2, r - (sp * scale) / 2);
	ctx.lineTo(r, r - hp * scale);
	ctx.fillStyle = "rgba(157, 183, 245, 0.9)";
	ctx.fill();
	ctx.stroke();

	//osie wykresu
	ctx.beginPath();
	ctx.font = "bold 12px Arial";
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1.5;
	ctx.setLineDash([0, 0]);
	ctx.moveTo(r, r);
	ctx.lineTo(r, 0);
	ctx.fillText("HP", r - 20, 10);
	ctx.moveTo(r, r);
	ctx.lineTo(r, 2 * r);
	ctx.fillText("Sp. Atk", r + 5, 2 * r - 5);
	ctx.moveTo(r, r);
	ctx.lineTo(r + (r * sqrt3) / 2, r / 2);
	ctx.fillText("Atack", r + (r * sqrt3) / 2 - 15, r / 2 + 20);
	ctx.moveTo(r, r);
	ctx.lineTo(r + (r * sqrt3) / 2, r + r / 2);
	ctx.fillText("Defense", r + (r * sqrt3) / 2 - 30, r + r / 2 + 15);
	ctx.moveTo(r, r);
	ctx.lineTo(r - (r * sqrt3) / 2, r - r / 2);
	ctx.fillText("Speed", r - (r * sqrt3) / 2 + 5, r - r / 2);
	ctx.moveTo(r, r);
	ctx.lineTo(r - (r * sqrt3) / 2, r + r / 2);
	ctx.fillText("Sp. Def", r - (r * sqrt3) / 2, r + r / 2 + 10);
	ctx.stroke();

	//skala
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillStyle = "black";
	ctx.lineWidth = 1;
	ctx.setLineDash([7, 7]);
	let iScale = null;

	if (maxStat > 249) {
		iScale = 100;
	} else if (maxStat > 124) {
		iScale = 50;
	} else if (maxStat > 52) {
		iScale = 25;
	} else {
		iScale = 10;
	}

	for (let i = 0; i < maxStat + iScale + 1; i = i + iScale) {
		//console.log(r/scale)
		//	console.log(i+iScale)
		ctx.moveTo(r, r - i * scale);
		ctx.lineTo(r + ((i * sqrt3) / 2) * scale, r - (i / 2) * scale);
		ctx.fillText(i, r + 2, r - i * scale - 5);
		ctx.lineTo(r + ((i * sqrt3) / 2) * scale, r + (i / 2) * scale);
		ctx.lineTo(r, r + i * scale);
		ctx.lineTo(r - ((i * sqrt3) / 2) * scale, r + (i / 2) * scale);
		ctx.lineTo(r - ((i * sqrt3) / 2) * scale, r - (i / 2) * scale);
		ctx.lineTo(r, r - i * scale);
	}

	ctx.stroke();
}
