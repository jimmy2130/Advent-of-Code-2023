const fs = require('fs');

function day20() {
	const input = fs.readFileSync('./day20.txt').toString().split('\n');
	const modules = parseModules(input);

	console.log('part 1');
	console.log(part1(modules));
	console.log('part 2');
	console.log(part2(modules));
}

function parseModules(input) {
	const modules = {};
	modules['button'] = {
		type: 'button',
	};
	for (let i = 0; i < input.length; i++) {
		const [target, destinations] = input[i].split(' -> ');
		if (target === 'broadcaster') {
			modules[target] = {
				type: 'broadcaster',
				target: destinations.split(', '),
			};
		} else if (target[0] === '%') {
			modules[target.slice(1)] = {
				type: 'flip-flop',
				target: destinations.split(', '),
				state: 0,
			};
		} else if (target[0] === '&') {
			modules[target.slice(1)] = {
				type: 'conjunction',
				target: destinations.split(', '),
				state: {},
			};
		}
	}
	for (let i = 0; i < input.length; i++) {
		const [target, str] = input[i].split(' -> ');
		const destinations = str.split(', ');
		for (let j = 0; j < destinations.length; j++) {
			const destination = destinations[j];
			if (!(destination in modules)) {
				modules[destination] = {
					type: 'testing',
				};
			} else if (modules[destination].type === 'conjunction') {
				modules[destination].state[target.slice(1)] = 0;
			}
		}
	}
	return modules;
}

function part1(input) {
	const modules = JSON.parse(JSON.stringify(input));
	let lowPulses = 0;
	let highPulses = 0;
	for (let buttonPress = 0; buttonPress < 1000; buttonPress++) {
		[lowPulses, highPulses] = simulate(modules, lowPulses, highPulses);
	}
	return lowPulses * highPulses;
}

function simulate(modules, lowPulses, highPulses) {
	const queue = [{ pulseState: 0, pulsePosition: 'button', pulseFrom: '' }];
	while (queue.length > 0) {
		const { pulseState, pulsePosition, pulseFrom } = queue.shift();
		const module = modules[pulsePosition];
		if (module.type === 'testing') {
			continue;
		} else if (module.type === 'button') {
			queue.push({
				pulseState: 0,
				pulsePosition: 'broadcaster',
				pulseFrom: 'button',
			});
			lowPulses += 1;
		} else if (module.type === 'broadcaster') {
			queue.push(
				...module.target.map(target => {
					return {
						pulseState,
						pulsePosition: target,
						pulseFrom: 'broadcaster',
					};
				}),
			);
			if (pulseState === 0) {
				lowPulses += module.target.length;
			} else {
				highPulses += module.target.length;
			}
		} else if (module.type === 'conjunction') {
			module.state[pulseFrom] = pulseState;
			const sendPulse = Object.values(module.state).every(el => el === 1)
				? 0
				: 1;
			queue.push(
				...module.target.map(target => {
					return {
						pulseState: sendPulse,
						pulsePosition: target,
						pulseFrom: pulsePosition,
					};
				}),
			);
			if (sendPulse === 0) {
				lowPulses += module.target.length;
			} else {
				highPulses += module.target.length;
			}
		} else if (module.type === 'flip-flop') {
			if (pulseState === 1) {
				continue;
			}
			module.state = module.state === 0 ? 1 : 0;
			queue.push(
				...module.target.map(target => {
					return {
						pulseState: module.state,
						pulsePosition: target,
						pulseFrom: pulsePosition,
					};
				}),
			);
			if (module.state === 0) {
				lowPulses += module.target.length;
			} else {
				highPulses += module.target.length;
			}
		}
	}
	return [lowPulses, highPulses];
}

function part2(input) {
	let ans = 1;
	let modules = JSON.parse(JSON.stringify(input));
	const finalConjunction = Object.keys(modules).find(key =>
		modules[key].target?.includes('rx'),
	);
	const keyConjunctions = Object.keys(modules[finalConjunction].state);

	for (let i = 0; i < keyConjunctions.length; i++) {
		modules = JSON.parse(JSON.stringify(input));
		let buttonPress = 0;
		while (true) {
			buttonPress += 1;
			if (simulate2(modules, keyConjunctions[i], finalConjunction)) {
				ans = lcm(ans, buttonPress);
				break;
			}
		}
	}
	return ans;
	// return [4051, 4021, 4057, 3833].reduce((acc, cur) => lcm(acc, cur), 1);
}

function simulate2(modules, key, finalKey) {
	const queue = [{ pulseState: 0, pulsePosition: 'button', pulseFrom: '' }];
	const output = [];
	const logs = [];
	while (queue.length > 0) {
		const { pulseState, pulsePosition, pulseFrom } = queue.shift();
		const module = modules[pulsePosition];
		if (module.type === 'testing') {
			output.push({ pulseState });
		} else if (module.type === 'button') {
			queue.push({
				pulseState: 0,
				pulsePosition: 'broadcaster',
				pulseFrom: 'button',
			});
			logs.push('button -0-> broadcaster');
		} else if (module.type === 'broadcaster') {
			queue.push(
				...module.target.map(target => {
					return {
						pulseState,
						pulsePosition: target,
						pulseFrom: 'broadcaster',
					};
				}),
			);
			logs.push(
				...module.target.map(
					target => `broadcaster -${pulseState}-> ${target}`,
				),
			);
		} else if (module.type === 'conjunction') {
			module.state[pulseFrom] = pulseState;
			const sendPulse = Object.values(module.state).every(el => el === 1)
				? 0
				: 1;
			queue.push(
				...module.target.map(target => {
					return {
						pulseState: sendPulse,
						pulsePosition: target,
						pulseFrom: pulsePosition,
					};
				}),
			);
			logs.push(
				...module.target.map(
					target => `${pulsePosition} -${sendPulse}-> ${target}`,
				),
			);
		} else if (module.type === 'flip-flop') {
			if (pulseState === 1) {
				continue;
			}
			module.state = module.state === 0 ? 1 : 0;
			queue.push(
				...module.target.map(target => {
					return {
						pulseState: module.state,
						pulsePosition: target,
						pulseFrom: pulsePosition,
					};
				}),
			);
			logs.push(
				...module.target.map(
					target => `${pulsePosition} -${module.state}-> ${target}`,
				),
			);
		}
	}

	let done = false;
	if (logs.includes(`${key} -1-> ${finalKey}`)) {
		done = true;
	}
	return done;
}

function gcd(a, b) {
	while (b !== 0) {
		const temp = b;
		b = a % b;
		a = temp;
	}
	return a;
}

function lcm(a, b) {
	return (a * b) / gcd(a, b);
}

day20();
