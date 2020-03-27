import "./style.css"
import { updateSeo } from "redux/actions/app"
import { connect } from "react-redux"
import { Button, Divider, Form, Header, Icon } from "semantic-ui-react"
import Bikes from "./stores"
import Stores from "./stores"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminPages extends Component {
	constructor(props) {
		super(props)

		const { seo } = this.props

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
		const { bearer, page, type, url } = this.props
		const { seoDescription, seoImage, seoKeywords, seoTitle } = this.state

		const MainContent = () => {
			if (type === "about-page") {
				return <Form></Form>
			}

			if (type === "apply-page") {
				return <Form></Form>
			}

			if (type === "bikes-page") {
				return <Bikes />
			}

			if (type === "checkout-page") {
				return <Form></Form>
			}

			if (type === "cities-page") {
				return <Form></Form>
			}

			if (type === "contact-page") {
				return <Form></Form>
			}

			if (type === "faq-page") {
				return <Form></Form>
			}

			if (type === "home-page") {
				return <Form></Form>
			}

			if (type === "partners-page") {
				return <Form></Form>
			}

			if (type === "search-page") {
				return <Form></Form>
			}

			if (type === "signin-page") {
				return <Form></Form>
			}

			if (type === "stores-page") {
				return <Stores />
			}

			if (type === "terms-page") {
				return <Form></Form>
			}
		}

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
				{MainContent()}
			</div>
		)
	}
}

AdminPages.propTypes = {
	bearer: PropTypes.string,
	page: PropTypes.string,
	seo: PropTypes.shape({
		description: PropTypes.string,
		image: PropTypes.string,
		keywords: PropTypes.string,
		title: PropTypes.string
	}),
	type: PropTypes.string,
	updateSeo: PropTypes.func,
	url: PropTypes.string
}

AdminPages.defaultProps = {
	seo: {},
	updateSeo
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.admin,
	...ownProps
})

export default connect(mapStateToProps, {
	updateSeo
})(AdminPages)
