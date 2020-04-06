import "./style.css"
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/theme-monokai"
import { editPage } from "redux/actions/app"
import { formatPayload } from "utils/payloadFunctions"
import { capitalizeWord } from "utils/textFunctions"
import { connect } from "react-redux"
import { Button, Divider, Form, Header, Input, Radio } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import EditButton from "./button"
import AceEditor from "react-ace"
import PropTypes from "prop-types"

class MainPage extends Component {
	constructor(props) {
		super(props)

		const {
			content,
			ctaButton,
			description,
			firstSection,
			hero,
			partners,
			placeholderText,
			secondSection,
			thirdSection,
			title,
			toastMsg,
			useCards,
			useHeroImage
		} = this.props.pageData

		let ctaBasic = 0
		let ctaColor = ""
		let ctaInverted = 0
		let ctaText = ""
		let ctaVisible = 0
		if (ctaButton) {
			const { basic, color, inverted, text, visible } = ctaButton
			ctaBasic = basic
			ctaColor = color
			ctaInverted = inverted
			ctaText = text
			ctaVisible = visible
		}

		this.state = {
			cardsPages: ["bikes-page", "cities-page", "stores-page"],
			content,
			contentPages: [
				"about-page",
				"apply-page",
				"faq-page",
				"home-page",
				"partners-page",
				"terms-page"
			],
			ctaBasic: ctaBasic === "1" ? 1 : 0,
			ctaColor,
			ctaInverted: ctaInverted === "1" ? 1 : 0,
			ctaText,
			ctaVisible: ctaVisible === "1" ? 1 : 0,
			description,
			firstSection,
			header: hero.headerOne,
			image: hero.img,
			partners,
			placeholderText,
			secondSection,
			subheader: hero.headerTwo,
			thirdSection,
			title,
			toastMsg,
			useCards: useCards === "1" ? 1 : 0,
			useHeroImage: useHeroImage === "1" ? 1 : 0
		}
	}

	onChangeContent = (e, { value }) => this.setState({ content: value })

	onChangeCtaColor = (e, { value }) => this.setState({ ctaColor: value })

	onChangeCtaText = (e, { value }) => this.setState({ ctaText: value })

	onChangeDescription = (e, { value }) => this.setState({ description: value })

	onChangeHeroHeader = (e, { value }) => this.setState({ header: value })

	onChangeHeroImage = (e, { value }) => this.setState({ image: value })

	onChangeHeroSubHeader = (e, { value }) => this.setState({ subheader: value })

	onChangePlaceholderText = (e, { value }) => this.setState({ placeholderText: value })

	onChangeTitle = (e, { value }) => this.setState({ title: value })

	onChangeToastMsg = (e, { value }) => this.setState({ toastMsg: value })

	toggleCtaBasic = (e, { value }) => this.setState({ ctaBasic: value === "on" ? 1 : 0 })

	toggleCards = (e, { value }) => this.setState({ useCards: value === "on" ? 1 : 0 })

	toggleCtaInverted = (e, { value }) => this.setState({ ctaInverted: value === "on" ? 1 : 0 })

	toggleHeroImage = (e, { value }) => this.setState({ useHeroImage: value === "on" ? 1 : 0 })

	toggleCtaVisibility = (e, { value }) => this.setState({ ctaVisible: value === "on" ? 1 : 0 })

