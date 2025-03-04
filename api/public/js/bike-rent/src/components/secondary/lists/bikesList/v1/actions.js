import * as constants from "./constants"
import request from "request"

export const getBikes = ({ limit = 25, page = 0, q, showHidden = 0, sort }) => dispatch => {
	request.get(
		`${window.location.origin}/api/bike/search`,
		{
			json: true,
			qs: {
				limit,
				page,
				q,
				showHidden,
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

export const getBikesByStore = ({ limit = 25, page = 0, storeId }) => dispatch => {
	request.get(
		`${window.location.origin}/api/store/getBikes`,
		{
			json: true,
			qs: {
				storeId,
				limit,
				page
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_BIKES_BY_STORE
			})
		}
	)
}

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}
