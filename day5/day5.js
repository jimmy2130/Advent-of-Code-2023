const fs = require('fs');

function day5() {
	const input = fs.readFileSync('./day5.txt').toString().split('\n\n');
	const seeds = input[0]
		.split(': ')[1]
		.split(' ')
		.map(element => Number(element));
	const convertTable = input.slice(1).map(block =>
		block
			.split('\n')
			.slice(1)
			.map(line => line.split(' ').map(element => Number(element)))
			.sort((a, b) => a[1] - b[1]),
	);
	console.log('part 1');
	console.log(part1(seeds, convertTable));
	console.log('part 2');
	console.log(part2(seeds, convertTable));
}

function part1(seeds, convertTable) {
	let ans = Infinity;
	for (let i = 0; i < seeds.length; i++) {
		let input = seeds[i];
		for (let j = 0; j < convertTable.length; j++) {
			const row = convertTable[j];
			for (let k = 0; k < row.length; k++) {
				const [destination, source, range] = row[k];
				if (input >= source && input < source + range) {
					input = destination + (input - source);
					break;
				}
			}
		}
		ans = Math.min(ans, input);
	}
	return ans;
}

function part2(seeds, convertTable) {
	const queue = [];
	for (let i = 0; i < seeds.length; i = i + 2) {
		queue.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
	}
	let queueLength = queue.length;
	let convertIndex = 0;

	while (convertIndex < convertTable.length) {
		let [start, end] = queue.shift();
		queueLength -= 1;
		const rules = convertTable[convertIndex];

		for (let i = 0; i < rules.length; i++) {
			const [destination, source, range] = rules[i];
			if (i === 0 && end < source) {
				queue.push([start, end]);
				break;
			}
			if (start > source + range - 1) {
				if (i === rules.length - 1) {
					queue.push([start, end]);
				}
				continue;
			}
			if (start < source) {
				queue.push([start, source - 1]);
				start = source;
			}
			if (end <= source + range - 1) {
				queue.push([
					destination + (start - source),
					destination + (end - source),
				]);
				break;
			}
			if (end > source + range - 1) {
				queue.push([
					destination + (start - source),
					destination + (source + range - 1 - source),
				]);
				start = source + range;
			} else {
				throw new Error('impossible');
			}
		}

		if (queueLength === 0) {
			queueLength = queue.length;
			convertIndex += 1;
		}
	}

	return Math.min(...queue.map(([start]) => start));
}

day5();
