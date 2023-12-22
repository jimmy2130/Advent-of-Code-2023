const fs = require('fs');

function day22() {
	const input = fs
		.readFileSync('./day22.txt')
		.toString()
		.split('\n')
		.map(line => {
			return line
				.split('~')
				.map(brick => brick.split(',').map(el => parseInt(el)));
		});
	console.log('part 1');
	const [part1Ans, part2Ans] = solve(input);
	console.log(part1Ans);
	console.log('part 2');
	console.log(part2Ans);
}

// size: [10, 10, 400]

function solve(input) {
	const bricks = JSON.parse(JSON.stringify(input)).sort(
		([startA, endA], [startB, endB]) => {
			const aLowestPoint = Math.min(startA[2], endA[2]);
			const bLowestPoint = Math.min(startB[2], endB[2]);
			return aLowestPoint - bLowestPoint;
		},
	);
	const stableBricks = [];
	const record = Array(10)
		.fill(null)
		.map(x =>
			Array(10)
				.fill(null)
				.map(y => Array(400).fill(false)),
		);
	// create stableBricks
	for (let i = 0; i < bricks.length; i++) {
		// try to fall down
		const [start, end] = bricks[i];
		const [dropStart, dropEnd] = dropDown(start, end, record);
		// record it, push it into stableBricks
		stableBricks.push([dropStart, dropEnd]);
		toggle(dropStart, dropEnd, record, true);
	}

	// count bricks that can be disintegrated
	let ans = 0;
	for (let i = 0; i < stableBricks.length; i++) {
		const [start, end] = stableBricks[i];
		toggle(start, end, record, false);

		let pass = true;
		for (let j = 0; j < stableBricks.length; j++) {
			if (i === j) {
				continue;
			}
			const [otherStart, otherEnd] = stableBricks[j];
			const [dropStart] = dropDown(otherStart, otherEnd, record);
			const [otherX, otherY, otherZ] = otherStart;
			const [dropX, dropY, dropZ] = dropStart;

			if (otherX !== dropX || otherY !== dropY || otherZ !== dropZ) {
				pass = false;
				break;
			}
		}
		if (pass) {
			ans += 1;
		}
		toggle(start, end, record, true);
	}

	// part 2 continue...
	let ans2 = 0;
	for (let i = 0; i < stableBricks.length; i++) {
		const [start, end] = stableBricks[i];
		toggle(start, end, record, false);
		const actions = [];

		for (let j = i + 1; j < stableBricks.length; j++) {
			const [otherStart, otherEnd] = stableBricks[j];
			const [dropStart, dropEnd] = dropDown(otherStart, otherEnd, record);
			// repaint record
			toggle(otherStart, otherEnd, record, false);
			toggle(dropStart, dropEnd, record, true);
			actions.push([otherStart, otherEnd, false]);
			actions.push([dropStart, dropEnd, true]);
			// count ans2
			const [otherX, otherY, otherZ] = otherStart;
			const [dropX, dropY, dropZ] = dropStart;

			if (otherX !== dropX || otherY !== dropY || otherZ !== dropZ) {
				ans2 += 1;
			}
		}
		// reverse previous actions
		for (let a = actions.length - 1; a >= 0; a--) {
			const [actionStart, actionEnd, value] = actions[a];
			toggle(actionStart, actionEnd, record, !value);
		}
		toggle(start, end, record, true);
	}

	return [ans, ans2];
}

function dropDown([startX, startY, startZ], [endX, endY, endZ], record) {
	while (true) {
		if (startZ === endZ) {
			// if brick lies down
			let isDropable = true;
			for (let x = startX; x <= endX; x++) {
				for (let y = startY; y <= endY; y++) {
					if (record[x][y][startZ - 1] === true || startZ - 1 === 0) {
						isDropable = false;
						break;
					}
				}
				if (isDropable === false) {
					break;
				}
			}
			if (isDropable === true) {
				startZ -= 1;
				endZ -= 1;
			} else {
				break;
			}
		} else {
			// if brick stands up
			if (record[startX][startY][startZ - 1] === false && startZ - 1 >= 1) {
				startZ -= 1;
				endZ -= 1;
			} else {
				break;
			}
		}
	}
	return [
		[startX, startY, startZ],
		[endX, endY, endZ],
	];
}

function toggle(
	[startX, startY, startZ],
	[endX, endY, endZ],
	record,
	toggleValue,
) {
	for (let x = startX; x <= endX; x++) {
		for (let y = startY; y <= endY; y++) {
			for (let z = startZ; z <= endZ; z++) {
				record[x][y][z] = toggleValue;
			}
		}
	}
}

day22();
