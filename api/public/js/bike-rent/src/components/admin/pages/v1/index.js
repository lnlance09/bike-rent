import "./style.css"
import { updateSeo } from "redux/actions/app"
import { connect } from "react-redux"
import { Button, Divider, Form, Header, Icon } from "semantic-ui-react"
import MainPage from "./main"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminPages extends Component {
	constructor(props) {
		super(props)

		const { seo } = this.props.pageData

		this.state = {
			seoDescription: seo.description,
			seoImage: seo.image,
			seoKeywords: seo.keywords,
			seoTitle: seo.title
		}
	}

	onChangeSeoDescription = (e, { value }) => this.setState({ seoDescription: value })

	onChangeSeoImage = (e, { value }) => this.setState({ seoImage: value })

	onChangeSeoKeywords = (e, { value }) => this.setState({ seoKeywords: value })

	onChangeSeoTitle = (e, { value }) => this.setState({ seoTitle: value })

	render() {
		const { bearer, page, pageData, type, url } = this.props
		const { seoDescription, seoImage, seoKeywords, seoTitle } = this.state

		const SeoPanel = (
			<Form>
				<Header as="h1" content="Seo - Meta Tags" />
				<Form.Input
					fluid
					label="Title"
					onChange={this.onChangeSeoTitle}
					placeholder="Title"
					value={seoTitle}
				/>
				<Form.Input
					fluid
					label="Description"
					maxLength={140}
					onChange={this.onChangeSeoDescription}
					placeholder="Description"
					value={seoDescription}
				/>
				<Form.Input
					fluid
					label="Keywords (comma seperated)"
					onChange={this.onChangeSeoKeywords}
					placeholder="Keywords"
					value={seoKeywords}
				/>
				<Form.Input
					fluid
					label="Image"
					onChange={this.onChangeSeoImage}
					placeholder="Image"
					value={seoImage}
				/>
				<Form.Field>
					<Icon color="blue" name="facebook" />
					<a
						href={`https://developers.facebook.com/tools/debug/?q=${url}`}
						rel="noopener noreferrer"
						target="_blank"
					>
						See how Facebook views this page
					</a>
				</Form.Field>
				<Button
					color="blue"
					content="Update SEO"
					fluid
					onClick={() => {
						this.props.updateSeo({
							bearer,
							page,
							seo: {
								description: seoDescription,
								image: seoImage,
								keywords: seoKeywords,
								title: seoTitle
							}
						})
					}}
				/>
			</Form>
		)

		return (
			<div className="adminPages">
				{SeoPanel}
				<Divider hidden />
				<MainPage bearer={bearer} page={page} pageData={pageData} type={type} />
			</div>
		)
	}
}

AdminPages.propTypes = {
	bearer: PropTypes.string,
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
	type: PropTypes.string,
	updateSeo: PropTypes.func,
	url: PropTypes.string
}

AdminPages.defaultProps = {
	pageData: {
		seo: {}
	},
	updateSeo
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.admin,
	...ownProps
})

export default connect(mapStateToProps, {
	updateSeo
})(AdminPages)
