const fs = require('fs');

function day14() {
	const input = fs.readFileSync('./day14.txt').toString().split('\n');
	console.log('part 1');
	const [ans] = part1(input, 'north');
	console.log(ans);
	console.log('part 2');
	console.log(part2(input));
}

function part1(input, direction) {
	let ans = 0;
	const platform = [...input].map(line => line.split(''));

	for (let r = 0; r < platform.length; r++) {
		for (let c = 0; c < platform[r].length; c++) {
			const pointerR = direction !== 'south' ? r : platform.length - r - 1;
			const pointerC = direction !== 'east' ? c : platform[0].length - c - 1;
			if (['#', '.'].includes(platform[pointerR][pointerC])) {
				continue;
			}
			let pointer;
			if (direction === 'north' || direction === 'south') {
				pointer = pointerR;
			} else if (direction === 'east' || direction === 'west') {
				pointer = pointerC;
			}
			while (true) {
				if (direction === 'north' || direction === 'west') {
					pointer -= 1;
				} else if (direction === 'east' || direction === 'south') {
					pointer += 1;
				}

				if (direction === 'north') {
					if (pointer < 0 || ['O', '#'].includes(platform[pointer][pointerC])) {
						pointer += 1;
						break;
					}
				} else if (direction === 'south') {
					if (
						pointer >= platform.length ||
						['O', '#'].includes(platform[pointer][pointerC])
					) {
						pointer -= 1;
						break;
					}
				} else if (direction === 'east') {
					if (
						pointer >= platform[0].length ||
						['O', '#'].includes(platform[pointerR][pointer])
					) {
						pointer -= 1;
						break;
					}
				} else if (direction === 'west') {
					if (pointer < 0 || ['O', '#'].includes(platform[pointerR][pointer])) {
						pointer += 1;
						break;
					}
				}
			}

			if (direction === 'north' || direction === 'south') {
				if (pointer !== pointerR) {
					platform[pointer][pointerC] = 'O';
					platform[pointerR][pointerC] = '.';
				}
			} else if (direction === 'east' || direction === 'west') {
				if (pointer !== pointerC) {
					platform[pointerR][pointer] = 'O';
					platform[pointerR][pointerC] = '.';
				}
			}

			if (direction === 'north' || direction === 'south') {
				ans += input.length - pointer;
			} else if (direction === 'east' || direction === 'west') {
				ans += input.length - pointerR;
			}
		}
	}

	return [ans, platform.map(row => row.join(''))];
}

function part2(input) {
	let platform = [...input];
	let ans;
	const TARGET = 1_000_000_000 - 1;
	const DIR = ['north', 'west', 'south', 'east'];
	const ansMap = new Map();
	let cycle = 0;
	while (true) {
		for (let d = 0; d < DIR.length; d++) {
			[ans, platform] = part1(platform, DIR[d]);
		}
		const key = platform.join('');
		if (!ansMap.has(key)) {
			ansMap.set(key, [ans, cycle]);
		} else {
			const [oldAns, oldCycle] = ansMap.get(key);
			const cycleLength = cycle - oldCycle;
			const remaining = (TARGET - oldCycle) % cycleLength;
			const targetCycle = oldCycle + remaining;
			let ans;
			ansMap.forEach((value, key) => {
				if (value[1] === targetCycle) {
					ans = value[0];
				}
			});
			return ans;
		}
		cycle += 1;
	}
}

day14();
