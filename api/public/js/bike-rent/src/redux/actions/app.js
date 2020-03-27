import * as constants from "../constants"
import { toast } from "react-toastify"
import request from "request"

toast.configure({
	autoClose: 4000,
	draggable: false
})

export const addBlog = ({ bearer, entry, title }) => dispatch => {
	request.post(
		`${window.location.origin}/api/blog/create`,
		{
			form: {
				entry,
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
				type: constants.ADD_BLOG
			})

			if (!body.error) {
				toast.success("Blog has been added")
				dispatch(getBlogs())
			}
		}
	)
}

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

export const editBlog = ({ bearer, entry, id, title }) => dispatch => {
	request.post(
		`${window.location.origin}/api/blog/update`,
		{
			form: {
				id,
				entry,
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
				type: constants.EDIT_BLOG
			})

			if (!body.error) {
				toast.success("Your edit was successful")
				dispatch(toggleEditBlogModal())
				dispatch(getBlogs())
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

export const editPage = ({ bearer, data, page }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updatePage`,
		{
			form: {
				data,
				page
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
				type: constants.EDIT_PAGE
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

export const getBlogs = () => dispatch => {
	request.get(
		`${window.location.origin}/api/blog/search`,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_BLOGS
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

			if (!body.error) {
				toast.success("Languages have been updated")
			}
		}
	)
}

export const setTheme = ({ bearer, theme }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateTheme`,
		{
			form: {
				theme
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.SET_THEME
			})

			if (!body.error) {
				toast.success("Theme updated!")
				window.location.reload()
			}
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

			if (!body.error) {
				toast.success("Footer updated!")
			}
		}
	)
}

export const submitHeaderForm = ({
	backgroundColor,
	bearer,
	listItems,
	signInButton,
	signUpButton
}) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateHeader`,
		{
			form: {
				backgroundColor,
				listItems,
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

			if (!body.error) {
				toast.success("Header updated!")
			}
		}
	)
}

export const toggleAddCityModal = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_ADD_CITY_MODAL
	})
}

export const toggleEditBlogModal = () => dispatch => {
	dispatch({
		type: constants.TOGGLE_EDIT_BLOG_MODAL
	})
}

export const updateSeo = ({ bearer, page, seo }) => dispatch => {
	request.post(
		`${window.location.origin}/api/settings/updateSeo`,
		{
			form: {
				page,
				seo
			},
			headers: {
				Authorization: bearer
			},
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.EDIT_SEO
			})

			if (!body.error) {
				toast.success("SEO has been updated!")
			}
		}
	)
}
