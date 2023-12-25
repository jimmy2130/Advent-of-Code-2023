const fs = require('fs');
const TEST_LOW = 7;
const TEST_HIGH = 27;
const REAL_LOW = 200000000000000;
const REAL_HIGH = 400000000000000;

function day24() {
	const input = fs
		.readFileSync('./day24.txt')
		.toString()
		.split('\n')
		.map(row => row.split(/, | @ /).map(el => Number(el)));

	console.log('part 1');
	console.log(part1(input, REAL_LOW, REAL_HIGH));
	console.log('part 2');
	console.log(part2(input));
	console.log('test');
	console.log(test(input));
}

function part1(input, lowBound, highBound) {
	let validPairs = 0;
	for (let i = 0; i < input.length; i++) {
		for (let j = i + 1; j < input.length; j++) {
			const [px1, py1, , vx1, vy1] = input[i];
			const [px2, py2, , vx2, vy2] = input[j];
			const [a1, b1] = [vy1 / vx1, py1 - (vy1 / vx1) * px1];
			const [a2, b2] = [vy2 / vx2, py2 - (vy2 / vx2) * px2];
			const x = (b2 - b1) / (a1 - a2);
			if (Number.isNaN(x) || x === Infinity) {
				continue;
			}
			const y = a1 * x + b1;
			if (x < lowBound || x > highBound || y < lowBound || y > highBound) {
				continue;
			}
			const [dx1, dy1] = [x - px1, y - py1];
			const [dx2, dy2] = [x - px2, y - py2];
			if (vx1 * dx1 < 0 || vy1 * dy1 < 0 || vx2 * dx2 < 0 || vy2 * dy2 < 0) {
				continue;
			}
			validPairs += 1;
		}
	}
	return validPairs;
}

function part2(input) {
	// solve ta, tb, tc using first three stones with MATLAB
	const ta = 281427954234;
	const tb = 487736179331;
	const tc = 637228617556;

	const [px1, py1, pz1, vx1, vy1, vz1] = input[0];
	const [px2, py2, pz2, vx2, vy2, vz2] = input[1];

	const pax = px1 + vx1 * ta;
	const pbx = px2 + vx2 * tb;
	const vx = (pbx - pax) / (tb - ta);
	const ansx = pax - ta * vx;

	const pay = py1 + vy1 * ta;
	const pby = py2 + vy2 * tb;
	const vy = (pby - pay) / (tb - ta);
	const ansy = pay - ta * vy;

	const paz = pz1 + vz1 * ta;
	const pbz = pz2 + vz2 * tb;
	const vz = (pbz - paz) / (tb - ta);
	const ansz = paz - ta * vz;

	return ansx + ansy + ansz;
}

function test(input) {
	let ans = -1;
	for (let i = 0; i < input.length; i++) {
		const [px, py, pz, vx, vy, vz] = input[i];
		// guess the answer
		const v = vx + vy + vz;
		const p = px + py + pz;

		// check if the answer is correct
		let pass = true;
		for (let j = 0; j < input.length; j++) {
			if (i === j) {
				continue;
			}
			const [px1, py1, pz1, vx1, vy1, vz1] = input[j];
			const time = (p - (px1 + py1 + pz1)) / (vx1 + vy1 + vz1 - v);
			if (time < 0 || !Number.isInteger(time)) {
				pass = false;
				break;
			}
		}
		if (pass) {
			ans = p;
		}
	}

	return ans;
}

day24();
