const fs = require('fs');
const REMAINING_STEPS = 8;
const REMAINING_STEPS2 = 26501365;

function day21() {
	const input = fs
		.readFileSync('./day21.txt')
		.toString()
		.split('\n')
		.map(row => row.split(''));
	const [startingRow, startingCol] = findStartingPosition(input);
	// console.log('part 1');
	// console.log(part1(input, [startingRow, startingCol]));
	// console.log('part 2');
	// console.log(part2(input, [startingRow, startingCol], 6));
	// console.log('part 2 Retry');
	// console.log(part2Retry(input, [startingRow, startingCol]));
	// console.log('part 2 Retry Retry');
	// console.log(part2RetryRetry(input, [startingRow, startingCol]));
	// console.log('part 2 Retry Retry Retry');
	// console.log(part2RetryRetryRetry(input, [startingRow, startingCol]));
	console.log('part 2 polynomial');
	console.log(part2Polynomial(input, [startingRow, startingCol]));
}

function findStartingPosition(map) {
	for (let r = 0; r < map.length; r++) {
		for (let c = 0; c < map[r].length; c++) {
			if (map[r][c] === 'S') {
				return [r, c];
			}
		}
	}
}

function part1(input, [startingRow, startingCol], steps = 64) {
	const rangeMap = getRangeMap(input, [startingRow, startingCol]);
	let ans = 0;
	for (let r = 0; r < rangeMap.length; r++) {
		for (let c = 0; c < rangeMap[r].length; c++) {
			if (
				rangeMap[r][c] <= steps &&
				rangeMap[r][c] % 2 === steps % 2 &&
				input[r][c] !== '#'
			) {
				ans += 1;
			}
		}
	}
	return ans;
}

function getRangeMap(input, [startingRow, startingCol]) {
	const DIR = [
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
	];
	const rangeMap = Array(input.length)
		.fill(null)
		.map(row => Array(input[0].length).fill(0));
	const recordMap = Array(input.length)
		.fill(null)
		.map(row => Array(input[0].length).fill(false));
	recordMap[startingRow][startingCol] = true;
	const queue = [[startingRow, startingCol]];
	let queueLength = queue.length;
	let steps = 1;
	while (queue.length > 0) {
		const [r, c] = queue.shift();
		queueLength -= 1;
		for (let i = 0; i < DIR.length; i++) {
			const [dr, dc] = DIR[i];
			const [exploreR, exploreC] = [r + dr, c + dc];
			if (
				!outOfBound(input, [exploreR, exploreC]) &&
				input[exploreR][exploreC] !== '#' &&
				!recordMap[exploreR][exploreC]
			) {
				recordMap[exploreR][exploreC] = true;
				rangeMap[exploreR][exploreC] = steps;
				queue.push([exploreR, exploreC]);
			}
		}
		if (queueLength === 0) {
			queueLength = queue.length;
			steps += 1;
		}
	}
	for (let r = 0; r < rangeMap.length; r++) {
		for (let c = 0; c < rangeMap[0].length; c++) {
			if (rangeMap[r][c] === 0 && input[r][c] !== '#') {
				if (r === startingRow && c === startingCol) {
					continue;
				}
				rangeMap[r][c] = Infinity;
			}
		}
	}
	return rangeMap;
}

function outOfBound(map, [r, c]) {
	if (r < 0 || c < 0 || r >= map.length || c >= map[0].length) {
		return true;
	}
	return false;
}

function part2(input, [startingRow, startingCol], totalSteps) {
	const DIR = [
		[0, 0],
		[0, -input.length],
		[-input.length, 0],
		[-input.length, -input.length],
	];
	let totalTiles = countTotalTiles(totalSteps);
	console.log({ totalTiles });
	for (let r = 0; r < input.length; r++) {
		for (let c = 0; c < input[r].length; c++) {
			for (let i = 0; i < DIR.length; i++) {
				const [dr, dc] = DIR[i];
				const [realR, realC] = [r + dr, c + dc];
				// console.log({ realR, realC });
				const a1 =
					Math.abs(startingRow - realR) + Math.abs(startingCol - realC);
				if (a1 % 2 === totalSteps % 2 && input[r][c] === '#') {
					const d = input.length;
					const high = a1 + (totalSteps - a1) - ((totalSteps - a1) % d);
					const axis = (high - a1) / d + 1;
					totalTiles -= ((1 + axis) * axis) / 2;
				}
			}
		}
	}
	return totalTiles;
}

