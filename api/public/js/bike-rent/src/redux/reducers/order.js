import * as constants from "../constants"

const initial = () => ({
	order: {
		confettiVisible: false,
		confirmationModalOpen: false,
		error: false,
		errorMsg: ""
	}
})

const order = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.CREATE_ORDER:
			return {
				...state,
				order: {
					...state.order,
					error: payload.error ? true : false,
					errorMsg: payload.error ? payload.error : ""
				}
			}

		case constants.TOGGLE_CONFETTI:
			return {
				...state,
				order: {
					...state.order,
					confettiVisible: !state.order.confettiVisible
				}
			}

		case constants.TOGGLE_CONFIRMATION_MODAL:
			return {
				...state,
				order: {
					...state.order,
					confirmationModalOpen: !state.order.confirmationModalOpen
				}
			}

		default:
			return state
	}
}

export default order
