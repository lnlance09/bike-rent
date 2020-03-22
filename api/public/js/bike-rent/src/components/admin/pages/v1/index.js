import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
import { Divider, Form, Header } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminPages extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const { bearer, type } = this.props

		const MainContent = () => {
			if (type === "about-page") {
				return <Form></Form>
			}

			if (type === "apply-page") {
				return <Form></Form>
			}

			if (type === "bikes-page") {
				return <Form></Form>
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
				return <Form></Form>
			}

			if (type === "terms-page") {
				return <Form></Form>
			}
		}

		const SeoPanel = (
			<Form>
				<Header as="h1" content="Seo - Meta Tags" />
				<Form.Input fluid placeholder="Title" />
				<Form.Input fluid placeholder="Description" />
				<Form.Input fluid placeholder="Keywords" />
				<Form.Input fluid placeholder="Image" />
			</Form>
		)

		return (
			<div className="adminPages">
				{SeoPanel}
				{MainContent()}
			</div>
		)
	}
}

AdminPages.propTypes = {
	bearer: PropTypes.string,
	type: PropTypes.string
}

AdminPages.defaultProps = {}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	// fetchData
})(AdminPages)
