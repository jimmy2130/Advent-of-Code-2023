const fs = require('fs');

function day1() {
	const input = fs.readFileSync('./day1.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input) {
	let sum = 0;
	for (let i = 0; i < input.length; i++) {
		let numbers = [];
		for (let j = 0; j < input[i].length; j++) {
			if (!isNaN(Number(input[i][j]))) {
				numbers.push(Number(input[i][j]));
			}
		}
		sum += numbers[0] * 10 + numbers.at(-1);
	}
	return sum;
}

function part2(input) {
	let sum = 0;
	const THREE_LETTER_WORDS = ['one', 'two', 'six'];
	const FOUR_LETTER_WORDS = ['four', 'five', 'nine'];
	const FIVE_LETTER_WORDS = ['three', 'seven', 'eight'];
	const TABLE = {
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
	};
	for (let i = 0; i < input.length; i++) {
		let numbers = [];
		for (let j = 0; j < input[i].length; j++) {
			const threeLetterWords = input[i].slice(j, j + 3);
			const fourLetterWords = input[i].slice(j, j + 4);
			const fiveLetterWords = input[i].slice(j, j + 5);
			if (!isNaN(Number(input[i][j]))) {
				numbers.push(Number(input[i][j]));
			} else if (THREE_LETTER_WORDS.includes(threeLetterWords)) {
				numbers.push(TABLE[threeLetterWords]);
			} else if (FOUR_LETTER_WORDS.includes(fourLetterWords)) {
				numbers.push(TABLE[fourLetterWords]);
			} else if (FIVE_LETTER_WORDS.includes(fiveLetterWords)) {
				numbers.push(TABLE[fiveLetterWords]);
			}
		}
		sum += numbers[0] * 10 + numbers.at(-1);
	}
	return sum;
}

day1();
