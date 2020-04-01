import * as constants from "../constants"
import request from "request"

export const getBike = ({ id }) => dispatch => {
	request.get(
		`${window.location.origin}/api/bike/get`,
		{
			json: true,
			qs: {
				id
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_BIKE
			})
		}
	)
}

export const getBikes = ({ page, q, sort }) => dispatch => {
	request.get(
		`${window.location.origin}/api/bike/search`,
		{
			json: true,
			qs: {
				page,
				q,
				sort
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_BIKES
			})
		}
	)
}
