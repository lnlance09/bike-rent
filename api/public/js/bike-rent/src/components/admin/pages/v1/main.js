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
			backgroundImg,
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

		let ctaBasic,
			ctaColor,
			ctaInverted,
			ctaText = null
		if (ctaButton) {
			let { ctaBasic, ctaColor, ctaInverted, ctaText } = ctaButton
		}

		this.state = {
			backgroundImg,
			cardsPages: ["bikes-page", "cities-page", "stores-page"],
			ctaBasic,
			ctaColor,
			ctaInverted,
			ctaText,
			description,
			firstSection,
			header: hero.headerTwo,
			image: hero.img,
			partners,
			placeholderText,
			secondSection,
			subheader: hero.headerOne,
			thirdSection,
			title,
			toastMsg,
			useCards,
			useHeroImage: useHeroImage === "1" ? 1 : 0
		}
	}

	onChangeBackgroundImg = (e, { value }) => this.setState({ backgroundImg: value })

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

	render() {
		const { bearer, page, type } = this.props
		const {
			backgroundImg,
			cardsPages,
			ctaBasic,
			ctaColor,
			ctaInverted,
			ctaText,
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
		} = this.state
		console.log("main")
		console.log(this.state)
		console.log(this.props)

		const payload = formatPayload(type, this.state)

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

					{type === "apply-page" && (
						<Fragment>
							<Form.Field>
								<label>Background Image</label>
								<Input
									onChange={this.onChangeBackgroundImg}
									placeholder="Background Image"
									value={backgroundImg}
								/>
							</Form.Field>
						</Fragment>
					)}

					{type === "contact-page" && (
						<Fragment>
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

					{cardsPages.includes(type) && (
						<Fragment>
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
						</Fragment>
					)}

					{type === "contact-page" && (
						<Fragment>
							<EditButton
								basic={ctaBasic}
								color={ctaColor}
								inverted={ctaInverted}
								text={ctaText}
								title="Call-to-action button"
								toggleBasic={this.toggleCtaBasic}
								toggleInverted={this.toggleCtaInverted}
								changeColor={this.onChangeCtaColor}
								changeText={this.onChangeCtaText}
							/>
						</Fragment>
					)}

					<Form.Field>
						<label>Title</label>
						<Input onChange={this.onChangeTitle} placeholder="Title" value={title} />
					</Form.Field>
					<Form.Field>
						<label>Description</label>
						<AceEditor
							fontSize={16}
							highlightActiveLine
							mode="html"
							name="cssEditor"
							onChange={code => this.setState({ description: code })}
							theme="monokai"
							value={description}
						/>
					</Form.Field>

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
		backgroundImg: PropTypes.string,
		ctaButton: PropTypes.shape({
			basic: PropTypes.bool,
			color: PropTypes.string,
			inverted: PropTypes.bool,
			title: PropTypes.string
		}),
		description: PropTypes.string,
		firstSection: PropTypes.shape({
			button: PropTypes.shape({
				basic: PropTypes.bool,
				color: PropTypes.string,
				inverted: PropTypes.bool,
				link: PropTypes.string,
				text: PropTypes.string
			}),
			img: PropTypes.string,
			items: PropTypes.arrayOf(
				PropTypes.shape({
					subtitle: PropTypes.string,
					title: PropTypes.string
				})
			)
		}),
		hero: PropTypes.shape({
			headerOne: PropTypes.string,
			headerTwo: PropTypes.string,
			img: PropTypes.string
		}),
		partners: PropTypes.arrayOf(
			PropTypes.shape({
				img: PropTypes.string,
				title: PropTypes.string
			})
		),
		placeholderText: PropTypes.string,
		secondSection: PropTypes.arrayOf(
			PropTypes.shape({
				subtitle: PropTypes.string,
				title: PropTypes.string
			})
		),
		signInButton: PropTypes.shape({
			basic: PropTypes.bool,
			color: PropTypes.string,
			inverted: PropTypes.bool,
			text: PropTypes.string
		}),
		thirdSection: PropTypes.shape({
			divider: PropTypes.shape({
				text: PropTypes.string
			}),
			firstItem: PropTypes.shape({
				subtitle: PropTypes.string,
				title: PropTypes.string
			}),
			secondItem: PropTypes.shape({
				subtitle: PropTypes.string,
				title: PropTypes.string
			})
		}),
		title: PropTypes.string,
		toastMsg: PropTypes.string,
		useCards: PropTypes.bool,
		useHeroImage: PropTypes.bool
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
