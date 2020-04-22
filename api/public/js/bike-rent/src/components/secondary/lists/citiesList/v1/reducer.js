import * as constants from "./constants"

const initial = () => ({
	loadingMore: false
})

const cities = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_CITIES:
			const results =
				payload.page > 0 ? [...state.results, ...payload.results] : payload.results
			return {
				...state,
				count: payload.count,
				hasMore: payload.hasMore,
				loadingMore: false,
				page: payload.page,
				pages: payload.pages,
				results
			}

		case constants.TOGGLE_LOADING:
			return {
				...state,
				loadingMore: !state.loadingMore
			}

		case constants.UPDATE_SEARCH_TERM:
			return {
				...state,
				q: payload.q
			}

		default:
			return state
	}
}

export default cities
