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