function countTotalTiles(totalSteps) {
	let count = 0;
	let steps = totalSteps;
	while (steps >= 0) {
		if (steps === totalSteps) {
			count += 2 * Math.ceil(steps / 2);
			if (totalSteps % 2 === 0) {
				count += 1;
			}
		} else {
			count += 2 * 2 * Math.ceil(steps / 2);
			if (steps % 2 === 0) {
				count += 2;
			}
		}
		steps -= 1;
	}
	console.log(count === (1 + totalSteps) * totalSteps + totalSteps + 1);
	return count;
}

function countInvalidTiles([startingRow, startingCol], [r, c], d, maxValue) {
	const DIR = [
		[0, 0],
		[0, -d],
		[-d, 0],
		[-d, -d],
	];
	let count = 0;
	for (let i = 0; i < DIR.length; i++) {
		const [dr, dc] = DIR[i];
		const [realR, realC] = [r + dr, c + dc];
		console.log({ realR, realC });
		const a1 = Math.abs(startingRow - realR) + Math.abs(startingCol - realC);
		console.log({ a1 });
		const high = a1 + (maxValue - a1) - ((maxValue - a1) % d);
		const axis = (high - a1) / d + 1;
		count += ((1 + axis) * axis) / 2;
	}

	return count;
}

function part2Retry(input, [startingRow, startingCol]) {
	const maxValue = 500;
	const rangeMap = getRangeMap2(input, [startingRow, startingCol]);
	console.log('rangeMap done');
	// let pointerR = 4;
	// let pointerC = 7;
	// for (
	// 	let r = pointerR - 4 * input.length;
	// 	r <= pointerR + 3 * input.length;
	// 	r += input.length
	// ) {
	// 	let str = '';
	// 	for (
	// 		let c = pointerC - 4 * input.length;
	// 		c <= pointerC + 3 * input.length;
	// 		c += input.length
	// 	) {
	// 		const key = JSON.stringify([r, c]);
	// 		// console.log(key, rangeMap.get(key));
	// 		str += `${rangeMap.get(key).toString().padStart(2, '0')} `;
	// 	}
	// 	console.log(str);
	// }
	let ans = 0;
	for (let r = 0; r < input.length; r++) {
		for (let c = 0; c < input[r].length; c++) {
			if (input[r][c] !== '#') {
				ans += calculateAns(input, rangeMap, [r, c], maxValue);
			}
		}
	}
	return ans;
}

function getRangeMap2(input, [startingRow, startingCol]) {
	const DIR = [
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
	];
	const rangeMap = new Map();
	rangeMap.set(JSON.stringify([startingRow, startingCol]), 0);
	const recordMap = new Map();
	recordMap.set(JSON.stringify([startingRow, startingCol]), true);
	const queue = [[startingRow, startingCol]];
	let queueLength = queue.length;
	let steps = 1;
	while (true) {
		const [r, c] = queue.shift();
		queueLength -= 1;
		for (let i = 0; i < DIR.length; i++) {
			const [dr, dc] = DIR[i];
			const [exploreR, exploreC] = [r + dr, c + dc];
			const realR = (exploreR + 100000000 * input.length) % input.length;
			const realC = (exploreC + 100000000 * input.length) % input.length;
			if (
				input[realR][realC] !== '#' &&
				!recordMap.has(JSON.stringify([exploreR, exploreC]))
			) {
				recordMap.set(JSON.stringify([exploreR, exploreC]), true);
				rangeMap.set(JSON.stringify([exploreR, exploreC]), steps);
				queue.push([exploreR, exploreC]);
			}
		}
		if (queueLength === 0) {
			queueLength = queue.length;
			steps += 1;
		}
		if (steps > 1000) {
			break;
		}
	}

	// let checkIndex = 0;

	// while (true) {
	// 	const key = JSON.stringify([5 + input.length * 1, checkIndex]);
	// 	if (rangeMap.has(key)) {
	// 		console.log(key, rangeMap.get(key));
	// 	} else {
	// 		break;
	// 	}
	// 	checkIndex -= input.length;
	// }
	return rangeMap;
}

