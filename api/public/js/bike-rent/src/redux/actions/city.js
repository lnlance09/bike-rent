import * as constants from "../constants"
import request from "request"

export const getCity = ({ callback, id }) => dispatch => {
	request.get(
		`${window.location.origin}/api/city/get`,
		{
			json: true,
			qs: {
				id
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_CITY
			})

			callback()
		}
	)
}
