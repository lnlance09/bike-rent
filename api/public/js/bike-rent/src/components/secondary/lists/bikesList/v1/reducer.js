import * as constants from "./constants"

const initial = () => ({
	loadingMore: false
})

const bikes = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_BIKES:
		case constants.GET_BIKES_BY_STORE:
			const results =
				payload.page > 0 ? [...state.results, ...payload.results] : payload.results
			return {
				...state,
				count: payload.count,
				hasMore: payload.pagination.hasMore,
				loadingMore: false,
				page: payload.pagination.nextPage,
				pages: payload.pagination.pages,
				results
			}

		case constants.TOGGLE_LOADING:
			return {
				...state,
				loadingMore: !state.loadingMore
			}

		default:
			return state
	}
}

export default bikes
