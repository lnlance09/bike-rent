import React from "react"
import MetaTags from "react-meta-tags"

export const DisplayMetaTags = ({ page, props, seo, state }) => {
	let metaTags = {
		title: "BikeRent.com"
	}

	switch (page) {
		case "admin":
			metaTags = {
				title: "Admin Panel"
			}
			break

		case "about":
		case "apply":
		case "checkout":
		case "contact":
		case "faq":
		case "home":
		case "partners":
		case "signin":
		case "terms":
			metaTags = {
				title: seo.title
			}
			break

		case "bikes":
			if (!props.error && state.id) {
				metaTags = {
					title: props.bike.name
				}
			} else {
				metaTags = {
					title: seo.title
				}
			}
			break

		case "cities":
			if (!props.error && state.id) {
				metaTags = {
					title: props.city.city
				}
			} else {
				metaTags = {
					title: seo.title
				}
			}
			break

		case "stores":
			if (!props.error && state.id) {
				metaTags = {
					title: props.store.name
				}
			} else {
				metaTags = {
					title: seo.title
				}
			}
			break

		default:
			metaTags = {
				title: "BikeRent.com"
			}
			break
	}

	return (
		<MetaTags>
			<title>{metaTags.title}</title>
		</MetaTags>
	)
}
