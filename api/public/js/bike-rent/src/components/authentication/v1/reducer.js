import * as constants from "./constants"
import jwt from "jsonwebtoken"

let authenticated = false
let localData = {}
let verify = false
const token = localStorage.getItem("jwtToken")

jwt.verify(token, "secret", (err, decoded) => {
	if (decoded) {
		authenticated = true
		localData = decoded.data
		verify = !localData.emailVerified ? true : false
	}
})

const initial = () => ({
	authenticated,
	bearer: token,
	data: localData,
	passwordError: false,
	verify
})

const user = (state = initial(), action) => {
	const { payload } = action

	switch (action.type) {
		case constants.ADD_TO_CART:
			return {
				...state,
				data: payload
			}

		case constants.CHANGE_PASSWORD:
			return {
				...state,
				passwordChangeSuccessful: payload.error ? false : true,
				passwordError: payload.error ? true : false,
				passwordErrorMsg: payload.error
			}

		case constants.CHANGE_PROFILE_PIC:
			return {
				...state,
				data: {
					...state.data,
					img: payload.img
				}
			}

		case constants.LINK_FACEBOOK_ACCOUNT:
			return {
				...state,
				bearer: payload.bearer,
				data: {
					...state.data,
					linkedFb: payload.linked_fb,
					fbAccessToken: payload.fb_access_token,
					fbDate: payload.fb_date,
					fbId: payload.fb_id,
					fbUrl: payload.fb_url
				}
			}

		case constants.LOGOUT:
			return {
				...state,
				authenticated: false,
				data: {},
				verify: false
			}

		case constants.RESET_PASSWORD_PROPS:
			return {
				...state,
				loading: false,
				passwordChangeSuccessful: false,
				passwordError: false,
				passwordErrorMsg: ""
			}

		case constants.SET_USER_DATA:
			let authenticated = false
			let loginError = false
			let loginErrorMsg = ""
			let user = {}
			let verify = false

			if (payload.error) {
				loginError = true
				loginErrorMsg = payload.error
			} else {
				if (!payload.user.emailVerified) {
					verify = true
				}

				authenticated = true
				user = {
					email: payload.user.email,
					emailVerified: payload.user.emailVerified,
					name: payload.user.name,
					id: payload.user.id,
					img: payload.user.img,
					username: payload.user.username
				}
			}

			return {
				...state,
				authenticated,
				bearer: payload.bearer,
				data: user,
				loadingLogin: false,
				loadingRegistration: false,
				loginError,
				loginErrorMsg,
				verify
			}

		case constants.SWITCH_TAB:
			return {
				...state,
				loginError: action.tab.tab ? true : false
			}

		case constants.UPDATE_ABOUT:
			return {
				...state,
				bearer: payload.bearer,
				data: {
					...state.data,
					bio: payload.bio
				}
			}

		case constants.VERIFY_EMAIL:
			return {
				...state,
				data: {
					...state.data,
					emailVerified: !payload.error
				},
				loginError: payload.error,
				loginErrorMsg: payload.error
			}

		default:
			return state
	}
}

export default user
