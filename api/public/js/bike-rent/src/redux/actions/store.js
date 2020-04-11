import * as constants from "../constants"
import { toast } from "react-toastify"
import request from "request"

toast.configure({
	autoClose: 4000,
	draggable: false
})

export const createReview = ({ bearer, callback, comment, rating, storeId }) => dispatch => {
	request.post(
		`${window.location.origin}/api/review/create`,
		{
			form: {
				comment,
				rating,
				storeId
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				toast.success("Your review has been created")
				callback()
			}
		}
	)
}

export const deleteReview = ({ bearer, callback, id }) => dispatch => {
	request.post(
		`${window.location.origin}/api/review/delete`,
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
				toast.success("Your review has been deleted")
				callback()
			}
		}
	)
}

export const editReview = ({ bearer, callback, comment, id, rating }) => dispatch => {
	request.post(
		`${window.location.origin}/api/review/edit`,
		{
			form: {
				comment,
				id,
				rating
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				toast.success("Your review has been edited")
				callback()
			}
		}
	)
}

export const getStore = ({ id }) => dispatch => {
	request.get(
		`${window.location.origin}/api/store/get`,
		{
			json: true,
			qs: {
				id
			}
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_STORE
			})
		}
	)
}
