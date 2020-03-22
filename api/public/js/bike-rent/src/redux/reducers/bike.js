import * as constants from "../constants"

const initial = () => ({})

const bike = (state = initial(), action) => {
	switch (action.type) {
		case constants.SELECT_BIKE:
			return {
				messageSent: false
			}

		default:
			return state
	}
}

export default bike
