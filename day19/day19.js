const fs = require('fs');

function day19() {
	const input = fs.readFileSync('./day19.txt').toString().split('\n\n');
	const workflows = parseWorkflows(input[0]);
	const parts = parseParts(input[1]);

	console.log('part 1');
	console.log(part1(workflows, parts));
	console.log('part 2');
	console.log(part2(workflows));
}

function parseWorkflows(inputStr) {
	const input = inputStr.split('\n');
	const workflows = {};
	for (let i = 0; i < input.length; i++) {
		const [workflowName, workflow] = input[i].split(/{|}/);
		const rules = workflow.split(',').map(rule => rule.split(':'));
		workflows[workflowName] = rules;
	}
	return workflows;
}

function parseParts(inputStr) {
	const input = inputStr.split('\n');
	const parts = [];
	for (let i = 0; i < input.length; i++) {
		const [x, m, a, s] = input[i]
			.split(/{x=|,m=|,a=|,s=|}/)
			.filter(el => el !== '')
			.map(el => Number(el));
		parts.push({
			x,
			m,
			a,
			s,
		});
	}
	return parts;
}

function part1(workflows, parts) {
	let ans = 0;
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		let currentWorkflow = 'in';
		while (true) {
			const workflow = workflows[currentWorkflow];
			for (let j = 0; j < workflow.length; j++) {
				if (j === workflow.length - 1) {
					currentWorkflow = workflow[j][0];
					continue;
				}
				const [rule, targetWorkflow] = workflow[j];
				const subject = rule[0];
				const symbol = rule[1];
				const limit = Number(rule.slice(2));

				if (symbol === '<') {
					if (part[subject] < limit) {
						currentWorkflow = targetWorkflow;
						break;
					}
				} else if (symbol === '>') {
					if (part[subject] > limit) {
						currentWorkflow = targetWorkflow;
						break;
					}
				} else {
					throw new Error(`unknown symbol: ${symbol}`);
				}
			}
			if (currentWorkflow === 'A') {
				ans += Object.values(part).reduce((acc, cur) => acc + cur, 0);
				break;
			}
			if (currentWorkflow === 'R') {
				break;
			}
		}
	}
	return ans;
}

function part2(workflows) {
	return dfs(workflows, 'in', {
		x: [1, 4000],
		m: [1, 4000],
		a: [1, 4000],
		s: [1, 4000],
	});
}

function dfs(workflows, currentWorkflow, partRange) {
	if (currentWorkflow === 'R') {
		return 0;
	}
	if (currentWorkflow === 'A') {
		return Object.values(partRange).reduce(
			(acc, [low, high]) => acc * (high - low + 1),
			1,
		);
	}
	const rules = workflows[currentWorkflow];
	let ans = 0;
	let previousRules = [];
	for (let i = 0; i < rules.length; i++) {
		let targetWorkflow;
		const newPartRange = {
			x: [partRange.x[0], partRange.x[1]],
			m: [partRange.m[0], partRange.m[1]],
			a: [partRange.a[0], partRange.a[1]],
			s: [partRange.s[0], partRange.s[1]],
		};

		for (let j = 0; j < previousRules.length; j++) {
			const [prevSubject, prevSymbol, prevLimit] = previousRules[j];
			if (prevSymbol === '>') {
				newPartRange[prevSubject][0] = Math.max(
					newPartRange[prevSubject][0],
					prevLimit + 1,
				);
			} else if (prevSymbol === '<') {
				newPartRange[prevSubject][1] = Math.min(
					newPartRange[prevSubject][1],
					prevLimit - 1,
				);
			}
		}

		if (i !== rules.length - 1) {
			const rule = rules[i][0];
			targetWorkflow = rules[i][1];
			const subject = rule[0];
			const symbol = rule[1];
			const limit = Number(rule.slice(2));
			if (symbol === '<') {
				previousRules.push([subject, '>', limit - 1]);
				newPartRange[subject][1] = Math.min(
					newPartRange[subject][1],
					limit - 1,
				);
			} else if (symbol === '>') {
				previousRules.push([subject, '<', limit + 1]);
				newPartRange[subject][0] = Math.max(
					newPartRange[subject][0],
					limit + 1,
				);
			}
		} else {
			targetWorkflow = rules[i][0];
		}

		// check if valid
		if (
			newPartRange.x[0] > newPartRange.x[1] ||
			newPartRange.m[0] > newPartRange.m[1] ||
			newPartRange.a[0] > newPartRange.a[1] ||
			newPartRange.s[0] > newPartRange.s[1]
		) {
			continue;
		}
		// dfs
		ans += dfs(workflows, targetWorkflow, newPartRange);
	}
	return ans;
}

day19();
