import * as constants from "./constants"
import request from "request"

export const getStores = ({ page, q, sort }) => dispatch => {
	request.get(
		`${window.location.origin}/api/store/search`,
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
				type: constants.GET_STORES
			})
		}
	)
}

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}
