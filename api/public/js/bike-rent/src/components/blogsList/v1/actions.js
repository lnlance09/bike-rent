import * as constants from "./constants"
import request from "request"

export const getBlogs = ({ cityId, limit = 25, page = 0, sort }) => dispatch => {
	request.get(
		`${window.location.origin}/api/blog/search`,
		{
			json: true,
			qs: {
				cityId,
				limit,
				page,
				sort
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_BLOGS
			})
		}
	)
}

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}
