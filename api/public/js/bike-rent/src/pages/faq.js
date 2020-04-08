import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
// import { Container } from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class Faq extends Component {
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
		const { faqPage } = settings

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="faq"
					props={this.props}
					seo={faqPage.seo}
					state={this.state}
				/>
				<div className="mainWrapper faqPage">
					<PageHeader
						activeItem="faq"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						// content={BookingForm}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						logo={settings.header.logo}
						logoText={settings.header.logoText}
						showMainContent={false}
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

Faq.propTypes = {
	settings: PropTypes.object
}

Faq.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Faq)
