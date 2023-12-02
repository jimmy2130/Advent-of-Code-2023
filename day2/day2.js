const fs = require('fs');

function day2() {
	const input = fs
		.readFileSync('./day2.txt')
		.toString()
		.split('\n')
		.map(line => line.split(/Game |: |, |; /).slice(1));
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(games) {
	let sum = 0;
	for (let i = 0; i < games.length; i++) {
		const game = games[i];
		let isValid = true;
		for (let j = 0; j < game.length; j++) {
			let [number, color] = game[j].split(' ');
			number = Number(number);
			if (
				(color === 'red' && number > 12) ||
				(color === 'green' && number > 13) ||
				(color === 'blue' && number > 14)
			) {
				isValid = false;
				break;
			}
		}
		if (isValid) {
			sum += i + 1;
		}
	}
	return sum;
}

function part2(games) {
	let sum = 0;
	for (let i = 0; i < games.length; i++) {
		const game = games[i];
		let red = 0;
		let green = 0;
		let blue = 0;
		for (let j = 0; j < game.length; j++) {
			let [number, color] = game[j].split(' ');
			number = Number(number);
			if (color === 'red') {
				red = Math.max(number, red);
			} else if (color === 'green') {
				green = Math.max(number, green);
			} else if (color === 'blue') {
				blue = Math.max(number, blue);
			}
		}
		sum += red * green * blue;
	}
	return sum;
}

day2();
