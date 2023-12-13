const fs = require('fs');

function day13() {
	const input = fs
		.readFileSync('./day13.txt')
		.toString()
		.split('\n\n')
		.map(land => land.split('\n'));
	console.log('part 1');
	const answers = part1(input);
	console.log(answers.reduce((acc, cur) => acc + cur, 0));
	console.log('part 2');
	console.log(part2(input, answers));
}

function part1(lands) {
	const answers = [];
	for (let i = 0; i < lands.length; i++) {
		const land = lands[i];
		const ans = checkRowAndCol(land);
		if (ans.size === 1) {
			answers.push(Array.from(ans)[0]);
		}
	}
	return answers;
}

function part2(lands, oldAnswers) {
	let sum = 0;
	for (let i = 0; i < lands.length; i++) {
		for (let r = 0; r < lands[i].length; r++) {
			let hasFound = false;
			for (let c = 0; c < lands[i][r].length; c++) {
				const newLand = [...lands[i]];
				const insertSymbol = newLand[r][c] === '#' ? '.' : '#';
				newLand[r] =
					newLand[r].slice(0, c) + insertSymbol + newLand[r].slice(c + 1);
				const newAnsSet = checkRowAndCol(newLand);
				newAnsSet.delete(oldAnswers[i]);
				const newAnsArr = Array.from(newAnsSet);

				if (newAnsArr.length === 1) {
					sum += newAnsArr[0];
					hasFound = true;
					break;
				}
			}
			if (hasFound === true) {
				break;
			}
		}
	}
	return sum;
}

function checkRowAndCol(land) {
	let ans = new Set();
	for (let m = 1; m < land.length; m++) {
		let upPointer = m - 1;
		let downPointer = m;
		let hasMirror = true;
		while (upPointer >= 0 && downPointer < land.length) {
			if (land[upPointer] !== land[downPointer]) {
				hasMirror = false;
				break;
			}
			upPointer -= 1;
			downPointer += 1;
		}
		if (hasMirror === true) {
			ans.add(m * 100);
		}
	}
	for (let m = 1; m < land[0].length; m++) {
		let leftPointer = m - 1;
		let rightPointer = m;
		let hasMirror = true;
		while (leftPointer >= 0 && rightPointer < land[0].length) {
			if (getCol(land, leftPointer) !== getCol(land, rightPointer)) {
				hasMirror = false;
				break;
			}
			leftPointer -= 1;
			rightPointer += 1;
		}
		if (hasMirror === true) {
			ans.add(m);
		}
	}
	return ans;
}

function getCol(land, pointer) {
	return land.reduce((acc, cur) => acc + cur[pointer], '');
}

day13();
