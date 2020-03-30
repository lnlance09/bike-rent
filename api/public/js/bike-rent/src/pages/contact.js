import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
// import { Container } from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class Contact extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer
		}
	}

	componentDidMount() {}

	render() {
		const { auth } = this.state
		const { settings } = this.props
		const { contactPage } = settings

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="contact"
					props={this.props}
					seo={contactPage.seo}
					state={this.state}
				/>

				<div className="mainWrapper contactPage">
					<PageHeader
						activeItem="contact"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						// content={BookingForm}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Contact.propTypes = {
	settings: PropTypes.object
}

Contact.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Contact)
