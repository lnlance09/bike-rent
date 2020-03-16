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

const test = (state = initial(), action) => {
	switch (action.type) {
		case constants.CHANGE_PASSWORD:
			return {
				...state,
				passwordChangeSuccessful: action.payload.error ? false : true,
				passwordError: action.payload.error ? true : false,
				passwordErrorMsg: action.payload.error
			}

		case constants.CHANGE_PROFILE_PIC:
			return {
				...state,
				data: {
					...state.data,
					img: action.payload.img
				}
			}

		case constants.LINK_FACEBOOK_ACCOUNT:
			return {
				...state,
				bearer: action.payload.bearer,
				data: {
					...state.data,
					linkedFb: action.payload.linked_fb,
					fbAccessToken: action.payload.fb_access_token,
					fbDate: action.payload.fb_date,
					fbId: action.payload.fb_id,
					fbUrl: action.payload.fb_url
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

			if (action.payload.error) {
				loginError = true
				loginErrorMsg = action.payload.error
			} else {
				if (!action.payload.user.emailVerified) {
					verify = true
				}

				authenticated = true
				user = {
					email: action.payload.user.email,
					emailVerified: action.payload.user.emailVerified,
					name: action.payload.user.name,
					id: action.payload.user.id,
					img: action.payload.user.img,
					username: action.payload.user.username
				}
			}

			return {
				...state,
				authenticated,
				bearer: action.payload.bearer,
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
				bearer: action.payload.bearer,
				data: {
					...state.data,
					bio: action.payload.bio
				}
			}

		case constants.VERIFY_EMAIL:
			return {
				...state,
				data: {
					...state.data,
					emailVerified: !action.payload.error
				},
				loginError: action.payload.error,
				loginErrorMsg: action.payload.error
			}

		default:
			return state
	}
}

export default test
