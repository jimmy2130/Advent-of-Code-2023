const fs = require('fs');

function day4() {
	const input = fs.readFileSync('./day4.txt').toString().split('\n');
	const cards = input.map(line => {
		return line
			.split(/: | \| /)
			.slice(1)
			.map(numbers =>
				numbers
					.split(' ')
					.filter(element => element !== '')
					.map(string => Number(string)),
			);
	});
	console.log('part 1');
	console.log(part1(cards));
	console.log('part 2');
	console.log(part2(cards));
}

function part1(cards) {
	let sum = 0;
	for (let i = 0; i < cards.length; i++) {
		const [winningNumbers, myNumbers] = cards[i];
		let match = 0;
		for (let j = 0; j < myNumbers.length; j++) {
			if (winningNumbers.includes(myNumbers[j])) {
				match += 1;
			}
		}
		if (match !== 0) {
			sum += 2 ** (match - 1);
		}
	}
	return sum;
}

function part2(cards) {
	const copiesOfCards = cards.map(card => 1);
	for (let i = 0; i < cards.length; i++) {
		const [winningNumbers, myNumbers] = cards[i];
		let match = 0;
		for (let j = 0; j < myNumbers.length; j++) {
			if (winningNumbers.includes(myNumbers[j])) {
				match += 1;
			}
		}
		for (let j = i + 1; j < i + 1 + match; j++) {
			copiesOfCards[j] += copiesOfCards[i];
		}
	}
	return copiesOfCards.reduce((acc, cur) => acc + cur, 0);
}

day4();
