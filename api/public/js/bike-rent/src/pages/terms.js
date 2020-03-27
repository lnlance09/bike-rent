import { connect, Provider } from "react-redux"
// import { Container } from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class Terms extends Component {
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

		return (
			<Provider store={store}>
				<div className="mainWrapper termsPage">
					<PageHeader
						activeItem="terms"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						// content={BookingForm}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
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

Terms.propTypes = {
	settings: PropTypes.object
}

Terms.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Terms)
