import * as constants from "../constants"

const initial = () => ({})

const city = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_CITIES:
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

export default city
