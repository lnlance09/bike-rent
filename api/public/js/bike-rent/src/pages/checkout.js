import { connect, Provider } from "react-redux"
// import { Container } from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class Checkout extends Component {
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
		const { settings } = this.props

		return (
			<Provider store={store}>
				<div className="homePage">
					<PageHeader {...this.props} />

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Checkout.propTypes = {
	settings: PropTypes.object
}

Checkout.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.Admin,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Checkout)
