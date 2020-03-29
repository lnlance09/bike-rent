import * as constants from "../constants"

const initial = () => ({
	modalOpen: false,
	settings: {}
})

const library = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_IMAGES:
			return {
				...state,
				images: payload.images
			}

		case constants.TOGGLE_ADD_IMAGE_MODAL:
			return {
				...state,
				modalOpen: !state.modalOpen
			}

		default:
			return state
	}
}

export default library
