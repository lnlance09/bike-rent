import * as constants from "../constants"

const initial = () => ({})

const bike = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_BIKE:
			if (payload.error) {
				return {
					...state,
					error: true
				}
			}

			return {
				...state,
				bike: {
					description: payload.bike.description,
					image: payload.bike.image,
					name: payload.bike.name,
					storeCount: payload.store_count,
					stores: payload.results
				},
				error: false
			}

		case constants.GET_BIKES:
			return {
				...state
			}

		default:
			return state
	}
}

export default bike
