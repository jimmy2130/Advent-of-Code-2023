const fs = require('fs');

function day17() {
	const input = fs
		.readFileSync('./day17.txt')
		.toString()
		.split('\n')
		.map(row => row.split('').map(element => Number(element)));
	console.log('part 1');
	console.log(part1(input));
	// console.log('part 2');
	// console.log(part2(input));
}

function part1(map) {
	const record = new Array(map.length).fill(null).map(row =>
		new Array(map[0].length).fill(null).map(col => {
			return createRecordKeys(3).reduce((acc, cur) => {
				acc[cur] = Infinity;
				return acc;
			}, {});
		}),
	);
	record[0][0] = createRecordKeys(3).reduce((acc, cur) => {
		acc[cur] = 0;
		return acc;
	}, {});

	const queue = [[0, 0, 'east', 0]];

	while (queue.length > 0) {
		console.log(queue.length);
		const [row, col, dir, steps] = queue.shift();
		const newDirArr = turn(dir, steps);
		for (let i = 0; i < newDirArr.length; i++) {
			const [newDir, newSteps] = newDirArr[i];
			const [newRow, newCol] = move([row, col], newDir);
			if (outOfBound([newRow, newCol], map)) {
				continue;
			}
			const newHeatLoss =
				record[row][col][`${dir}${steps}`] + map[newRow][newCol];
			if (newHeatLoss < record[newRow][newCol][`${newDir}${newSteps}`]) {
				record[newRow][newCol][`${newDir}${newSteps}`] = newHeatLoss;
				queue.push([newRow, newCol, newDir, newSteps]);
			}
		}
	}
	return Math.min(
		...Object.values(record[record.length - 1][record[0].length - 1]),
	);
}

function part2(map) {
	const record = new Array(map.length).fill(null).map(row =>
		new Array(map[0].length).fill(null).map(col => {
			return createRecordKeys(10).reduce((acc, cur) => {
				acc[cur] = Infinity;
				return acc;
			}, {});
		}),
	);
	record[0][0] = createRecordKeys(10).reduce((acc, cur) => {
		acc[cur] = 0;
		return acc;
	}, {});

	const queue = [[0, 0, 'east', 0]];
	while (queue.length > 0) {
		// console.log(queue.length);
		const [row, col, dir, steps] = queue.shift();
		const newDirArr = turn2(dir, steps);
		for (let i = 0; i < newDirArr.length; i++) {
			const [newDir, newSteps] = newDirArr[i];
			const [newRow, newCol] = move([row, col], newDir);
			if (outOfBound([newRow, newCol], map)) {
				continue;
			}
			const newHeatLoss =
				record[row][col][`${dir}${steps}`] + map[newRow][newCol];
			if (newHeatLoss < record[newRow][newCol][`${newDir}${newSteps}`]) {
				record[newRow][newCol][`${newDir}${newSteps}`] = newHeatLoss;
				queue.push([newRow, newCol, newDir, newSteps]);
			}
		}
	}

	const validKeys = createRecordKeys(10, 4);

	const targetEntries = Object.entries(
		record[record.length - 1][record[0].length - 1],
	)
		.filter(([key]) => validKeys.includes(key))
		.map(([_, value]) => value);

	return Math.min(...targetEntries);
}

function turn(dir, steps) {
	const newDir = [];
	if (dir === 'east' || dir === 'west') {
		newDir.push(['north', 1]);
		newDir.push(['south', 1]);
	} else if (dir === 'south' || dir === 'north') {
		newDir.push(['east', 1]);
		newDir.push(['west', 1]);
	}
	if (steps < 3) {
		newDir.push([dir, steps + 1]);
	}
	return newDir;
}

function turn2(dir, steps) {
	const newDir = [];
	if (steps === 0 || steps >= 4) {
		if (dir === 'east' || dir === 'west') {
			newDir.push(['north', 1]);
			newDir.push(['south', 1]);
		} else if (dir === 'south' || dir === 'north') {
			newDir.push(['east', 1]);
			newDir.push(['west', 1]);
		}
	}
	if (steps < 10) {
		newDir.push([dir, steps + 1]);
	}

	return newDir;
}

function move([row, col], dir) {
	if (dir === 'east') {
		return [row, col + 1];
	}
	if (dir === 'west') {
		return [row, col - 1];
	}
	if (dir === 'north') {
		return [row - 1, col];
	}
	if (dir === 'south') {
		return [row + 1, col];
	}
}

function outOfBound([r, c], map) {
	if (r < 0 || r >= map.length || c < 0 || c >= map[0].length) {
		return true;
	}
	return false;
}

function createRecordKeys(num, start = 0) {
	const DIR = ['north', 'east', 'south', 'west'];
	const keys = [];
	for (let i = 0; i < DIR.length; i++) {
		for (let j = start; j <= num; j++) {
			keys.push(`${DIR[i]}${j}`);
		}
	}
	return keys;
}

day17();
