export const colorOptions = [
	{ key: "red", text: "Red", value: "red" },
	{ key: "orange", text: "Orange", value: "orange" },
	{ key: "yellow", text: "Yellow", value: "yellow" },
	{ key: "olive", text: "Olive", value: "olive" },
	{ key: "green", text: "Green", value: "green" },
	{ key: "teal", text: "Teal", value: "teal" },
	{ key: "blue", text: "Blue", value: "blue" },
	{ key: "violet", text: "Violet", value: "violet" },
	{ key: "purple", text: "Purple", value: "purple" },
	{ key: "pink", text: "Pink", value: "pink" },
	{ key: "brown", text: "Brown", value: "brown" },
	{ key: "grey", text: "Grey", value: "grey" },
	{ key: "black", text: "Black", value: "black" }
]

export const monthOptions = [
	{ key: "jan", text: "January", value: "01" },
	{ key: "feb", text: "February", value: "02" },
	{ key: "mar", text: "March", value: "03" },
	{ key: "apr", text: "April", value: "04" },
	{ key: "may", text: "May", value: "05" },
	{ key: "jun", text: "June", value: "06" },
	{ key: "jul", text: "July", value: "07" },
	{ key: "aug", text: "August", value: "08" },
	{ key: "sep", text: "September", value: "09" },
	{ key: "oct", text: "October", value: "10" },
	{ key: "nov", text: "November", value: "11" },
	{ key: "dec", text: "December", value: "12" }
]

export const pageOptions = [
	{ key: "about", text: "about", value: "about" },
	{ key: "apply", text: "apply", value: "apply" },
	{ key: "bikes", text: "bikes", value: "bikes" },
	{ key: "checkout", text: "checkout", value: "checkout" },
	{ key: "cities", text: "cities", value: "cities" },
	{ key: "contact", text: "contact", value: "contact" },
	{ key: "home", text: "home", value: "home" },
	{ key: "faq", text: "faq", value: "faq" },
	{ key: "partners", text: "partners", value: "partners" },
	{ key: "search", text: "search", value: "search" },
	{ key: "stores", text: "stores", value: "stores" },
	{ key: "terms", text: "terms", value: "terms" }
]

export const fetchLocations = async q => {
	const response = await fetch(`${window.location.origin}/api/city/getLocations?q=${q}`, {
		headers: {
			"Content-Type": "application/json"
		}
	})
	const data = await response.json()
	return data.locations
}
