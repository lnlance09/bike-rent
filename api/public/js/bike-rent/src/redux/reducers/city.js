import * as constants from "../constants"

const initial = () => ({})

const city = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_CITY:
			if (payload.error) {
				return {
					...state,
					error: true
				}
			}

			return {
				...state,
				city: {
					city: payload.city.city,
					county: payload.city.count,
					description: payload.city.description,
					image: payload.city.image,
					lat: payload.city.lat,
					lon: payload.city.lon,
					name: payload.city.name,
					state: payload.city.state,
					storeCount: payload.store_count,
					stores: payload.results
				},
				error: false
			}
		default:
			return state
	}
}

export default city
