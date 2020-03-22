import * as constants from "./constants"
import { parseJwt, setToken } from "utils/token"
import jwt from "jsonwebtoken"
import request from "request"

export const changePassword = ({ bearer, confirmPassword, newPassword, password }) => dispatch => {
	request.post(
		`${window.location.origin}/api/users/changePassword`,
		{
			form: {
				current_password: password,
				new_password: newPassword,
				confirm_password: confirmPassword
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.CHANGE_PASSWORD
			})
		}
	)
}

export const changeProfilePic = ({ bearer, file }) => dispatch => {
	const fr = new FileReader()
	fr.onload = event => {
		request.post(
			`${window.location.origin}/api/users/changeProfilePic`,
			{
				headers: {
					Authorization: bearer,
					"Content-Type": "multipart/form-data",
					enctype: "multipart/form-data"
				},
				json: true,
				multipart: {
					chunked: false,
					data: [
						{
							"Content-Disposition": `form-data; name="file"; filename="${file.name}"`,
							body: event.target.result
						}
					]
				}
			},
			function(err, response, body) {
				let localData = parseJwt()
				if (!body.error) {
					localData.img = body.img
				}
				const token = setToken(localData)
				body.bearer = token

				dispatch({
					payload: body,
					type: constants.CHANGE_PROFILE_PIC
				})
			}
		)
	}
	fr.readAsArrayBuffer(file)
}

export const logout = () => dispatch => {
	localStorage.removeItem("jwtToken")
	dispatch({
		type: constants.LOGOUT
	})
}

export const resetPasswordProps = () => dispatch => {
	dispatch({
		type: constants.RESET_PASSWORD_PROPS
	})
}

export const submitGoogleForm = ({ accessToken, email, id, idToken, img, name }) => dispatch => {
	request.post(
		`${window.location.origin}/api/users/registerWithGoogle`,
		{
			form: {
				accessToken,
				email,
				id,
				idToken,
				img,
				name
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				const token = jwt.sign({ data: body.user }, "secret", {
					expiresIn: 60 * 60 * 5
				})
				localStorage.setItem("jwtToken", token)
				body.bearer = token
			}

			dispatch({
				payload: body,
				type: constants.SET_USER_DATA
			})
		}
	)
}

export const submitLoginForm = ({ email, password }) => dispatch => {
	request.post(
		`${window.location.origin}/api/users/login`,
		{
			form: {
				email,
				password
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				const token = setToken(body.user)
				body.bearer = token
			}

			dispatch({
				payload: body,
				type: constants.SET_USER_DATA
			})
		}
	)
}

export const submitRegistrationForm = ({ email, name, password, username }) => dispatch => {
	request.post(
		`${window.location.origin}/api/users/register`,
		{
			form: {
				email,
				name,
				password,
				username
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				const token = jwt.sign({ data: body.user }, "secret", {
					expiresIn: 60 * 60 * 5
				})
				localStorage.setItem("jwtToken", token)
				body.bearer = token
			}

			dispatch({
				payload: body,
				type: constants.SET_USER_DATA
			})
		}
	)
}

export const switchTab = tab => dispatch => {
	dispatch({
		tab: tab,
		type: constants.SWITCH_TAB
	})
}

export const updateAbout = ({ bearer, bio }) => dispatch => {
	request.post(
		`${window.location.origin}/api/users/update`,
		{
			form: {
				bio
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				let localData = parseJwt()
				localData.bio = body.data.bio
				const token = setToken(localData)

				dispatch({
					payload: {
						bio: body.data.bio,
						bearer: token
					},
					type: constants.UPDATE_ABOUT
				})
			}
		}
	)
}

export const verifyEmail = ({ code, bearer }) => dispatch => {
	request.post(
		`${window.location.origin}/api/users/verifyEmail`,
		{
			form: {
				code
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			if (!body.error) {
				setToken(body.user)
			}

			dispatch({
				payload: body,
				type: constants.VERIFY_EMAIL
			})
		}
	)
}
