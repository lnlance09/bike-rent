export const mapIdsToNames = (ids, names) => {
	// eslint-disable-next-line
	Array.prototype.zip = function(arr) {
		return this.map(function(e, i) {
			return { id: e, name: arr[i], text: arr[i], value: e }
		})
	}
	return ids.split("|").zip(names.split("|"))
}
