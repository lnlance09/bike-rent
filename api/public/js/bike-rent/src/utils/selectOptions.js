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
