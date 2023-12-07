const fs = require('fs');

function day7() {
	const input = fs.readFileSync('./day7.txt').toString().split('\n');
	const hands = input.map(line => {
		let [hand, bid] = line.split(' ');
		bid = Number(bid);
		return [hand, bid];
	});
	console.log('part 1');
	console.log(part1(hands));
	console.log('part 2');
	console.log(part2(hands));
}

function part1(hands) {
	const handsInGroups = {
		fiveOfAKind: [],
		fourOfAKind: [],
		fullHouse: [],
		threeOfAKind: [],
		twoPairs: [],
		onePair: [],
		highCard: [],
	};
	for (let i = 0; i < hands.length; i++) {
		const [hand] = hands[i];
		const handMap = new Map();
		for (let j = 0; j < hand.length; j++) {
			if (!handMap.has(hand[j])) {
				handMap.set(hand[j], 1);
			} else {
				handMap.set(hand[j], handMap.get(hand[j]) + 1);
			}
		}
		handsInGroups[getCardType(handMap)].push(hands[i]);
	}

	const convertList = {
		A: 14,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		T: 10,
		J: 11,
		Q: 12,
		K: 13,
	};

	return getAns(handsInGroups, convertList, hands.length);
}

function part2(hands) {
	const handsInGroups = {
		fiveOfAKind: [],
		fourOfAKind: [],
		fullHouse: [],
		threeOfAKind: [],
		twoPairs: [],
		onePair: [],
		highCard: [],
	};
	for (let i = 0; i < hands.length; i++) {
		const [hand] = hands[i];
		let handMap = new Map();
		for (let j = 0; j < hand.length; j++) {
			if (!handMap.has(hand[j])) {
				handMap.set(hand[j], 1);
			} else {
				handMap.set(hand[j], handMap.get(hand[j]) + 1);
			}
		}
		handMap = changeHandMap(handMap);
		handsInGroups[getCardType(handMap)].push(hands[i]);
	}

	const convertList = {
		A: 14,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		T: 10,
		J: 1,
		Q: 12,
		K: 13,
	};

	return getAns(handsInGroups, convertList, hands.length);
}

function changeHandMap(map) {
	if (!map.has('J')) {
		return map;
	}
	if (map.size === 1 && map.has('J')) {
		return map;
	}

	const JokerNum = map.get('J');
	map.delete('J');

	let maxCardNum = -1;
	let keyWithMaxCardNum = '';

	map.forEach((value, key) => {
		if (value > maxCardNum) {
			maxCardNum = value;
			keyWithMaxCardNum = key;
		}
	});

	map.set(keyWithMaxCardNum, maxCardNum + JokerNum);

	return map;
}

function getCardType(handMap) {
	const maxSameCardNums = Math.max(
		...Object.values(Object.fromEntries(handMap)),
	);
	if (handMap.size === 1 && maxSameCardNums === 5) {
		return 'fiveOfAKind';
	} else if (handMap.size === 2 && maxSameCardNums === 4) {
		return 'fourOfAKind';
	} else if (handMap.size === 2 && maxSameCardNums === 3) {
		return 'fullHouse';
	} else if (handMap.size === 3 && maxSameCardNums === 3) {
		return 'threeOfAKind';
	} else if (handMap.size === 3 && maxSameCardNums === 2) {
		return 'twoPairs';
	} else if (handMap.size === 4 && maxSameCardNums === 2) {
		return 'onePair';
	} else if (handMap.size === 5) {
		return 'highCard';
	} else {
		console.log({ handMap, maxSameCardNums, hand });
		throw new Error('impossible hand');
	}
}

function getAns(handsInGroups, convertList, rank) {
	const keys = Object.keys(handsInGroups);

	for (let i = 0; i < keys.length; i++) {
		const group = handsInGroups[keys[i]];
		group.sort(([firstHand], [secondHand]) => {
			for (let s = 0; s < firstHand.length; s++) {
				const firstHandValue = convertList[firstHand[s]];
				const secondHandValue = convertList[secondHand[s]];
				if (firstHandValue === secondHandValue) {
					continue;
				}
				return -(firstHandValue - secondHandValue);
			}
			return 0;
		});
	}

	let ans = 0;

	for (let i = 0; i < keys.length; i++) {
		const group = handsInGroups[keys[i]];
		for (let j = 0; j < group.length; j++) {
			ans += group[j][1] * rank;
			rank -= 1;
		}
	}

	return ans;
}

day7();
