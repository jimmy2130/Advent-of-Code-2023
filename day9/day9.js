const fs = require('fs');

function day9() {
	const input = fs
		.readFileSync('./day9.txt')
		.toString()
		.split('\n')
		.map(line => line.split(' ').map(element => Number(element)));
	console.log('part 1');
	console.log(input.reduce((acc, cur) => acc + dfs(cur, 'part 1'), 0));
	console.log('part 2');
	console.log(input.reduce((acc, cur) => acc + dfs(cur, 'part 2'), 0));
}

function dfs(history, whichPart) {
	if (history.every(value => value === 0)) {
		return 0;
	}

	let sequence = [];
	for (let i = 1; i < history.length; i++) {
		sequence.push(history[i] - history[i - 1]);
	}

	if (whichPart === 'part 1') {
		return history.at(-1) + dfs(sequence, whichPart);
	} else if (whichPart === 'part 2') {
		return history[0] - dfs(sequence, whichPart);
	}
}

day9();
