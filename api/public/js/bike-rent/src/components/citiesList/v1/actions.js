import * as constants from "./constants"
import request from "request"

export const getCities = ({ page, q, sort }) => dispatch => {
	request.get(
		`${window.location.origin}/api/cities/search`,
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
				type: constants.GET_CITIES
			})
		}
	)
}

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}

export const updateSearchTerm = ({ q }) => dispatch => {
	dispatch({
		payload: {
			q
		},
		type: constants.UPDATE_SEARCH_TERM
	})
}
