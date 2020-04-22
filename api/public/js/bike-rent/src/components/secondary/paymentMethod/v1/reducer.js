import * as constants from "./constants"

const initial = () => ({
	loadingMore: false
})

const payments = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.ADD_PAYMENT:
			return {
				...state,
				error: payload.error ? true : false,
				errorMsg: payload.error,
				paymentId: payload.paymentId
			}

		case constants.GET_PAYMENTS:
			const results =
				payload.page > 0 ? [...state.results, ...payload.results] : payload.results
			return {
				...state,
				count: payload.count,
				results
			}

		default:
			return state
	}
}

export default payments