function calculateHorizontalAns(map, rangeMap, [r, c], maxValue) {
	let ans = 0;
	let pointerR = r;
	let pointerC = c;
	while (true) {
		const nextPointerC = pointerC + map.length;
		const key = JSON.stringify([pointerR, pointerC]);
		const nextKey = JSON.stringify([pointerR, nextPointerC]);

		if (rangeMap.get(nextKey) - rangeMap.get(key) === map.length) {
			// calculate
			ans += Math.floor(maxValue - rangeMap.get(key) / map.length) + 1;
			break;
		} else {
			if (rangeMap.get(key) % 2 === maxValue % 2) {
				ans += 1;
			}
		}
		pointerC = nextPointerC;
	}
	pointerR = r;
	pointerC = c;

	while (true) {
		const nextPointerC = pointerC - map.length;
		const key = JSON.stringify([pointerR, pointerC]);
		const nextKey = JSON.stringify([pointerR, nextPointerC]);
		if (rangeMap.get(nextKey) - rangeMap.get(key) === map.length) {
			// calculate
			ans += Math.floor(maxValue - rangeMap.get(key) / map.length) + 1;
			break;
		} else {
			if (rangeMap.get(key) % 2 === maxValue % 2) {
				ans += 1;
			}
		}
		pointerC = nextPointerC;
	}
	ans -= 1;
	return ans;
}

function calculateAns(map, rangeMap, [r, c], maxValue) {
	let up = [];
	let ans = 0;
	for (
		let pointerR = r;
		pointerR > r - 10 * map.length;
		pointerR -= map.length
	) {
		up.push(calculateHorizontalAns(map, rangeMap, [pointerR, c], maxValue));
		console.log('up');
		console.log(up);
	}

	let down = [];
	for (
		let pointerR = r;
		pointerR < r + 10 * map.length;
		pointerR += map.length
	) {
		down.push(calculateHorizontalAns(map, rangeMap, [pointerR, c], maxValue));
		console.log('down');
		console.log(down);
	}
	if (down[3] - down[2] !== down[4] - down[3]) {
		throw new Error('down is not regular');
	}
	d = down[4] - down[3];
	first = down[4];
	last = down[4] % d;
	n = (last - first) / d;
	const downAns =
		down[0] + down[1] + down[2] + down[3] + ((first + last) * (n + 1)) / 2;

	return ans;
}

function part2RetryRetryRetry(initialMap, [startingRow, startingCol]) {
	const input = JSON.parse(JSON.stringify(initialMap));
	fillInHoles(input);

	const TEST_STEPS = 25;
	let ans = 0;
	for (let q = 1; q <= 4; q++) {
		const quadrantMap = getQuadrantMap(input, [startingRow, startingCol], q);
		// console.log(quadrantMap.map(row => row.join('')).join('\n'));
		// console.log('\n\n\n\n\n\n');
		let rangeMap = getRangeMap(quadrantMap, findStartingPosition(quadrantMap));
		rangeMap = trim(rangeMap, q);

		// console.log(
		// 	rangeMap
		// 		.map(row => row.map(el => el.toString().padStart(2, '0')).join(','))
		// 		.join('\n'),
		// );

		for (let r = 0; r < rangeMap.length; r++) {
			for (let c = 0; c < rangeMap.length; c++) {
				if (quadrantMap[r][c] === '#') {
					continue;
				}
				ans += calculateQuadrantAns(rangeMap[r][c], input.length, TEST_STEPS);

				if (
					(q === 1 && c === 0) ||
					(q === 2 && r === rangeMap.length - 1) ||
					(q === 3 && c === rangeMap.length - 1) ||
					(q === 4 && r === 0)
				) {
					ans -= calculateAxisAns(rangeMap[r][c], input.length, TEST_STEPS);
				}
			}
		}
	}

	return ans;
}

function getQuadrantMap(input, [startingRow, startingCol], quadrant) {
	let map = Array(input.length)
		.fill(null)
		.map(r => Array(input[0].length).fill(''));

	let markerR = startingRow;
	let markerC = startingCol;

	if (quadrant === 1) {
		for (let r = map.length - 1; r >= 0; r--) {
			for (let c = 0; c < map.length; c++) {
				map[r][c] =
					input[(markerR + map.length * map.length) % map.length][
						(markerC + map.length * map.length) % map.length
					];
				markerC += 1;
			}
			markerR -= 1;
		}
	} else if (quadrant === 2) {
		for (let r = map.length - 1; r >= 0; r--) {
			for (let c = map.length - 1; c >= 0; c--) {
				map[r][c] =
					input[(markerR + map.length * map.length) % map.length][
						(markerC + map.length * map.length) % map.length
					];
				markerC -= 1;
			}
			markerR -= 1;
		}
	} else if (quadrant === 3) {
		for (let r = 0; r < map.length; r++) {
			for (let c = map.length - 1; c >= 0; c--) {
				map[r][c] =
					input[(markerR + map.length * map.length) % map.length][
						(markerC + map.length * map.length) % map.length
					];
				markerC -= 1;
			}
			markerR += 1;
		}
	} else if (quadrant === 4) {
		for (let r = 0; r < map.length; r++) {
			for (let c = 0; c < map.length; c++) {
				map[r][c] =
					input[(markerR + map.length * map.length) % map.length][
						(markerC + map.length * map.length) % map.length
					];
				markerC += 1;
			}
			markerR += 1;
		}
	}

	if (quadrant === 1) {
		return [
			Array(input.length + 1).fill('.'),
			...map.map(row => [...row, '.']),
		];
	}
	if (quadrant === 2) {
		return [
			Array(input.length + 1).fill('.'),
			...map.map(row => ['.', ...row]),
		];
	}
	if (quadrant === 3) {
		return [
			...map.map(row => ['.', ...row]),
			Array(input.length + 1).fill('.'),
		];
	}
	if (quadrant === 4) {
		return [
			...map.map(row => [...row, '.']),
			Array(input.length + 1).fill('.'),
		];
	}
}

