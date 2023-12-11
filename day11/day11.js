const fs = require('fs');

function day11() {
	const input = fs.readFileSync('./day11.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input) {
	const originalMap = [...input].map(row => row.split(''));
	let expandedMap = [];
	for (let i = 0; i < originalMap.length; i++) {
		const row = originalMap[i];
		if (row.every(cell => cell === '.')) {
			expandedMap.push(row);
			expandedMap.push(row);
		} else {
			expandedMap.push(row);
		}
	}
	let pointer = 0;
	while (pointer < expandedMap[0].length) {
		const col = expandedMap.reduce((acc, cur) => [...acc, cur[pointer]], []);
		if (col.every(cell => cell === '.')) {
			expandedMap = expandedMap.map(row => [
				...row.slice(0, pointer),
				'.',
				...row.slice(pointer),
			]);
			pointer += 2;
		} else {
			pointer += 1;
		}
	}
	const positions = getPositions(expandedMap);
	let sum = 0;
	for (let i = 0; i < positions.length; i++) {
		for (let j = i + 1; j < positions.length; j++) {
			const [r1, c1] = positions[i];
			const [r2, c2] = positions[j];
			const distance = Math.abs(r1 - r2) + Math.abs(c1 - c2);
			sum += distance;
		}
	}
	return sum;
}

function getPositions(expandedMap) {
	const positions = [];
	for (let r = 0; r < expandedMap.length; r++) {
		for (let c = 0; c < expandedMap[r].length; c++) {
			if (expandedMap[r][c] === '#') {
				positions.push([r, c]);
			}
		}
	}
	return positions;
}

function part2(input) {
	const EXPANDED = 100_0000;
	const originalMap = [...input].map(row => row.split(''));
	const rowRuler = [];
	const colRuler = [];
	for (let i = 0; i < originalMap.length; i++) {
		const row = originalMap[i];
		if (row.every(cell => cell === '.')) {
			rowRuler.push(EXPANDED);
		} else {
			rowRuler.push(1);
		}
	}

	for (let i = 0; i < originalMap.length; i++) {
		const col = originalMap.reduce((acc, cur) => [...acc, cur[i]], []);
		if (col.every(cell => cell === '.')) {
			colRuler.push(EXPANDED);
		} else {
			colRuler.push(1);
		}
	}

	const positions = getPositions(originalMap);
	let sum = 0;
	for (let i = 0; i < positions.length; i++) {
		for (let j = i + 1; j < positions.length; j++) {
			let [r1, c1] = positions[i];
			let [r2, c2] = positions[j];
			if (r1 > r2) {
				[r1, r2] = [r2, r1];
			}
			if (c1 > c2) {
				[c1, c2] = [c2, c1];
			}
			const distance =
				getSum(rowRuler.slice(r1, r2)) + getSum(colRuler.slice(c1, c2));
			sum += distance;
		}
	}
	return sum;
}

function getSum(arr) {
	return arr.reduce((acc, cur) => acc + cur, 0);
}

day11();
