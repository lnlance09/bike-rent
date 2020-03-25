import * as constants from "./constants"
import request from "request"

export const getBikes = ({ page, q, sort }) => dispatch => {
	request.get(
		`${window.location.origin}/api/bikes/search`,
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

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}
