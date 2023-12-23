const fs = require('fs');

function day23() {
	const input = fs.readFileSync('./day23.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(map) {
	return dfs(map, [0, 1], [encode(map, 0, 1)], 0);
}

function dfs(map, [r, c], record, steps) {
	if (r === map.length - 1 && c === map[0].length - 2) {
		return steps;
	}
	const DIR = [
		[0, 1],
		[1, 0],
		[0, -1],
		[-1, 0],
	];
	let maxAns = -1;

	for (let i = 0; i < DIR.length; i++) {
		const [dr, dc] = DIR[i];
		const [exploreR, exploreC] = [r + dr, c + dc];
		if (outOfBound(map, [exploreR, exploreC])) {
			continue;
		}
		if (record.includes(encode(map, exploreR, exploreC))) {
			continue;
		}
		if (map[exploreR][exploreC] === '#') {
			continue;
		}
		if (map[exploreR][exploreC] === '<' && i === 0) {
			continue;
		}
		if (map[exploreR][exploreC] === '^' && i === 1) {
			continue;
		}
		if (map[exploreR][exploreC] === '>' && i === 2) {
			continue;
		}
		if (map[exploreR][exploreC] === 'v' && i === 3) {
			continue;
		}
		maxAns = Math.max(
			maxAns,
			dfs(
				map,
				[exploreR, exploreC],
				[...record, encode(map, exploreR, exploreC)],
				steps + 1,
			),
		);
	}
	return maxAns;
}

function outOfBound(map, [r, c]) {
	if (r < 0 || c < 0 || r >= map.length || c >= map[0].length) {
		return true;
	}
	return false;
}

function encode(map, r, c) {
	return r * map.length + c;
}

function decode(map, num) {
	const c = num % map.length;
	const r = (num - c) / map.length;
	return [r, c];
}

function part2(initialMap) {
	let newMap = new Map();
	const targetKey = encode(
		initialMap,
		initialMap.length - 1,
		initialMap.length - 2,
	);
	newMap.set(encode(initialMap, 0, 1), new Map());
	getCities(initialMap, newMap);
	newMap.set(targetKey, new Map());

	newMap.forEach((_, key) =>
		getEdges(initialMap, newMap, decode(initialMap, key), 0, key, [key]),
	);

	const convertTable = new Map();
	let index = 0;
	newMap.forEach((_, key) => {
		convertTable.set(key, index);
		index += 1;
	});

	const temp = new Map();
	newMap.forEach((value, key) => {
		temp.set(convertTable.get(key), new Map());
		value.forEach((distance, subKey) => {
			temp.get(convertTable.get(key)).set(convertTable.get(subKey), distance);
		});
	});
	newMap = temp;

	return findLongestPath(newMap, 0, newMap.size - 1, [0], 0, new Map());
}

function getCities(initialMap, newMap) {
	const DIR = [
		[0, 1],
		[1, 0],
		[0, -1],
		[-1, 0],
	];
	for (let r = 1; r < initialMap.length - 1; r++) {
		for (let c = 1; c < initialMap[r].length - 1; c++) {
			if (initialMap[r][c] === '#') {
				continue;
			}
			let blockCount = 0;
			for (let i = 0; i < DIR.length; i++) {
				const [dr, dc] = DIR[i];
				const [exploreR, exploreC] = [r + dr, c + dc];
				if (initialMap[exploreR][exploreC] === '#') {
					blockCount += 1;
				}
			}
			if (blockCount < 2) {
				newMap.set(encode(initialMap, r, c), new Map());
			}
		}
	}
}

function getEdges(initialMap, newMap, [r, c], steps, oldKey, record) {
	const newKey = encode(initialMap, r, c);
	if (newMap.has(newKey) && newKey !== oldKey) {
		newMap.get(newKey).set(oldKey, steps);
		newMap.get(oldKey).set(newKey, steps);
		return;
	}
	const DIR = [
		[0, 1],
		[1, 0],
		[0, -1],
		[-1, 0],
	];
	for (let i = 0; i < DIR.length; i++) {
		const [dr, dc] = DIR[i];
		const [exploreR, exploreC] = [r + dr, c + dc];
		if (outOfBound(initialMap, [exploreR, exploreC])) {
			continue;
		}
		if (record.includes(encode(initialMap, exploreR, exploreC))) {
			continue;
		}
		if (initialMap[exploreR][exploreC] === '#') {
			continue;
		}
		getEdges(initialMap, newMap, [exploreR, exploreC], steps + 1, oldKey, [
			...record,
			encode(initialMap, exploreR, exploreC),
		]);
	}
}

function findLongestPath(newMap, currentKey, targetKey, record, steps, memo) {
	if (currentKey === targetKey) {
		return steps;
	}

	const memoKey = hashKey(currentKey, record, newMap);
	if (memo.has(memoKey)) {
		return steps + memo.get(memoKey);
	}

	let maxValue = -Infinity;
	newMap.get(currentKey).forEach((distance, key) => {
		if (!record.includes(key)) {
			maxValue = Math.max(
				maxValue,
				findLongestPath(
					newMap,
					key,
					targetKey,
					[...record, key],
					steps + distance,
					memo,
				),
			);
		}
	});

	memo.set(memoKey, maxValue - steps);
	return maxValue;
}

function hashKey(currentKey, record, newMap) {
	const arr = Array(newMap.size).fill(0);
	for (let i = 0; i < record.length; i++) {
		arr[record[i]] = 1;
	}
	return arr.join('') + currentKey.toString();
}

day23();
