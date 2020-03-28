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
