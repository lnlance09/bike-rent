import * as constants from "../constants"

const initial = () => ({
	bike: {
		error: false,
		modalOpen: false
	},
	blog: {
		error: false,
		modalOpen: false
	},
	city: {
		error: false,
		modalOpen: false
	},
	store: {
		error: false,
		modalOpen: false
	}
})

const settings = (state = initial(), action) => {
	const { emailType, payload } = action

	switch (action.type) {
		case constants.ADD_BIKE:
			return {
				...state,
				bike: {
					...state.bike,
					error: payload.error !== false,
					errorMsg: payload.error
				}
			}

		case constants.ADD_BLOG:
			return {
				...state,
				blog: {
					...state.blog,
					error: payload.error !== false,
					errorMsg: payload.error
				}
			}

		case constants.ADD_CITY:
			return {
				...state,
				city: {
					...state.city,
					error: payload.error !== false,
					errorMsg: payload.error
				}
			}

		case constants.ADD_STORE:
			return {
				...state,
				store: {
					...state.store,
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

		case constants.GET_BIKES:
			const bikes =
				payload.page > 0 ? [...state.bikes.results, ...payload.results] : payload.results

			return {
				...state,
				bikes: {
					count: payload.count,
					hasMore: payload.pagination.hasMore,
					loadingMore: false,
					page: payload.pagination.nextPage,
					results: bikes
				}
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

		case constants.GET_STORES:
			const stores =
				payload.page > 0 ? [...state.store.results, ...payload.results] : payload.results

			return {
				...state,
				stores: {
					...state.store,
					count: payload.count,
					hasMore: payload.pagination.hasMore,
					loadingMore: false,
					page: payload.pagination.nextPage,
					results: stores
				}
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

		case constants.TOGGLE_ADD_BIKE_MODAL:
			return {
				...state,
				bike: {
					...state.bike,
					modalOpen: !state.bike.modalOpen
				}
			}

		case constants.TOGGLE_ADD_CITY_MODAL:
			return {
				...state,
				city: {
					...state.city,
					modalOpen: !state.city.modalOpen
				}
			}

		case constants.TOGGLE_ADD_STORE_MODAL:
			return {
				...state,
				store: {
					...state.store,
					modalOpen: !state.store.modalOpen
				}
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
