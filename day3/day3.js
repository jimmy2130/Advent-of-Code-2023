const fs = require('fs');

function day3() {
	const input = fs.readFileSync('./day3.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input) {
	let sum = 0;
	for (let r = 0; r < input.length; r++) {
		let line = input[r];
		let pointer = 0;
		while (pointer < line.length) {
			if (isNaN(Number(line[pointer]))) {
				pointer += 1;
				continue;
			}
			let collectedString = '';
			let subPointer = pointer;
			while (subPointer < line.length) {
				if (!isNaN(Number(line[subPointer]))) {
					collectedString += line[subPointer];
					subPointer += 1;
				} else {
					break;
				}
			}
			if (isValidNum(r, pointer, subPointer - 1, input)) {
				sum += Number(collectedString);
			}
			pointer = subPointer;
		}
	}
	return sum;
}

function isValidNum(row, start, end, input) {
	if (row - 1 >= 0) {
		for (let i = start - 1; i <= end + 1; i++) {
			if (
				i >= 0 &&
				i < input[row - 1].length &&
				input[row - 1][i] !== '.' &&
				isNaN(Number(input[row - 1][i]))
			) {
				return true;
			}
		}
	}
	if (row + 1 < input.length) {
		for (let i = start - 1; i <= end + 1; i++) {
			if (
				i >= 0 &&
				i < input[row + 1].length &&
				input[row + 1][i] !== '.' &&
				isNaN(Number(input[row + 1][i]))
			) {
				return true;
			}
		}
	}
	if (
		start - 1 >= 0 &&
		input[row][start - 1] !== '.' &&
		isNaN(Number(input[row][start - 1]))
	) {
		return true;
	}
	if (
		end + 1 < input[0].length &&
		input[row][end + 1] !== '.' &&
		isNaN(Number(input[row][end + 1]))
	) {
		return true;
	}
	return false;
}

function part2(input) {
	let record = Array(input.length)
		.fill(null)
		.map(_ =>
			Array(input[0].length)
				.fill(null)
				.map(_ => []),
		);
	let sum = 0;

	for (let r = 0; r < input.length; r++) {
		let line = input[r];
		let pointer = 0;
		while (pointer < line.length) {
			if (isNaN(Number(line[pointer]))) {
				pointer += 1;
				continue;
			}
			let collectedString = '';
			let subPointer = pointer;
			while (subPointer < line.length) {
				if (!isNaN(Number(line[subPointer]))) {
					collectedString += line[subPointer];
					subPointer += 1;
				} else {
					break;
				}
			}
			let pos = getGearNum(r, pointer, subPointer - 1, input);
			if (pos !== null) {
				record[pos[0]][pos[1]].push(Number(collectedString));
			}
			pointer = subPointer;
		}
	}
	for (let r = 0; r < record.length; r++) {
		for (let c = 0; c < record[r].length; c++) {
			if (record[r][c].length === 2) {
				sum += record[r][c][0] * record[r][c][1];
			}
		}
	}
	return sum;
}

function getGearNum(row, start, end, input) {
	if (row - 1 >= 0) {
		for (let i = start - 1; i <= end + 1; i++) {
			if (i >= 0 && i < input[row - 1].length && input[row - 1][i] === '*') {
				return [row - 1, i];
			}
		}
	}
	if (row + 1 < input.length) {
		for (let i = start - 1; i <= end + 1; i++) {
			if (i >= 0 && i < input[row + 1].length && input[row + 1][i] === '*') {
				return [row + 1, i];
			}
		}
	}
	if (start - 1 >= 0 && input[row][start - 1] === '*') {
		return [row, start - 1];
	}
	if (end + 1 < input[0].length && input[row][end + 1] === '*') {
		return [row, end + 1];
	}
	return null;
}

day3();
