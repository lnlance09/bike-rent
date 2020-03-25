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
					city: payload.store.city,
					description: payload.store.description,
					error,
					id: parseInt(payload.store.id, 10),
					image: payload.store.image,
					lat: payload.store.lat,
					lon: payload.store.long,
					name: payload.store.name,
					state: payload.store.state,
					zipCode: payload.store.zip_code
				}
			}

		case constants.GET_STORES:
			const results =
				payload.page > 0 ? [...state.results, ...payload.results] : payload.results

			return {
				...state,
				count: payload.count,
				hasMore: payload.pagination.hasMore,
				loadingMore: false,
				page: payload.pagination.nextPage,
				results
			}

		default:
			return state
	}
}

export default store
