import * as constants from "../constants"

const initial = () => ({})

const store = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_STORE:
			const { error } = payload.error
			return {
				...state,
				store: {
					address: payload.store.address,
					avgRating: payload.store.avgRating,
					city: payload.store.city,
					closingTime: payload.store.closing_time,
					description: payload.store.description,
					error,
					id: parseInt(payload.store.id, 10),
					image: payload.store.image,
					lat: payload.store.lat,
					lon: payload.store.lon,
					name: payload.store.name,
					phoneNumber: payload.store.phone_number,
					openingTime: payload.store.opening_time,
					reviewCount: payload.store.reviewCount,
					state: payload.store.state,
					zipCode: payload.store.zip_code
				}
			}

		case constants.RESET_TO_DEFAULT:
			return {
				...state,
				store: {}
			}

		default:
			return state
	}
}

export default store
