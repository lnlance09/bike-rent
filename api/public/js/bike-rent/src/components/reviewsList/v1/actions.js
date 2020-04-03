import * as constants from "./constants"
import request from "request"

export const getReviews = ({
	limit = 25,
	page = 0,
	sort,
	storeId,
	userId,
	visible
}) => dispatch => {
	request.get(
		`${window.location.origin}/api/review/search`,
		{
			json: true,
			qs: {
				limit,
				page,
				sort,
				storeId,
				userId,
				visible
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_REVIEWS
			})
		}
	)
}

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}