	render() {
		const { bearer, page, type } = this.props
		const {
			cardsPages,
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
		} = this.state

		const payload = formatPayload(type, this.state)

		const isContentPage =
			!cardsPages.includes(type) && type !== "signin-page" && type !== "checkout-page"

		const BasicInfo = (
			<Fragment>
				<Form.Field>
					<label>Title</label>
					<Input onChange={this.onChangeTitle} placeholder="Title" value={title} />
				</Form.Field>
				<Form.Field>
					<label>Description</label>
					<Input
						onChange={this.onChangeDescription}
						placeholder="Description"
						value={description}
					/>
				</Form.Field>
			</Fragment>
		)

		const CardPageInfo = () => {
			let editButton = (
				<Fragment>
					<EditButton
						basic={ctaBasic}
						changeColor={this.onChangeCtaColor}
						changeText={this.onChangeCtaText}
						color={ctaColor}
						inverted={ctaInverted}
						text={ctaText}
						title="Call-to-action button"
						toggleBasic={this.toggleCtaBasic}
						toggleInverted={this.toggleCtaInverted}
						toggleVisibility={this.toggleCtaVisibility}
						visible={ctaVisible}
					/>
					<Divider hidden />
				</Fragment>
			)

			return (
				<Fragment>
					{BasicInfo}
					<Form.Field>
						<label>Items Display</label>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={useCards === 1}
							label="Use cards"
							name="useCards"
							onChange={this.toggleCards}
							value="on"
						/>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={useCards === 0}
							label="Use list"
							name="useCards"
							onChange={this.toggleCards}
							value="off"
						/>
					</Form.Field>
					{editButton}
				</Fragment>
			)
		}

		return (
			<div className="adminPage">
				<Header size="huge">{capitalizeWord(type.replace("-", " "))}</Header>
				<Form>
					<Form.Field>Use Hero Section</Form.Field>
					<Form.Field>
						<Radio
							checked={useHeroImage === 1}
							label="Yes"
							name="useHeroImage"
							onChange={this.toggleHeroImage}
							value="on"
						/>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={useHeroImage === 0}
							label="No"
							name="useHeroImage"
							onChange={this.toggleHeroImage}
							value="off"
						/>
					</Form.Field>
					<div style={{ paddingLeft: "20px" }}>
						<Form.Field disabled={useHeroImage === 0}>
							<label>Header</label>
							<Input
								onChange={this.onChangeHeroHeader}
								placeholder="Header"
								value={header}
							/>
						</Form.Field>
						<Form.Field disabled={useHeroImage === 0}>
							<label>Sub header</label>
							<Input
								onChange={this.onChangeHeroSubHeader}
								placeholder="Subheader"
								value={subheader}
							/>
						</Form.Field>
						<Form.Field disabled={useHeroImage === 0}>
							<label>Image</label>
							<Input
								onChange={this.onChangeHeroImage}
								placeholder="Image"
								value={image}
							/>
						</Form.Field>
					</div>

					<Divider hidden />

					{cardsPages.includes(type) && CardPageInfo()}

					{type === "contact-page" && (
						<Fragment>
							{BasicInfo}
							<Form.Field>
								<label>Placeholder Text</label>
								<Input
									onChange={this.onChangePlaceholderText}
									placeholder="Placeholder Text"
									value={placeholderText}
								/>
							</Form.Field>
							<Form.Field>
								<label>Toast Message</label>
								<Input
									onChange={this.onChangeToastMsg}
									placeholder="Toast Message"
									value={toastMsg}
								/>
							</Form.Field>
						</Fragment>
					)}

					{isContentPage && (
						<Fragment>
							{type === "apply-page" && BasicInfo}
							<Form.Field>
								<label>Content</label>
								<AceEditor
									fontSize={16}
									highlightActiveLine
									minLines={100}
									mode="html"
									name="cssEditor"
									onChange={code => this.setState({ content: code })}
									theme="monokai"
									value={content}
								/>
							</Form.Field>
						</Fragment>
					)}

					<Divider />

					<Button
						color="blue"
						content="Edit"
						fluid
						onClick={() => {
							this.props.editPage({
								bearer,
								data: payload,
								page
							})
						}}
					/>
				</Form>
			</div>
		)
	}
}

MainPage.propTypes = {
	bearer: PropTypes.string,
	editPage: PropTypes.func,
	page: PropTypes.string,
	pageData: PropTypes.shape({
		content: PropTypes.string,
		ctaButton: PropTypes.shape({
			basic: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
			color: PropTypes.string,
			inverted: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
			title: PropTypes.string,
			visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
		}),
		description: PropTypes.string,
		hero: PropTypes.shape({
			headerOne: PropTypes.string,
			headerTwo: PropTypes.string,
			img: PropTypes.string
		}),
		placeholderText: PropTypes.string,
		signInButton: PropTypes.shape({
			basic: PropTypes.bool,
			color: PropTypes.string,
			inverted: PropTypes.bool,
			text: PropTypes.string
		}),
		title: PropTypes.string,
		toastMsg: PropTypes.string,
		useCards: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
		useHeroImage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
	}),
	type: PropTypes.string
}

MainPage.defaultProps = {
	editPage,
	pageData: {}
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.page,
	...ownProps
})

export default connect(mapStateToProps, {
	editPage
})(MainPage)
