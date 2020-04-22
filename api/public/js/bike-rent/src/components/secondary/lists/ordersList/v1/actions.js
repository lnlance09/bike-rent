import * as constants from "./constants"
import request from "request"

export const getOrders = ({ limit = 25, page = 0, sort, storeId, userId }) => dispatch => {
	request.get(
		`${window.location.origin}/api/order/getAll`,
		{
			json: true,
			qs: {
				limit,
				page,
				sort,
				storeId,
				userId
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

export const getOrderDetails = ({ bearer, callback, id }) => dispatch => {
	request.get(
		`${window.location.origin}/api/order/getDetails`,
		{
			json: true,
			qs: {
				id
			}
		},
		function(err, response, body) {
			if (!body.error) {
				callback()
			}

			dispatch({
				payload: body,
				type: constants.GET_ORDER
			})
		}
	)
}

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}
