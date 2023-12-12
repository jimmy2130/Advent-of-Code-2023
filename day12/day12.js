const fs = require('fs');

function day12() {
	const input = fs
		.readFileSync('./day12.txt')
		.toString()
		.split('\n')
		.map(line => line.split(' '));
	// console.log('part 1');
	// const sum = part1(input);
	// console.log(sum.reduce((acc, cur) => acc + cur, 0));
	// console.log('part 2');
	// console.log(part2(input, sum));
	console.log('part 1 Retry');
	console.log(part1Retry(input));
	console.log('part 2 Retry');
	console.log(part2Retry(input));
}

const CONTROL = 1;

function part1(input) {
	const sum = [];
	for (let i = 0; i < input.length; i++) {
		const [puzzle, list] = input[i];
		const ans = dfs(
			puzzle,
			list.split(',').map(el => Number(el)),
			0,
		);
		sum.push(ans);
		// console.log({ i, sum });
	}
	return sum;
}

function part2(input, sum) {
	let part2Ans = 0;
	// let isCompleted = new Set();
	// for (let i = 0; i < input.length; i++) {
	// 	console.log(i + 1);
	// 	const [puzzle, list] = input[i];
	// 	const newPuzzle = Array(2).fill(puzzle).join('?');
	// 	const newList = Array(2)
	// 		.fill(list)
	// 		.join(',')
	// 		.split(',')
	// 		.map(el => Number(el));
	// 	const ans = dfs(newPuzzle, newList, 0);

	// 	if (ans % sum[i] === 0) {
	// 		const multiplier = ans / sum[i];
	// 		part2Ans += sum[i] * Math.pow(multiplier, 4);
	// 		isCompleted.add(i);
	// 	}
	// }

	for (let i = 0; i < 1; i++) {
		console.log(i + 1);
		// console.log(input[i]);
		// if (isCompleted.has(i)) {
		// 	continue;
		// }
		const [puzzle, list] = input[i];
		const newPuzzle = Array(2).fill(puzzle).join('?');
		const newList = Array(2)
			.fill(list)
			.join(',')
			.split(',')
			.map(el => Number(el));

		if (newPuzzle.split('').every(char => char === '?')) {
			const leastCodeNum = newList.reduce((acc, cur) => acc + cur + 1, 0) - 1;
			const totalPuzzleNum = newPuzzle.length;
			const puzzleToThrow = totalPuzzleNum - leastCodeNum;
			const numerator = new Set();
			const denominator = new Set();
			getNumerator(numerator, newList.length + 1, puzzleToThrow);
			getDenominator(numerator, denominator, puzzleToThrow);
			part2Ans += calculate(numerator, denominator);
			continue;
		}

		const puzzleParts = newPuzzle.split('.').filter(el => el !== '');
		const puzzleMap = {};

		for (let j = 0; j < puzzleParts.length; j++) {
			const listRecord = new Set();
			puzzleMap[puzzleParts[j]] = [];

			for (let leftPointer = 0; leftPointer < newList.length; leftPointer++) {
				for (
					let rightPointer = leftPointer + 1;
					rightPointer <= newList.length;
					rightPointer++
				) {
					const subList = newList.slice(leftPointer, rightPointer);

					if (listRecord.has(subList.join(','))) {
						continue;
					} else {
						listRecord.add(subList.join(','));
					}

					const puzzlePartAns = dfs(puzzleParts[j], subList, 0);
					if (puzzlePartAns !== 0) {
						puzzleMap[puzzleParts[j]].push([subList.join(','), puzzlePartAns]);
					}
				}
			}

			if (!puzzleParts[j].includes('#')) {
				puzzleMap[puzzleParts[j]].push(['', 1]);
			}
		}

		// console.log({ puzzleMap });

		const ans = dfs2(puzzleParts, puzzleMap, 0, newList, 0);
		console.log(ans);
		part2Ans += ans;
	}
	return part2Ans;
}

function dfs2(puzzleParts, puzzleMap, puzzlePartsIndex, list, listIndex) {
	if (puzzlePartsIndex === puzzleParts.length) {
		if (listIndex === list.length) {
			return 1;
		} else if (listIndex < list.length) {
			return 0;
		} else {
			throw new Error('listIndex > list.length');
		}
	}

	const puzzlePart = puzzleParts[puzzlePartsIndex];
	const map = puzzleMap[puzzlePart];
	let ans = 0;
	for (let i = 0; i < map.length; i++) {
		let [subList, combinations] = map[i];
		let subListArr = [];
		if (subList !== '') {
			subListArr = subList.split(',');
		}
		if (
			listIndex + subListArr.length <= list.length &&
			list.slice(listIndex, listIndex + subListArr.length).join(',') === subList
		) {
			ans +=
				combinations *
				dfs2(
					puzzleParts,
					puzzleMap,
					puzzlePartsIndex + 1,
					list,
					listIndex + subListArr.length,
				);
		}
	}
	return ans;
}

