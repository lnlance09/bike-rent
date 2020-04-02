import * as constants from "../constants"

const initial = () => ({})

const order = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.CREATE_ORDER:
			if (payload.error) {
				return {
					...state,
					error: true
				}
			}

			return {
				...state
			}

		case constants.GET_PAYMENT_METHODS:
			return {
				...state,
				methods: payload.methods
			}

		default:
			return state
	}
}

export default order