function calculateQuadrantAns(initialNum, size, target) {
	const distance = target - initialNum;
	if (distance < 0) {
		return 0;
	}
	const N = (distance - (distance % size)) / size + 1;
	if (initialNum % 2 === target % 2) {
		const lastTerm = N % 2 === 0 ? N - 1 : N;
		const howManyTerms = (lastTerm - 1) / 2 + 1;
		return ((1 + lastTerm) * howManyTerms) / 2;
		// 1 + 3 + 5 + ....
	} else {
		const lastTerm = N % 2 === 0 ? N : N - 1;
		const howManyTerms = (lastTerm - 2) / 2 + 1;
		return ((2 + lastTerm) * howManyTerms) / 2;
		// 2 + 4 + 6 + ...
	}
}

function calculateAxisAns(initialNum, size, target) {
	const distance = target - initialNum;
	if (distance < 0) {
		return 0;
	}
	const N = (distance - (distance % size)) / size + 1;
	if (N % 2 === 0) {
		return N / 2;
	}
	return initialNum % 2 === target % 2 ? Math.ceil(N / 2) : Math.floor(N / 2);
}

function fillInHoles(input) {
	for (let r = 1; r < input.length - 1; r++) {
		for (let c = 1; c < input[r].length - 1; c++) {
			if (
				input[r + 1][c] === '#' &&
				input[r - 1][c] === '#' &&
				input[r][c + 1] === '#' &&
				input[r][c - 1] === '#'
			) {
				input[r][c] = '#';
			}
		}
	}
}

function trim(rangeMap, quadrant) {
	if (quadrant === 1) {
		return rangeMap.slice(1).map(row => row.slice(0, -1));
	}
	if (quadrant === 2) {
		return rangeMap.slice(1).map(row => row.slice(1));
	}
	if (quadrant === 3) {
		return rangeMap.slice(0, -1).map(row => row.slice(1));
	}
	if (quadrant === 4) {
		return rangeMap.slice(0, -1).map(row => row.slice(0, -1));
	}
}

function part2Polynomial(input, [startingRow, startingCol]) {
	const bigMap = Array(input.length * 7)
		.fill(null)
		.map(row => Array(input.length * 7).fill(''));

	for (let bigR = 0; bigR < bigMap.length; bigR += input.length) {
		for (let bigC = 0; bigC < bigMap.length; bigC += input.length) {
			for (let r = 0; r < input.length; r++) {
				for (let c = 0; c < input.length; c++) {
					bigMap[bigR + r][bigC + c] = input[r][c] === 'S' ? '.' : input[r][c];
				}
			}
		}
	}
	// console.log(bigMap.map(row => row.join('')).join('\n'));
	const mid = Math.floor(bigMap.length / 2);
	// console.log(mid);

	let ans1 = part1(bigMap, [mid, mid], 65);
	let ans2 = part1(bigMap, [mid, mid], 65 + 131);
	let ans3 = part1(bigMap, [mid, mid], 65 + 131 * 2);
	console.log({ ans1, ans2, ans3 });

	for (let i = 0; i < 202300 - 2; i++) {
		let future = fromDay9([ans1, ans2, ans3]);
		[ans1, ans2, ans3] = [ans2, ans3, future];
	}
	return ans3;
	// console.log(fromDay9([ans1, ans2, ans3]));
}

function fromDay9(history) {
	if (history.every(value => value === 0)) {
		return 0;
	}

	let sequence = [];
	for (let i = 1; i < history.length; i++) {
		sequence.push(history[i] - history[i - 1]);
	}

	return history.at(-1) + fromDay9(sequence);
}

day21();