function dfs(puzzle, list, index) {
	if (index === puzzle.length) {
		const nums = getNums(puzzle);
		if (nums.length !== list.length) {
			return 0;
		}
		for (let i = 0; i < nums.length; i++) {
			if (nums[i] !== list[i]) {
				return 0;
			}
		}
		return 1;
	}
	if (puzzle[index] === '#' || puzzle[index] === '.') {
		return dfs(puzzle, list, index + 1);
	}

	const damaged = puzzle.slice(0, index) + '#' + puzzle.slice(index + 1);

	let ans2 = checkStatus(damaged, list);
	if (ans2 !== 0 && ans2 !== 1) {
		ans2 = dfs(damaged, list, index + 1);
	}

	const operational = puzzle.slice(0, index) + '.' + puzzle.slice(index + 1);

	let ans1 = checkStatus(operational, list);
	if (ans1 !== 0 && ans1 !== 1) {
		ans1 = dfs(operational, list, index + 1);
	}

	// return dfs(operational, list, index + 1) + dfs(damaged, list, index + 1);

	return ans1 + ans2;
}

function getNums(puzzle) {
	const nums = [];
	let num = 0;
	for (let i = 0; i < puzzle.length; i++) {
		if (puzzle[i] === '#') {
			num += 1;
		} else if (puzzle[i] === '.') {
			if (num !== 0) {
				nums.push(num);
				num = 0;
			}
		} else if (puzzle[i] === '?') {
			return nums;
		}
	}
	if (num !== 0) {
		nums.push(num);
	}
	return nums;
}

function checkStatus(puzzle, list) {
	const nums = getNums(puzzle);
	if (nums.length > list.length) {
		return 0;
	}
	for (let i = 0; i < nums.length; i++) {
		if (nums[i] !== list[i]) {
			return 0;
		}
	}
	return 'valid';
}

function getNumerator(numerator, start, count) {
	for (let i = start; i < start + count; i++) {
		numerator.add(i);
	}
}

function getDenominator(numerator, denominator, count) {
	for (let i = 1; i <= count; i++) {
		if (numerator.has(i)) {
			numerator.delete(i);
		} else {
			denominator.add(i);
		}
	}
}

function calculate(numerator, denominator) {
	let up = 1;
	numerator.forEach(value => (up = up * value));
	let down = 1;
	denominator.forEach(value => (down = down * value));
	return up / down;
}

function part1Retry(input) {
	let sum = 0;
	for (let i = 0; i < input.length; i++) {
		const [puzzle, list] = input[i];
		const ans = dfs3(
			puzzle,
			list.split(',').map(el => Number(el)),
			new Map(),
		);
		sum += ans;
	}
	return sum;
}

function part2Retry(input) {
	let sum = 0;
	for (let i = 0; i < input.length; i++) {
		const [puzzle, list] = input[i];
		const ans = dfs3(
			Array(5).fill(puzzle).join('?'),
			Array(5)
				.fill(list)
				.join(',')
				.split(',')
				.map(el => Number(el)),
			new Map(),
		);
		sum += ans;
	}
	return sum;
}

function dfs3(puzzle, list, memo) {
	const key = JSON.stringify([puzzle, list]);
	if (memo.has(key)) {
		return memo.get(key);
	}

	if (puzzle.length === 0) {
		if (list.length === 0) {
			return 1;
		}
		return 0;
	}

	if (list.length === 0) {
		if (puzzle.includes('#')) {
			return 0;
		}
		return 1;
	}

	if (puzzle.length < list.reduce((acc, cur) => acc + cur + 1, 0) - 1) {
		return 0;
	}

	if (puzzle[0] === '.') {
		return dfs3(puzzle.slice(1), list, memo);
	}

	if (puzzle[0] === '#') {
		const [firstGroup, ...restGroups] = list;
		for (let i = 0; i < firstGroup; i++) {
			if (puzzle[i] === '.') {
				return 0;
			}
		}
		if (puzzle[firstGroup] === '#') {
			return 0;
		}
		return dfs3(puzzle.slice(firstGroup + 1), restGroups, memo);
	}

	// puzzle[0] === '?'
	const ans =
		dfs3('#' + puzzle.slice(1), list, memo) +
		dfs3('.' + puzzle.slice(1), list, memo);
	memo.set(key, ans);
	return ans;
}

day12();
