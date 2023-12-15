const fs = require('fs');

function day15() {
	const input = fs.readFileSync('./day15.txt').toString();
	console.log('part 1');
	console.log(part1(input));
	console.log('part 2');
	console.log(part2(input));
}

function part1(input) {
	const steps = input.split(',');
	return steps.reduce((acc, cur) => acc + hash(cur), 0);
}

function part2(input) {
	const steps = input.split(',');
	const boxes = Array(256)
		.fill(null)
		.map(_ => []);
	const record = new Set();

	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		if (step.includes('=')) {
			const [stepLabel, numStr] = step.split('=');
			const boxIndex = hash(stepLabel);
			const focalLength = Number(numStr);
			if (!record.has(stepLabel)) {
				record.add(stepLabel);
				boxes[boxIndex].push([stepLabel, focalLength]);
			} else {
				let lenIndex = boxes[boxIndex].findIndex(
					([label]) => label === stepLabel,
				);
				boxes[boxIndex][lenIndex][1] = focalLength;
			}
		} else if (step.includes('-')) {
			const stepLabel = step.slice(0, -1);
			record.delete(stepLabel);
			const boxIndex = hash(stepLabel);
			boxes[boxIndex] = boxes[boxIndex].filter(
				([label]) => label !== stepLabel,
			);
		}
	}

	let ans = 0;
	for (let i = 0; i < boxes.length; i++) {
		for (let j = 0; j < boxes[i].length; j++) {
			const [, focalLength] = boxes[i][j];
			ans += (i + 1) * (j + 1) * focalLength;
		}
	}
	return ans;
}

function hash(step) {
	let currentValue = 0;
	for (let i = 0; i < step.length; i++) {
		const asciiCode = step[i].charCodeAt(0);
		currentValue += asciiCode;
		currentValue *= 17;
		currentValue %= 256;
	}
	return currentValue;
}

day15();
