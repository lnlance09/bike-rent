import { connect, Provider } from "react-redux"
import { Container, Divider, Grid, Header } from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import React, { Component } from "react"
import StepProcess from "components/step/v1/"
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
		const { auth } = this.state
		const { settings } = this.props

		/*
		const CheckoutForm = (

		)
		*/

		return (
			<Provider store={store}>
				<div className="mainWrapper checkoutPage">
					<PageHeader
						activeItem="checkout"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent={false}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>
					<Container className="mainContainer">
						<StepProcess />

						<Divider hidden />

						<Grid className="checkoutGrid">
							<Grid.Column className="leftSide" width={11}>
								<Header size="huge">Checkout</Header>

								<Divider />
							</Grid.Column>
							<Grid.Column className="rightSide" width={5}></Grid.Column>
						</Grid>
					</Container>

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
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Checkout)
