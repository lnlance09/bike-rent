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

export const fetchCities = async q => {
	const response = await fetch(`${window.location.origin}/api/city/getCities`, {
		headers: {
			"Content-Type": "application/json"
		}
	})
	const data = await response.json()
	return data.cities
}

export const fetchLocations = async q => {
	const response = await fetch(`${window.location.origin}/api/city/getLocations?q=${q}`, {
		headers: {
			"Content-Type": "application/json"
		}
	})
	const data = await response.json()
	return data.locations
}

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

export const timeOptions = [
	{ key: "8:00 AM", text: "8:00 AM", value: "1" },
	{ key: "8:30 AM", text: "8:30 AM", value: "2" },
	{ key: "9:00 AM", text: "9:00 AM", value: "3" },
	{ key: "9:30 AM", text: "9:30 AM", value: "4" },
	{ key: "10:00 AM", text: "10:00 AM", value: "5" },
	{ key: "10:30 AM", text: "10:30 AM", value: "6" },
	{ key: "11:00 AM", text: "11:00 AM", value: "7" },
	{ key: "11:30 AM", text: "11:30 AM", value: "8" },
	{ key: "12:00 PM", text: "12:00 PM", value: "9" },
	{ key: "12:30 PM", text: "12:30 PM", value: "10" },
	{ key: "1:00 PM", text: "1:00 PM", value: "11" },
	{ key: "1:30 PM", text: "1:30 PM", value: "12" },
	{ key: "2:00 PM", text: "2:00 PM", value: "13" },
	{ key: "2:30 PM", text: "2:30 PM", value: "14" },
	{ key: "3:00 PM", text: "3:00 PM", value: "15" },
	{ key: "3:30 PM", text: "3:30 PM", value: "16" },
	{ key: "4:00 PM", text: "4:00 PM", value: "17" },
	{ key: "4:30 PM", text: "4:30 PM", value: "18" },
	{ key: "5:00 PM", text: "5:00 PM", value: "19" },
	{ key: "5:30 PM", text: "5:30 PM", value: "20" },
	{ key: "6:00 PM", text: "6:00 PM", value: "21" },
	{ key: "6:30 PM", text: "6:30 PM", value: "22" },
	{ key: "7:00 PM", text: "7:00 PM", value: "23" },
	{ key: "7:30 PM", text: "7:30 PM", value: "24" }
]
