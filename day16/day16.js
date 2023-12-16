const fs = require('fs');

function day16() {
	const input = fs.readFileSync('./day16.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input, [0, 0, 'east']));
	console.log('part 2');
	console.log(part2(input));
}

function part1(map, [startRow, startCol, startDir]) {
	const record = Array(map.length)
		.fill(null)
		.map(row =>
			Array(map[0].length)
				.fill(null)
				.map(col => {
					return {
						north: false,
						south: false,
						east: false,
						west: false,
					};
				}),
		);
	record[startRow][startCol][startDir] = true;
	const queue = [[startRow, startCol, startDir]];
	while (queue.length > 0) {
		const [row, col, dir] = queue.shift();
		const tile = map[row][col];
		if (tile === '.') {
			const [newRow, newCol] = move(row, col, dir);
			if (!outOfBound([newRow, newCol], map) && !record[newRow][newCol][dir]) {
				record[newRow][newCol][dir] = true;
				queue.push([newRow, newCol, dir]);
			}
		} else if (tile === '/' || tile === '\\') {
			const newDir = turn(dir, tile);
			const [newRow, newCol] = move(row, col, newDir);
			if (
				!outOfBound([newRow, newCol], map) &&
				!record[newRow][newCol][newDir]
			) {
				record[newRow][newCol][newDir] = true;
				queue.push([newRow, newCol, newDir]);
			}
		} else if (tile === '-' || tile === '|') {
			const newDirArr = split(dir, tile);
			for (let i = 0; i < newDirArr.length; i++) {
				const [newRow, newCol] = move(row, col, newDirArr[i]);
				if (
					!outOfBound([newRow, newCol], map) &&
					!record[newRow][newCol][newDirArr[i]]
				) {
					record[newRow][newCol][newDirArr[i]] = true;
					queue.push([newRow, newCol, newDirArr[i]]);
				}
			}
		}
	}

	let ans = 0;
	for (let r = 0; r < record.length; r++) {
		for (let c = 0; c < record[r].length; c++) {
			if (Object.values(record[r][c]).includes(true)) {
				ans += 1;
			}
		}
	}
	return ans;
}

function part2(map) {
	let maxValue = -1;
	let inputCombos = [];
	for (let c = 0; c < map[0].length; c++) {
		inputCombos.push([0, c, 'south']);
		inputCombos.push([map.length - 1, c, 'north']);
	}
	for (let r = 0; r < map.length; r++) {
		inputCombos.push([r, 0, 'east']);
		inputCombos.push([r, map[0].length - 1, 'west']);
	}
	for (let i = 0; i < inputCombos.length; i++) {
		maxValue = Math.max(maxValue, part1(map, inputCombos[i]));
	}
	return maxValue;
}

function move(row, col, dir) {
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

function turn(dir, tile) {
	if (tile === '/') {
		if (dir === 'east') return 'north';
		if (dir === 'north') return 'east';
		if (dir === 'west') return 'south';
		if (dir === 'south') return 'west';
	}
	if (tile === '\\') {
		if (dir === 'east') return 'south';
		if (dir === 'south') return 'east';
		if (dir === 'west') return 'north';
		if (dir === 'north') return 'west';
	}
}

function split(dir, tile) {
	if (tile === '-') {
		if (dir === 'east' || dir === 'west') return [dir];
		if (dir === 'north' || dir === 'south') return ['west', 'east'];
	}
	if (tile === '|') {
		if (dir === 'east' || dir === 'west') return ['north', 'south'];
		if (dir === 'north' || dir === 'south') return [dir];
	}
}

function outOfBound([r, c], map) {
	if (r < 0 || r >= map.length || c < 0 || c >= map[0].length) {
		return true;
	}
	return false;
}

day16();
