// helper similar to lodash _.chunk
// split array of items into X number of sub arrays
export function chunk(arr, chunkSize = 1, cache = []) {
	const tmp = [...arr]
	if (chunkSize <= 0) return cache
	while (tmp.length) cache.push(tmp.splice(0, chunkSize))
	return cache
}