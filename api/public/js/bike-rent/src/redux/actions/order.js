import * as constants from "../constants"
import { parseJwt, setToken } from "utils/tokenFunctions"
import request from "request"

export const createOrder = ({ bearer, cart, email, paymentId, storeId }) => dispatch => {
	request.post(
		`${window.location.origin}/api/order/create`,
		{
			form: {
				cart,
				email,
				paymentId,
				storeId
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			let localData = parseJwt()
			if (!body.error) {
				localData.cart = {
					items: []
				}

				setToken(localData)
			}

			dispatch({
				payload: body,
				type: constants.CREATE_ORDER
			})
		}
	)
}

export const toggleConfirmationModal = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_CONFIRMATION_MODAL
	})
}
