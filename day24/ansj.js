const { init } = require('z3-solver');
const utils = require('../../utils');
const data = utils.byLine('./input.txt').map(intsS);
const MIN = 200000000000000;
const MAX = 400000000000000;

function intersects(a, b, c, d, p, q, r, s) {
	const det = (c - a) * (s - q) - (r - p) * (d - b);
	if (det === 0) return null;
	return ((s - q) * (r - a) + (p - r) * (s - b)) / det;
}

let intersections = 0;
utils.pairs(data, (a, b) => {
	let delta = intersects(
		a[0],
		a[1],
		a[0] + a[3],
		a[1] + a[4],
		b[0],
		b[1],
		b[0] + b[3],
		b[1] + b[4],
	);
	if (delta === null) {
		return;
	}
	let x = a[0] + delta * a[3];
	let y = a[1] + delta * a[4];

	if (
		(x < a[0] && a[3] > 0) ||
		(x > a[0] && a[3] < 0) ||
		(x < b[0] && b[3] > 0) ||
		(x > b[0] && b[3] < 0)
	) {
		return;
	}
	if (x < MIN || x > MAX || y < MIN || y > MAX) {
		return;
	}
	intersections++;
});
console.log('Part 1', intersections);

async function solveSystem() {
	const { Context } = await init();
	const { Solver, Int } = new Context('main');
	const solver = new Solver();
	const x = Int.const('x');
	const y = Int.const('y');
	const z = Int.const('z');
	const dx = Int.const('dx');
	const dy = Int.const('dy');
	const dz = Int.const('dz');
	const t = data.map((_, i) => Int.const(`t${i}`));

	data.forEach((h, i) => {
		solver.add(t[i].mul(h[3]).add(h[0]).sub(x).sub(t[i].mul(dx)).eq(0));
		solver.add(t[i].mul(h[4]).add(h[1]).sub(y).sub(t[i].mul(dy)).eq(0));
		solver.add(t[i].mul(h[5]).add(h[2]).sub(z).sub(t[i].mul(dz)).eq(0));
	});
	await solver.check();
	console.log('Part 2', Number(solver.model().eval(x.add(y).add(z)).value()));
}
solveSystem();
