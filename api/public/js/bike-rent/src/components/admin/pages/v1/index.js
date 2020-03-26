import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
import { Divider, Form, Header, Icon } from "semantic-ui-react"
import Bikes from "./stores"
import Stores from "./stores"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminPages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			url: ""
		}
	}

	render() {
		const { bearer, type } = this.props
		const { url } = this.state

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
				<Form.Input fluid placeholder="Title" />
				<Form.Input fluid placeholder="Description" />
				<Form.Input fluid placeholder="Keywords" />
				<Form.Input fluid placeholder="Image" />
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
