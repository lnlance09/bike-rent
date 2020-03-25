import * as constants from "./constants"

const initial = () => ({
	loadingMore: false
})

const bikes = (state = initial(), action) => {
	switch (action.type) {
		case constants.GET_BIKES:
			const results =
				action.payload.page > 0
					? [...state.results, ...action.payload.results]
					: action.payload.results
			return {
				...state,
				count: action.payload.count,
				hasMore: action.payload.hasMore,
				loadingMore: false,
				page: action.payload.page,
				pages: action.payload.pages,
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
