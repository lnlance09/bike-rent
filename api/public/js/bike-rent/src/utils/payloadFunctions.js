export const formatPayload = (page, state) => {
	const {
		backgroundImg,
		ctaBasic,
		ctaColor,
		ctaInverted,
		ctaText,
		ctaVisible,
		description,
		header,
		image,
		partners,
		placeholderText,
		secondSection,
		subheader,
		thirdSection,
		title,
		toastMsg,
		useCards,
		useHeroImage
	} = state

	let payloadData = {
		description,
		hero: {
			headerOne: header,
			headerTwo: subheader,
			img: image
		},
		title,
		useHeroImage
	}

	if (page === "apply-page") {
		payloadData.backgroundImg = backgroundImg
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

	if (page === "home-page") {
		payloadData.firstSection = {}
		payloadData.secondSection = {}
		payloadData.thirdSection = {}
	}

	if (page === "partners-page") {
		payloadData.partners = {}
	}

	return payloadData
}
