export function* takeWhile(iterable, predicate) {
	for (const x of iterable) {
		if (!predicate(x)) return;
		yield x;
	}
}
