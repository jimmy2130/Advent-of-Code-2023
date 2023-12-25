const fs = require('fs');

function day25() {
	const input = fs.readFileSync('./day25.txt').toString().split('\n');
	console.log('part 1');
	console.log(part1(input));
}

function createMap(input) {
	const map = {};
	for (let i = 0; i < input.length; i++) {
		const nodes = input[i].split(/: | /);
		nodes.forEach(node => {
			if (!(node in map)) {
				map[node] = [];
			}
		});
		const [subject, ...connections] = nodes;
		map[subject] = [...map[subject], ...connections];
		connections.forEach(connection => {
			map[connection] = [...map[connection], subject];
		});
	}
	return map;
}

function part1(input) {
	const map = createMap(input);
	// guess two nodes that come from different components
	const nodeA = Object.keys(map)[0];
	const nodeB = Object.keys(map).at(-1);
	const sets = [];
	// try to cut wires four times. The fourth time should fail
	for (let i = 0; i < 4; i++) {
		const record = new Set([nodeA]);
		const queue = [[nodeA]];
		let isOk = false;
		let route = [];
		while (queue.length > 0) {
			const node = queue.shift();
			const currentNode = node.at(-1);
			if (currentNode === nodeB) {
				route = node;
				isOk = true;
				break;
			}
			const canVisitNodes = map[currentNode];
			for (let j = 0; j < canVisitNodes.length; j++) {
				if (!record.has(canVisitNodes[j])) {
					record.add(canVisitNodes[j]);
					queue.push([...node, canVisitNodes[j]]);
				}
			}
		}
		if (isOk === false && i !== 3) {
			throw new Error(`fail: ${i}`);
		}
		if (isOk === true && i === 3) {
			throw new Error(`wrong nodeB, need another one`);
		}
		if (isOk === false && i === 3) {
			break;
		}

		// cut down wires
		for (let j = 0; j < route.length - 1; j++) {
			const node = route[j];
			const nextNode = route[j + 1];
			map[node] = map[node].filter(x => x !== nextNode);
			map[nextNode] = map[nextNode].filter(x => x !== node);
		}
	}

	const visited = new Set([nodeA]);
	const queue = [nodeA];

	while (queue.length > 0) {
		const currentNode = queue.shift();
		const canVisitNodes = map[currentNode];

		for (let j = 0; j < canVisitNodes.length; j++) {
			if (!visited.has(canVisitNodes[j])) {
				visited.add(canVisitNodes[j]);
				queue.push(canVisitNodes[j]);
			}
		}
	}

	return visited.size * (Object.keys(map).length - visited.size);
}

day25();
