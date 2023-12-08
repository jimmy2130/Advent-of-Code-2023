const fs = require('fs');

function day8() {
	const input = fs.readFileSync('./day8.txt').toString().split('\n\n');
	const instruction = input[0];
	const nodes = input[1]
		.split('\n')
		.map(line => line.split(/ = \(|, |\)/).filter(x => x !== ''))
		.reduce((acc, cur) => {
			const [target, left, right] = cur;
			acc[target] = { left, right };
			return acc;
		}, {});

	console.log('part 1');
	console.log(simulate(instruction, nodes, 'AAA', 'part 1'));
	console.log('part 2');
	console.log(part2(instruction, nodes));
}

function simulate(instruction, nodes, currentPosition, whichPart) {
	let steps = 0;
	let pointer = 0;
	while (!endCheck(currentPosition, whichPart)) {
		let currentInstruction = instruction[pointer % instruction.length];
		pointer += 1;
		if (currentInstruction === 'R') {
			currentPosition = nodes[currentPosition]['right'];
		} else if (currentInstruction === 'L') {
			currentPosition = nodes[currentPosition]['left'];
		}
		steps += 1;
	}
	return steps;
}

function endCheck(str, whichPart) {
	if (whichPart === 'part 1') {
		return str === 'ZZZ';
	} else if (whichPart === 'part 2') {
		return str[2] === 'Z';
	}
}

function part2(instruction, nodes) {
	const steps = Object.keys(nodes)
		.filter(node => node[2] === 'A')
		.map(currentPosition =>
			simulate(instruction, nodes, currentPosition, 'part 2'),
		);

	return steps.reduce((acc, cur) => lcm(acc, cur), 1);
}

function gcd(a, b) {
	let temp = b;
	while (b !== 0) {
		b = a % b;
		a = temp;
		temp = b;
	}
	return a;
}

function lcm(a, b) {
	return (a * b) / gcd(a, b);
}

day8();
