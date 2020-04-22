import * as constants from "./constants"
import request from "request"

export const getStores = ({ cityId, page, q, showHidden, sort, storeId }) => dispatch => {
	request.get(
		`${window.location.origin}/api/store/search`,
		{
			json: true,
			qs: {
				cityId,
				page,
				q,
				showHidden,
				sort,
				storeId
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

export const getStoresByBike = ({
	bikeId,
	cityId,
	limit = 25,
	page = 0,
	showHidden,
	storeId
}) => dispatch => {
	request.get(
		`${window.location.origin}/api/store/getBikes`,
		{
			json: true,
			qs: {
				bikeId,
				cityId,
				limit,
				page,
				showHidden,
				storeId
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_STORES_BY_BIKE
			})
		}
	)
}

export const toggleLoading = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_LOADING
	})
}
