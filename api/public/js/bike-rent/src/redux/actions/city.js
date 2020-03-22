import * as constants from "../constants"
import request from "request"

export const getCities = ({ lat, lon }) => dispatch => {
	request.get(
		`${window.location.origin}/api/city/search`,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_CITIES
			})
		}
	)
}
