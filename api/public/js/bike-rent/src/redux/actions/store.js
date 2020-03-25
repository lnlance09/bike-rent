import * as constants from "../constants"
import request from "request"

export const getStore = ({ id }) => dispatch => {
	request.get(
		`${window.location.origin}/api/store/get?id=${id}`,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_STORE
			})
		}
	)
}

export const getStores = ({ lat, lon }) => dispatch => {
	request.get(
		`${window.location.origin}/api/store/search`,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_STORES
			})
		}
	)
}
