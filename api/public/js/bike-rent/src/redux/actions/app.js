import * as constants from "../constants"
import { toast } from "react-toastify"
import request from "request"

toast.configure({
	autoClose: 4000,
	draggable: false
})

export const addCity = ({ bearer, description, id, image }) => dispatch => {
	request.post(
		`${window.location.origin}/api/city/create`,
		{
			form: {
				description,
				id,
				image
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.ADD_CITY
			})

			if (!body.error) {
				toast.success("The city has been added")
				dispatch(getCities())
				dispatch(toggleAddCityModal())
			}
		}
	)
}

export const editCity = ({ bearer, description, id, image, order }) => dispatch => {
	request.post(
		`${window.location.origin}/api/city/edit`,
		{
			form: {
				description,
				id,
				image,
				order
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				toast.success("Your edit was successful")
			}

			dispatch({
				payload: body,
				type: constants.EDIT_CITY
			})

			dispatch(getCities())
		}
	)
}

export const editCss = ({ bearer, css }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateCss`,
		{
			form: {
				css
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				toast.success("Your edit was successful")
			}

			dispatch({
				payload: body,
				type: constants.EDIT_CSS
			})
		}
	)
}

export const editEmail = ({ bearer, email, type }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateEmail`,
		{
			form: {
				email,
				type
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				toast.success("Your email was successfully edited")
			}

			dispatch({
				payload: body,
				type: constants.EDIT_EMAIL
			})
		}
	)
}

export const editSitemap = ({ bearer, sitemap }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateSitemap`,
		{
			form: {
				sitemap
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				toast.success("Sitemap was successful edited")
			}

			dispatch({
				payload: body,
				type: constants.EDIT_SITEMAP
			})
		}
	)
}

export const getCities = () => dispatch => {
	request.get(
		`${window.location.origin}/api/city/search`,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_CITIES
			})
		}
	)
}

export const getCss = ({ url }) => dispatch => {
	request.get(
		url,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_CSS
			})
		}
	)
}

export const getEmail = ({ type }) => dispatch => {
	request.get(
		`https://bike-rent.s3-us-west-2.amazonaws.com/emails/${type}.html`,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				emailType: type,
				payload: body,
				type: constants.GET_EMAIL
			})
		}
	)
}

export const getSettings = () => dispatch => {
	request.get(
		`${window.location.origin}/api/settings/`,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_SETTINGS
			})
		}
	)
}

export const getSitemap = ({ url }) => dispatch => {
	request.get(
		url,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_SITEMAP
			})
		}
	)
}

export const sendEmail = ({ bearer, email, type }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/sendTestEmail`,
		{
			form: {
				email,
				type
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				toast.success("Email successfully sent")
			}

			dispatch({
				payload: body,
				type: constants.SEND_EMAIL
			})
		}
	)
}

export const setLanguages = ({ bearer, languages }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateLanguages`,
		{
			form: {
				languages
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.SET_LANGUAGES
			})
			toast.success("Languages have been updated")
		}
	)
}

export const submitFooterForm = ({
	bearer,
	inverted,
	listOneItems,
	listOneTitle,
	listTwoItems,
	listTwoTitle,
	subTitle,
	title
}) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateFooter`,
		{
			form: {
				inverted,
				listOneItems,
				listOneTitle,
				listTwoItems,
				listTwoTitle,
				subTitle,
				title
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_SETTINGS
			})
		}
	)
}

export const submitHeaderForm = ({ bearer, signInButton, signUpButton }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateFooter`,
		{
			form: {
				signInButton,
				signUpButton
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_SETTINGS
			})
		}
	)
}

export const toggleAddCityModal = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_ADD_CITY_MODAL
	})
}
