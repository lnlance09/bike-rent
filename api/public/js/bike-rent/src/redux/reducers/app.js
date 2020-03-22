import * as constants from "../constants"

const initial = () => ({
	modalOpen: false
	// settings: {}
})

const settings = (state = initial(), action) => {
	const { emailType, payload } = action

	switch (action.type) {
		case constants.ADD_CITY:
			return {
				...state,
				error: payload.error !== false,
				errorMsg: payload.error
			}

		case constants.EDIT_CSS:
			return {
				...state,
				css: payload
			}

		case constants.EDIT_SITEMAP:
			return {
				...state,
				sitemap: payload
			}

		case constants.GET_CITIES:
			const results =
				payload.page > 0 ? [...state.cities.results, ...payload.results] : payload.results

			return {
				...state,
				cities: {
					count: payload.count,
					hasMore: payload.pagination.hasMore,
					loadingMore: false,
					page: payload.pagination.nextPage,
					results
				}
			}

		case constants.GET_CSS:
			return {
				...state,
				css: payload
			}

		case constants.GET_EMAIL:
			let emails = {}
			if (emailType === "application-confirmation") {
				emails = {
					...state.emails,
					applicationConfirmation: payload
				}
			}

			if (emailType === "confirm-your-email") {
				emails = {
					...state.emails,
					confirmYourEmail: payload
				}
			}

			if (emailType === "order-confirmation") {
				emails = {
					...state.emails,
					orderConfirmation: payload
				}
			}

			if (emailType === "refund") {
				emails = {
					...state.emails,
					refund: payload
				}
			}

			return {
				...state,
				emails
			}

		case constants.GET_SITEMAP:
			return {
				...state,
				sitemap: payload
			}

		case constants.SEND_EMAIL:
			return {
				...state,
				sendEmailError: payload.error
			}

		case constants.SET_LANGUAGES:
			return {
				...state
			}

		case constants.TOGGLE_ADD_CITY_MODAL:
			return {
				...state,
				modalOpen: !state.modalOpen
			}

		default:
			return state
	}
}

export default settings
