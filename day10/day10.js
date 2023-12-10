const fs = require('fs');

function day10() {
	const input = fs.readFileSync('./day10.txt').toString().split('\n');
	console.log('part 1');
	const [steps, newMap] = part1(input);
	console.log(steps);
	console.log('part 2');
	console.log(part2(newMap));
}

function part1(map) {
	const record = Array(map.length)
		.fill(null)
		.map(row => Array(map[0].length).fill(false));
	const startingPoint = getStartingPoint(map);
	let queue = [startingPoint];
	let steps = 0;
	let queueLength = queue.length;
	while (queue.length > 0) {
		const [r, c] = queue.shift();
		record[r][c] = true;
		queueLength -= 1;
		const tile = map[r][c];
		switch (tile) {
			case 'S': {
				if (
					!isOutOfBound(map, [r - 1, c]) &&
					['|', '7', 'F'].includes(map[r - 1][c])
				) {
					queue.push([r - 1, c]);
				}
				if (
					!isOutOfBound(map, [r + 1, c]) &&
					['|', 'J', 'L'].includes(map[r + 1][c])
				) {
					queue.push([r + 1, c]);
				}
				if (
					!isOutOfBound(map, [r, c - 1]) &&
					['-', 'L', 'F'].includes(map[r][c - 1])
				) {
					queue.push([r, c - 1]);
				}
				if (
					!isOutOfBound(map, [r, c + 1]) &&
					['-', 'J', '7'].includes(map[r][c + 1])
				) {
					queue.push([r, c + 1]);
				}
				break;
			}
			case '|': {
				if (record[r - 1][c] === false) {
					queue.push([r - 1, c]);
				} else if (record[r + 1][c] === false) {
					queue.push([r + 1, c]);
				}
				break;
			}
			case '-': {
				if (record[r][c - 1] === false) {
					queue.push([r, c - 1]);
				} else if (record[r][c + 1] === false) {
					queue.push([r, c + 1]);
				}
				break;
			}
			case 'L': {
				if (record[r - 1][c] === false) {
					queue.push([r - 1, c]);
				} else if (record[r][c + 1] === false) {
					queue.push([r, c + 1]);
				}
				break;
			}
			case 'J': {
				if (record[r - 1][c] === false) {
					queue.push([r - 1, c]);
				} else if (record[r][c - 1] === false) {
					queue.push([r, c - 1]);
				}
				break;
			}
			case '7': {
				if (record[r + 1][c] === false) {
					queue.push([r + 1, c]);
				} else if (record[r][c - 1] === false) {
					queue.push([r, c - 1]);
				}
				break;
			}
			case 'F': {
				if (record[r + 1][c] === false) {
					queue.push([r + 1, c]);
				} else if (record[r][c + 1] === false) {
					queue.push([r, c + 1]);
				}
				break;
			}
			default: {
				throw new Error(`unknown tile: ${tile}`);
			}
		}
		if (queueLength === 0) {
			steps += 1;
			queueLength = queue.length;
		}
	}
	const newMap = [];
	for (let r = 0; r < record.length; r++) {
		let row = '';
		for (let c = 0; c < record[r].length; c++) {
			if (record[r][c] === false) {
				row += '.';
			} else if (record[r][c] === true) {
				row += map[r][c];
			}
		}
		newMap.push(row);
	}
	return [steps - 1, newMap];
}

function getStartingPoint(map) {
	for (let r = 0; r < map.length; r++) {
		for (let c = 0; c < map[r].length; c++) {
			if (map[r][c] === 'S') {
				return [r, c];
			}
		}
	}
	throw new Error('no starting point');
}

function part2(newMap) {
	const recordMap = newMap.map(line => line.split(''));
	const startingPoint = getStartingPoint(recordMap);
	let [r, c] = startingPoint;
	let direction = getStartingDirection(recordMap, startingPoint);
	while (true) {
		// detect
		const detectionPoints = getDetectionPoint(recordMap, [r, c], direction);
		for (let i = 0; i < detectionPoints.length; i++) {
			const [detectR, detectC] = detectionPoints[i];
			if (
				!isOutOfBound(recordMap, [detectR, detectC]) &&
				recordMap[detectR][detectC] === '.'
			) {
				drawMap(recordMap, [detectR, detectC]);
			}
		}
		// turn
		if (recordMap[r][c] === 'L') {
			direction =
				direction === 'south'
					? turn(direction, 'left')
					: turn(direction, 'right');
		} else if (recordMap[r][c] === 'F') {
			direction =
				direction === 'north'
					? turn(direction, 'right')
					: turn(direction, 'left');
		} else if (recordMap[r][c] === 'J') {
			direction =
				direction === 'south'
					? turn(direction, 'right')
					: turn(direction, 'left');
		} else if (recordMap[r][c] === '7') {
			direction =
				direction === 'north'
					? turn(direction, 'left')
					: turn(direction, 'right');
		}
		// move
		[r, c] = move(r, c, direction);

		if (r === startingPoint[0] && c === startingPoint[1]) {
			break;
		}
	}

	return Math.min(countMap(recordMap, '.'), countMap(recordMap, 'O'));
}

