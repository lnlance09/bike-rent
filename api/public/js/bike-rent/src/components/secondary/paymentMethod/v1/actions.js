import * as constants from "./constants"
import { toast } from "react-toastify"
import request from "request"

toast.configure({
	autoClose: 4000,
	draggable: false
})

export const addPayment = ({
	bearer,
	callback,
	cvc,
	email,
	emailRequired,
	expiry,
	name,
	number
}) => dispatch => {
	request.post(
		`${window.location.origin}/api/users/addPaymentMethod`,
		{
			form: {
				cvc,
				email,
				emailRequired,
				expiry,
				name,
				number
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.ADD_PAYMENT
			})

			if (!body.error) {
				toast.success("Your card has been added")
				dispatch(getPayments({ bearer }))
				callback(body.paymentId, email)
			}
		}
	)
}

export const getPayments = ({ bearer, limit = 25, page = 0 }) => dispatch => {
	request.get(
		`${window.location.origin}/api/users/getPaymentMethods`,
		{
			headers: {
				Authorization: bearer
			},
			json: true,
			qs: {
				limit,
				page
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_PAYMENTS
			})
		}
	)
}

export const makeDefault = ({ bearer, id }) => dispatch => {
	request.post(
		`${window.location.origin}/api/users/setDefaultPaymentMethod`,
		{
			form: {
				id
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				toast.success("Your card has been updated")
				dispatch(getPayments({ bearer }))
			}
		}
	)
}
