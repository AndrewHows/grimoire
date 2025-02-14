export function profileComplete(user) {
	return Boolean(user.profile?.industry);
}

export function searchRecursive(haystack, value) {
	if (typeof haystack !== 'object') return [];
	const o = Array.isArray(haystack) ? haystack : Object.values(haystack ?? {});
	return o
		.map((e) => {
			if (e === value) return o;
			return searchRecursive(e, value);
		})
		.flat()
		.filter(Boolean);
}

export function removeRecursive(haystack, value) {
	if (typeof haystack !== 'object') return [];
	const o = Array.isArray(haystack) ? haystack : Object.values(haystack ?? {});
	o.forEach((e) => {
		if (e === value) {
			if (Array.isArray(haystack)) haystack.splice(haystack.indexOf(e), 1);
			else delete haystack[e];
		} else {
			removeRecursive(e, value);
		}
	});
}

export const intToDice = (
	damage,
	{ diceThreshold, dice, staticDice } = {
		diceThreshold: 3,
		dice: [6, 8, 10, 12],
		staticDice: 1,
	}
) => {
	const diceAvg = dice.map((d) => d / 2 + 0.5);
	const dMod = diceAvg.map((d) => damage % d);
	const minDMod = Math.min(...dMod);
	const dieIndex = dMod.indexOf(minDMod);
	let dieCount = Math.floor(damage / diceAvg[dieIndex]);
	let bonus = Math.ceil(minDMod);
	staticDice = Math.max(staticDice, dieCount - diceThreshold);
	staticDice = Math.min(staticDice, dieCount - 1);
	if (staticDice > 0) {
		bonus += Math.floor(staticDice * diceAvg[dieIndex]);
		dieCount -= staticDice;
	}
	const diceExp = [[dieCount, dice[dieIndex]]];
	if (bonus !== 0) diceExp.push(bonus);
	return diceExp;
};

export const diceToString = (dice) =>
	dice
		.map((e) =>
			Array.isArray(e)
				? `${e[0]}d${e[1]}`
				: e < 0
				? `- ${Math.abs(e)}`
				: `+ ${e}`
		)
		.join(' ');

export const signed = (n) => `${n >= 0 ? '+' : ''}${n}`;
