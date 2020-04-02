export const formatPayload = (page, state) => {
	const {
		content,
		ctaBasic,
		ctaColor,
		ctaInverted,
		ctaText,
		ctaVisible,
		description,
		header,
		image,
		placeholderText,
		subheader,
		title,
		toastMsg,
		useCards,
		useHeroImage
	} = state

	let payloadData = {
		content,
		description,
		hero: {
			headerOne: header,
			headerTwo: subheader,
			img: image
		},
		title,
		useHeroImage
	}

	if (
		page === "apply-page" ||
		page === "bikes-page" ||
		page === "cities-page" ||
		page === "stores-page" ||
		page === "signin-page"
	) {
		payloadData.ctaButton = {
			basic: ctaBasic,
			color: ctaColor,
			inverted: ctaInverted,
			text: ctaText,
			visible: ctaVisible
		}
	}

	if (page === "bikes-page" || page === "cities-page" || page === "stores-page") {
		payloadData.useCards = useCards
	}

	if (page === "contact-page") {
		payloadData.placeholderText = placeholderText
		payloadData.toastMsg = toastMsg
	}

	return payloadData
}
