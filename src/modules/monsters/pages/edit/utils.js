import {
	monsterBase,
	monsterRoles,
	monsterVariants,
	powerRanges,
	usages,
} from '@/constants';
import { diceToString, intToDice } from '@/utils';

export const setValue = (state, e, keys) => {
	let { value, set } = state;
	const newVal = e?.target?.value ?? e;
	if (keys) {
		let valueRef = value;
		keys = Array.isArray(keys) ? keys : [keys];
		for (const k of keys.slice(0, -1)) {
			valueRef = valueRef[k];
		}
		valueRef[keys.slice(-1)[0]] = newVal;
		console.log(value);
		set(Array.isArray(value) ? [...value] : { ...value });
	} else {
		set(newVal);
	}
};

export const mm3 = {
	hp: (monster) => {
		const role = monsterRoles.find(({ name }) => name === monster.role);
		const variant = monsterVariants.find(
			({ name }) => name === monster.variant
		);
		let hp = (role?.hpBase ?? 0) + monster.level * (role?.hpLevel ?? 1);
		if (variant?.hpMultiplier) hp = hp * variant.hpMultiplier;
		if (variant?.hpSet) hp = variant.hpSet;
		return hp;
	},
	bloodied: (monster) => Math.floor(mm3.hp(monster) / 2),
	ac: (monster) => {
		const role = monsterRoles.find(({ name }) => name === monster.role);
		return monsterBase.ac + monster.level + (role?.acMod ?? 0);
	},
	ref: (monster) => monsterBase.nads + monster.level,
	fort: (monster) => monsterBase.nads + monster.level,
	will: (monster) => monsterBase.nads + monster.level,
	accuracy: (monster) => monsterBase.accuracy + monster.level,
	damage: (monster, power) => {
		const role = monsterRoles.find(({ name }) => name === monster.role);
		const variant = monsterVariants.find(
			({ name }) => name === monster.variant
		);
		let damage = Math.round(
			(monsterBase.damage + monster.level) *
				(role?.damageMultiplier ?? 1) *
				(variant?.damageMultiplier ?? 1)
		);
		if (isNaN(damage)) damage = 0;

		const rangeData = powerRanges.find((r) => r.name === power.range);
		const usageData = usages.find((u) => u.name === power.usage);

		console.log(
			damage,
			rangeData?.damageMultiplier ?? 1,
			usageData?.damageMultiplier ?? 1
		);
		return (
			damage *
			(rangeData?.damageMultiplier ?? 1) *
			(usageData?.damageMultiplier ?? 1)
		);
	},
};
