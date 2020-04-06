import * as constants from "../constants"

const initial = () => ({
	order: {
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
					confirmationModalOpen: payload.error ? false : true,
					error: payload.error ? true : false,
					errorMsg: payload.error ? payload.error : ""
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