function getStartingDirection(map, [r, c]) {
	if (
		!isOutOfBound(map, [r, c + 1]) &&
		['-', 'J', '7'].includes(map[r][c + 1])
	) {
		return 'east';
	}
	if (
		!isOutOfBound(map, [r + 1, c]) &&
		['|', 'J', 'L'].includes(map[r + 1][c])
	) {
		return 'south';
	}
	if (
		!isOutOfBound(map, [r, c - 1]) &&
		['-', 'L', 'F'].includes(map[r][c - 1])
	) {
		return 'west';
	}
	if (
		!isOutOfBound(map, [r - 1, c]) &&
		['|', 'F', '7'].includes(map[r - 1][c])
	) {
		return 'north';
	}
	throw new Error('can not decide starting direction');
}

function getDetectionPoint(map, [r, c], direction) {
	// right side is outside
	const tile = map[r][c];
	if (tile === '-') {
		if (direction === 'east') {
			return [[r + 1, c]];
		}
		if (direction === 'west') {
			return [[r - 1, c]];
		}
	}
	if (tile === '|') {
		if (direction === 'north') {
			return [[r, c + 1]];
		}
		if (direction === 'south') {
			return [[r, c - 1]];
		}
	}
	if (tile === 'F') {
		if (direction === 'north') {
			return [];
		}
		if (direction === 'west') {
			return [
				[r, c - 1],
				[r - 1, c],
			];
		}
	}
	if (tile === 'L') {
		if (direction === 'west') {
			return [];
		}
		if (direction === 'south') {
			return [
				[r, c - 1],
				[r + 1, c],
			];
		}
	}
	if (tile === 'J') {
		if (direction === 'south') {
			return [];
		}
		if (direction === 'east') {
			return [
				[r + 1, c],
				[r, c + 1],
			];
		}
	}
	if (tile === '7') {
		if (direction === 'east') {
			return [];
		}
		if (direction === 'north') {
			return [
				[r, c + 1],
				[r - 1, c],
			];
		}
	}
	return [];
}

function drawMap(map, startingPoint) {
	const DIR = [
		[0, 1],
		[0, -1],
		[1, 0],
		[-1, 0],
	];
	const queue = [startingPoint];
	map[startingPoint[0]][startingPoint[1]] = 'O';

	while (queue.length > 0) {
		const [r, c] = queue.shift();
		for (let i = 0; i < DIR.length; i++) {
			const [deltaR, deltaC] = DIR[i];
			const [exploreR, exploreC] = [r + deltaR, c + deltaC];
			if (!isOutOfBound(map, [exploreR, exploreC])) {
				if (map[exploreR][exploreC] === '.') {
					map[exploreR][exploreC] = 'O';
					queue.push([exploreR, exploreC]);
				}
			}
		}
	}
}

function isOutOfBound(map, [r, c]) {
	if (r < 0 || c < 0 || r >= map.length || c >= map[0].length) {
		return true;
	}
	return false;
}

function turn(direction, whichDirection) {
	const DIR = ['north', 'east', 'south', 'west'];
	const index = DIR.indexOf(direction);
	if (whichDirection === 'right') {
		return DIR[(index + 1) % 4];
	}
	if (whichDirection === 'left') {
		return DIR[(index - 1 + 4) % 4];
	}
}

function move(r, c, direction) {
	if (direction === 'east') {
		return [r, c + 1];
	}
	if (direction === 'west') {
		return [r, c - 1];
	}
	if (direction === 'north') {
		return [r - 1, c];
	}
	if (direction === 'south') {
		return [r + 1, c];
	}
}

function countMap(map, symbol) {
	let ans = 0;
	for (let r = 0; r < map.length; r++) {
		for (let c = 0; c < map[r].length; c++) {
			if (map[r][c] === symbol) {
				ans += 1;
			}
		}
	}
	return ans;
}

day10();
