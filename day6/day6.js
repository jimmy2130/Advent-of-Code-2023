const fs = require('fs');

function day6() {
	const input = fs.readFileSync('./day6.txt').toString().split('\n');
	const data = input.map(line =>
		line
			.split(':')
			.slice(1)
			.join('')
			.split('   ')
			.filter(element => element !== '')
			.map(x => Number(x)),
	);
	console.log('part 1');
	console.log(part1(data));
	console.log('part 2');
	console.log(part2(data));
}

function part1(data) {
	const races = [];
	for (let i = 0; i < data[0].length; i++) {
		races.push([data[0][i], data[1][i]]);
	}
	let product = 1;
	for (let i = 0; i < races.length; i++) {
		const [totalTime, totalDistance] = races[i];
		let winningWays = 0;
		for (let pressTime = 0; pressTime <= totalTime; pressTime++) {
			const remainingTime = totalTime - pressTime;
			const speed = pressTime;
			if (remainingTime * speed > totalDistance) {
				winningWays += 1;
			}
		}
		product *= winningWays;
	}
	return product;
}

function part2(data) {
	const totalTime = Number(
		data[0].reduce((acc, cur) => acc + cur.toString(), ''),
	);
	const totalDistance = Number(
		data[1].reduce((acc, cur) => acc + cur.toString(), ''),
	);
	let lowerBound = -1;
	let upperBound = -1;

	for (let pressTime = 0; pressTime < totalTime; pressTime++) {
		const remainingTime = totalTime - pressTime;
		const speed = pressTime;
		if (remainingTime * speed > totalDistance) {
			lowerBound = pressTime;
			break;
		}
	}

	for (let pressTime = totalTime; pressTime >= 0; pressTime--) {
		const remainingTime = totalTime - pressTime;
		const speed = pressTime;
		if (remainingTime * speed > totalDistance) {
			upperBound = pressTime;
			break;
		}
	}

	return upperBound - lowerBound + 1;
}

day6();
