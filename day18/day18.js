const fs = require('fs');

function day18() {
	const input = fs.readFileSync('./day18.txt').toString().split('\n');
	const DIR = {
		0: 'R',
		1: 'D',
		2: 'L',
		3: 'U',
	};
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
	console.log('part 1 Retry');
	console.log(
		formula(
			input.map(line => {
				let [dir, steps] = line.split(' ');
				steps = Number(steps);
				return { dir, steps };
			}),
		),
	);
	console.log('part 2 Retry');
	console.log(
		formula(
			input.map(line => {
				const hexCode = line.split(/ \(#|\)/)[1];
				const steps = parseInt(hexCode.slice(0, 5), 16);
				const dir = DIR[hexCode[5]];
				return { steps, dir };
			}),
		),
	);
}

function formula(input) {
	const points = [[0, 0]];
	let [pointerX, pointerY] = [0, 0];
	let b = 0;

	for (let i = 0; i < input.length; i++) {
		const { dir, steps } = input[i];
		if (dir === 'R') {
			pointerX += steps;
		} else if (dir === 'L') {
			pointerX -= steps;
		} else if (dir === 'U') {
			pointerY += steps;
		} else if (dir === 'D') {
			pointerY -= steps;
		}
		b += steps;
		points.push([pointerX, pointerY]);
	}

	let A = 0;
	for (let i = 0; i < points.length - 1; i++) {
		const [y1, x1] = points[i];
		const [y2, x2] = points[i + 1];
		A += x1 * y2;
		A -= y1 * x2;
	}
	A /= 2;
	return A + 1 + b / 2;
}

function drawMap(input, size) {
	const map = Array(size)
		.fill(null)
		.map(row => Array(size).fill('.'));
	map[size / 2][size / 2] = '#';
	let [pointerR, pointerC] = [size / 2, size / 2];
	for (let i = 0; i < input.length; i++) {
		let [dir, steps] = input[i].split(' ');
		steps = Number(steps);
		for (let j = 0; j < steps; j++) {
			if (dir === 'R') {
				pointerC += 1;
			} else if (dir === 'D') {
				pointerR += 1;
			} else if (dir === 'L') {
				pointerC -= 1;
			} else if (dir === 'U') {
				pointerR -= 1;
			}
			map[pointerR][pointerC] = '#';
		}
	}
	return map;
}

function fillMap(map, input, size) {
	let [pointerR, pointerC] = [size / 2, size / 2];
	for (let i = 0; i < input.length; i++) {
		let [dir, steps] = input[i].split(' ');
		steps = Number(steps);
		for (let j = 0; j < steps; j++) {
			let exploreR;
			let exploreC;
			if (dir === 'R') {
				pointerC += 1;
				exploreR = pointerR + 1;
				exploreC = pointerC;
			} else if (dir === 'D') {
				pointerR += 1;
				exploreR = pointerR;
				exploreC = pointerC - 1;
			} else if (dir === 'L') {
				pointerC -= 1;
				exploreR = pointerR - 1;
				exploreC = pointerC;
			} else if (dir === 'U') {
				pointerR -= 1;
				exploreR = pointerR;
				exploreC = pointerC + 1;
			}
			if (map[exploreR][exploreC] === '.') {
				bfs(map, [exploreR, exploreC], size);
			}
		}
	}
}

function bfs(map, [startR, startC], size) {
	const DIR = [
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
	];
	const queue = [[startR, startC]];
	map[startR][startC] = 'I';
	while (queue.length > 0) {
		const [r, c] = queue.shift();
		for (let i = 0; i < DIR.length; i++) {
			const [dr, dc] = DIR[i];
			const [exploreR, exploreC] = [r + dr, c + dc];
			if (outOfBound([exploreR, exploreC], size)) {
				continue;
			}
			if (map[exploreR][exploreC] === '.') {
				map[exploreR][exploreC] = 'I';
				queue.push([exploreR, exploreC]);
			}
		}
	}
}

function outOfBound([r, c], size) {
	if (r < 0 || c < 0 || r >= size || c >= size) {
		return true;
	}
	return false;
}

function part1(input) {
	const SIZE = 1000;
	const map = drawMap(input, SIZE);
	fillMap(map, input, SIZE);
	let wall = countElement(map, '#');
	let inside = countElement(map, 'I');
	let outside = countElement(map, '.');

	return wall + (inside < outside ? inside : outside);
}

function printMap(map) {
	let top = 0;
	let botton = 0;
	let left = Infinity;
	let right = 0;
	for (let i = 0; i < map.length; i++) {
		if (map[i].includes('#')) {
			top = i;
			break;
		}
	}
	for (let i = map.length - 1; i >= 0; i--) {
		if (map[i].includes('#')) {
			bottom = i;
			break;
		}
	}
	for (let i = 0; i < map.length; i++) {
		if (map[i].includes('#')) {
			left = Math.min(left, map[i].indexOf('#'));
			right = Math.max(right, map[i].lastIndexOf('#'));
		}
	}

	console.log(
		map
			.slice(top - 10, bottom + 1 - 200)
			.map(row => row.slice(left - 10, right + 1 + 10).join(''))
			.join('\n'),
	);
}

function countElement(map, element) {
	return map
		.map(row => row.join(''))
		.join('')
		.split('')
		.filter(x => x === element).length;
}

function part2(input) {
	const DIR = {
		0: 'R',
		1: 'D',
		2: 'L',
		3: 'U',
	};
	const newInput = input.map(line => {
		const hexCode = line.split(/ \(#|\)/)[1];
		const steps = parseInt(hexCode.slice(0, 5), 16);
		const dir = DIR[hexCode[5]];
		return { steps, dir };
	});
	// step 1: get vertical and horizontal ruler
	const [hRuler, vRuler] = getRuler(newInput);
	// step 2: get horizontal bar map
	const hBarMap = getHBarMap(hRuler, vRuler, newInput);
	// step 3: get map of inside block
	const blockMap = getBlockMap(hBarMap);
	// step 4: calculate Ans
	return calculateAns(hRuler, vRuler, blockMap);
}

function getRuler(input) {
	const hRuler = new Set([0]);
	const vRuler = new Set([0]);
	let [pointerR, pointerC] = [0, 0];
	for (let i = 0; i < input.length; i++) {
		const { steps, dir } = input[i];
		if (dir === 'R') {
			pointerC += steps;
		} else if (dir === 'D') {
			pointerR += steps;
		} else if (dir === 'L') {
			pointerC -= steps;
		} else if (dir === 'U') {
			pointerR -= steps;
		}
		hRuler.add(pointerR);
		vRuler.add(pointerC);
	}
	return [
		Array.from(hRuler).sort((a, b) => a - b),
		Array.from(vRuler).sort((a, b) => a - b),
	];
}

function getHBarMap(hRuler, vRuler, input) {
	const hBarMap = Array(hRuler.length)
		.fill(null)
		.map(x => Array(vRuler.length - 1).fill(false));
	let [pointerR, pointerC] = [0, 0];
	let rowIndex = hRuler.indexOf(0);
	for (let i = 0; i < input.length; i++) {
		const { steps, dir } = input[i];
		if (dir === 'D') {
			pointerR += steps;
			rowIndex = hRuler.indexOf(pointerR);
		} else if (dir === 'U') {
			pointerR -= steps;
			rowIndex = hRuler.indexOf(pointerR);
		} else if (dir === 'R') {
			const originalC = pointerC;
			pointerC += steps;
			const targetC = pointerC;
			for (let j = 0; j < vRuler.length - 1; j++) {
				const check = (vRuler[j] + vRuler[j + 1]) / 2;
				if (check > originalC && check < targetC) {
					hBarMap[rowIndex][j] = true;
				}
			}
		} else if (dir === 'L') {
			const originalC = pointerC;
			pointerC -= steps;
			const targetC = pointerC;
			for (let j = 0; j < vRuler.length - 1; j++) {
				const check = (vRuler[j] + vRuler[j + 1]) / 2;
				if (check > targetC && check < originalC) {
					hBarMap[rowIndex][j] = true;
				}
			}
		}
	}
	return hBarMap;
}

function getBlockMap(hBarMap) {
	const blockMap = Array(hBarMap.length - 1)
		.fill(null)
		.map(x => Array(hBarMap[0].length).fill(false));
	for (let r = 0; r < blockMap.length; r++) {
		for (let c = 0; c < blockMap[r].length; c++) {
			const barCount = getBarCount(hBarMap, [r, c]);
			if (barCount % 2 === 1) {
				blockMap[r][c] = true;
			}
		}
	}
	return blockMap;
}

function getBarCount(hBarMap, [startR, startC]) {
	let count = 0;
	for (let r = startR; r >= 0; r--) {
		if (hBarMap[r][startC] === true) {
			count += 1;
		}
	}
	return count;
}

function calculateAns(hRuler, vRuler, blockMap) {
	let ans = 0;
	let rangeRecord = [];
	for (let r = 0; r < blockMap.length; r++) {
		let insideRanges = [];
		let start = null;
		let end = null;
		for (let c = 0; c < blockMap[r].length; c++) {
			if (blockMap[r][c] === true) {
				if (start === null) {
					start = c;
				}
				end = c;
			} else if (blockMap[r][c] === false) {
				if (start !== null) {
					insideRanges.push([start, end]);
					start = null;
					end = null;
				}
			}
		}
		if (start !== null) {
			insideRanges.push([start, end]);
		}
		rangeRecord.push(insideRanges);
		for (let i = 0; i < insideRanges.length; i++) {
			const [start, end] = insideRanges[i];
			const width = vRuler[end + 1] - vRuler[start] + 1;
			const height = hRuler[r + 1] - hRuler[r] + 1;
			ans += width * height;
		}
	}
	for (let r = 0; r < rangeRecord.length - 1; r++) {
		const rangeRecord1 = rangeRecord[r];
		const rangeRecord2 = rangeRecord[r + 1];
		for (let i = 0; i < rangeRecord1.length; i++) {
			const [s1, e1] = rangeRecord1[i];
			for (let j = 0; j < rangeRecord2.length; j++) {
				const [s2, e2] = rangeRecord2[j];
				const conflictStart = Math.max(s1, s2);
				const conflictEnd = Math.min(e1, e2);
				if (conflictStart > conflictEnd) {
					continue;
				}
				const width = vRuler[conflictEnd + 1] - vRuler[conflictStart] + 1;
				ans -= width * 1;
			}
		}
	}
	return ans;
}

day18();
