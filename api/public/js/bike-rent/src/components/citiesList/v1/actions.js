import * as constants from "./constants"
import request from "request"

export const getCities = ({ limit = 25, page = 0, q, showHidden, sort }) => dispatch => {
	request.get(
		`${window.location.origin}/api/city/search`,
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
