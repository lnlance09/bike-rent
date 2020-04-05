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

		default:
			return state
	}
}

export default order
