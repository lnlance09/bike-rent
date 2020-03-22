import * as constants from "../constants"
import request from "request"

export const selectBike = ({ msg }) => dispatch => {
	request.post(
		`${window.location.origin}/api/contact/send`,
		{
			form: {
				msg
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.SELECT_BIKE
			})
		}
	)
}
