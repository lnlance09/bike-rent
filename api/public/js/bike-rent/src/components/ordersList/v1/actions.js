import * as constants from "./constants"
import request from "request"

export const getOrders = ({ limit = 25, page = 0, q, sort, visible }) => dispatch => {
	request.get(
		`${window.location.origin}/api/bike/search`,
		{
			json: true,
			qs: {
				limit,
				page,
				q,
				sort,
				visible
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_ORDERS
			})
		}
	)
}

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}
