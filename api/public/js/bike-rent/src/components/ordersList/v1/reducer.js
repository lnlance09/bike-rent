import * as constants from "./constants"

const initial = () => ({
	loadingMore: false
})

const orders = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_ORDER:
			return {
				...state,
				orderDetails: payload
			}

		case constants.GET_ORDERS:
			const results =
				payload.page > 0 ? [...state.results, ...payload.orders] : payload.orders
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

export default orders
