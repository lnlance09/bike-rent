import React from "react"
import MetaTags from "react-meta-tags"
import { capitalizeWord } from "./textFunctions"

export const DisplayMetaTags = ({ page, props, state }) => {
	const description = ""
	const img = ""
	let metaTags = {}

	switch (page) {
		case "about":
			metaTags = {
				description: description,
				img,
				title: capitalizeWord(state.activeItem)
			}
			break
		default:
			metaTags = {
				description,
				img,
				title: ""
			}
			break
	}

	return (
		<MetaTags>
			<title>{metaTags.title} - Blather</title>
			<meta name="description" content={metaTags.description} />
		</MetaTags>
	)
}