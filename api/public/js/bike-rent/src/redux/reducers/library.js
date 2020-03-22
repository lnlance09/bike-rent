import * as constants from "../constants"

const initial = () => ({
	settings: {}
})

const library = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.GET_IMAGES:
			return {
				images: payload.images
			}

		default:
			return state
	}
}

export default library
