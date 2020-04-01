import * as constants from "../constants"
import request from "request"

export const createOrder = ({
	cart,
	cvc,
	email,
	expiry,
	firstName,
	lastName,
	name,
	number,
	storeId,
	type
}) => dispatch => {
	request.post(
		`${window.location.origin}/api/order/create`,
		{
			form: {
				cart,
				cvc,
				email,
				expiry,
				firstName,
				lastName,
				name,
				number,
				storeId,
				type
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.CREATE_ORDER
			})
		}
	)
}

export const getPaymentMethods = ({ bearer }) => dispatch => {
	request.get(
		`${window.location.origin}/api/order/getPaymentMethods`,
		{
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_PAYMENT_METHODS
			})
		}
	)
}

