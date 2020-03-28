import * as constants from "../constants"

const initial = () => ({
	blog: {
		error: false,
		modalOpen: false
	},
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

		case constants.ADD_BLOG:
			return {
				...state,
				blog: {
					error: payload.error !== false,
					errorMsg: payload.error
				}
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

		case constants.GET_BLOGS:
			const blogs =
				payload.page > 0 ? [...state.blogs.results, ...payload.results] : payload.results

			return {
				...state,
				blogs: {
					count: payload.count,
					hasMore: payload.pagination.hasMore,
					loadingMore: false,
					page: payload.pagination.nextPage,
					results: blogs
				}
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

		case constants.EDIT_PAGE:
			return {
				...state
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

		case constants.SET_THEME:
			return {
				...state,
				theme: payload.theme
			}

		case constants.SUBMIT_APPLICATION:
			return {
				...state,
				apply: {
					error: payload.error !== false,
					errorMsg: payload.error
				}
			}

		case constants.TOGGLE_ADD_CITY_MODAL:
			return {
				...state,
				modalOpen: !state.modalOpen
			}

		case constants.TOGGLE_EDIT_BLOG_MODAL:
			return {
				...state,
				blog: {
					...state.blog,
					modalOpen: !state.blog.modalOpen
				}
			}

		default:
			return state
	}
}

export default settings
