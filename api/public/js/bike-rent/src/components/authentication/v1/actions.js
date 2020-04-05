import * as constants from "./constants"
import { toast } from "react-toastify"
import { defaultData, parseJwt, setToken } from "utils/token"
import jwt from "jsonwebtoken"
import request from "request"

toast.configure({
	autoClose: 4000,
	draggable: false
})

export const addToCart = ({ item }) => dispatch => {
	let localData = parseJwt()
	if (!localData) {
		localData = defaultData
	}

	const { cart } = localData
	const itemCount = cart.items.length
	item.item.index = parseInt(itemCount + 1, 10)
	item.item.hours = 1

	const items = [...cart.items, item.item]
	localData.cart = {
		...cart,
		items
	}

	setToken(localData)
	toast.success("Added to cart")
	dispatch({
		payload: localData,
		type: constants.ADD_TO_CART
	})
}

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
					localData.user.img = body.img
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

export const editItemHour = ({ add, index, item }) => dispatch => {
	let localData = parseJwt()
	if (!localData) {
		localData = defaultData
	}

	for (let i = 0; i < localData.cart.items.length; i++) {
		const item = localData.cart.items[i]
		if (item.index === index) {
			if (add) {
				localData.cart.items[i].hours++
			}

			if (!add) {
				localData.cart.items[i].hours--
			}
			break
		}
	}

	setToken(localData)
	dispatch({
		payload: localData,
		type: constants.EDIT_ITEM_HOUR
	})
}

export const logout = () => dispatch => {
	localStorage.removeItem("jwtToken")
	dispatch({
		type: constants.LOGOUT
	})
}

export const removeFromCart = ({ item }) => dispatch => {
	let localData = parseJwt()
	if (!localData) {
		localData = defaultData
	}

	const { cart } = localData
	const items = [...cart.items, item.item]
	localData.cart = {
		...cart,
		items
	}

	setToken(localData)
	dispatch({
		payload: localData,
		type: constants.REMOVE_FROM_CART
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
				let localData = parseJwt()
				if (!localData) {
					localData = defaultData
				}
				localData.user = body.user

				const token = setToken(localData)
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
				let localData = parseJwt()
				if (!localData) {
					localData = defaultData
				}
				localData.user = body.user

				const token = setToken(localData)
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
				let localData = parseJwt()
				if (!localData) {
					localData = defaultData
				}
				localData.user = body.user
				setToken(localData)
			}

			dispatch({
				payload: body,
				type: constants.VERIFY_EMAIL
			})
		}
	)
}
