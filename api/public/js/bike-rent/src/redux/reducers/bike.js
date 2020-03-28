import * as constants from "../constants"

const initial = () => ({})

const bike = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_BIKE:
			return {
				bike: {
					description: payload.bike.description,
					image: payload.bike.image,
					name: payload.bike.name,
					storeCount: payload.store_count
				}
			}

		case constants.GET_BIKES:
			return {
				...state
			}

		case constants.SELECT_BIKE:
			return {
				...state
			}

		default:
			return state
	}
}

export default bike
