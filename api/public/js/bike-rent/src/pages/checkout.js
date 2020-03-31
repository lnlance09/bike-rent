import "react-credit-cards/es/styles-compiled.css"
import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Button, Container, Divider, Form, Grid, Header, Input, Segment } from "semantic-ui-react"
import React, { Component } from "react"
import Cards from "react-credit-cards"
import Cleave from "cleave.js/react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
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
			bearer,
			cardName: "",
			cardNumber: "",
			cvc: "",
			expiry: "",
			focus: ""
		}
	}

	componentDidMount() {}

	handleInputFocus = e => this.setState({ focus: e.target.name })

	onChangeCardName = (e, { value }) => this.setState({ cardName: value })

	onChangeCardNumber = e => this.setState({ cardNumber: e.target.rawValue })

	onChangeCvc = (e, { value }) => this.setState({ cvc: value })

	onChangeExpiry = e => this.setState({ expiry: e.target.rawValue })

	render() {
		const { auth, cardName, cardNumber, cvc, expiry, focus } = this.state
		const { settings } = this.props
		const { checkoutPage } = settings

		const CheckoutForm = (
			<Form as={Segment}>
				<Form.Field>
					<Cleave
						name="number"
						placeholder="Enter your credit card number"
						options={{ creditCard: true }}
						onChange={this.onChangeCardNumber}
						onFocus={this.handleInputFocus}
					/>
				</Form.Field>
				<Form.Field>
					<Input
						name="name"
						onChange={this.onChangeCardName}
						onFocus={this.handleInputFocus}
						placeholder="Name on card"
						value={cardName}
					/>
				</Form.Field>
				<Form.Group widths="equal">
					<Form.Field>
						<Cleave
							name="expiry"
							options={{ date: true, datePattern: ["m", "y"] }}
							placeholder="Valid thru"
							onChange={this.onChangeExpiry}
							onFocus={this.handleInputFocus}
						/>
					</Form.Field>
					<Form.Field>
						<Input
							name="cvc"
							maxLength={4}
							onChange={this.onChangeCvc}
							onFocus={this.handleInputFocus}
							placeholder="CVC"
							value={cvc}
						/>
					</Form.Field>
				</Form.Group>
				<Button color="blue" content="Checkout" fluid onClick={() => console.log("done")} />
			</Form>
		)

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="checkout"
					props={this.props}
					seo={checkoutPage.seo}
					state={this.state}
				/>

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
						<StepProcess activeItem="checkout" index={2} />

						<Divider hidden />

						<Header size="huge">Checkout</Header>
						<Divider />

						<Grid className="checkoutGrid">
							<Grid.Column className="leftSide" width={11}>
								<Segment>
									<Cards
										cvc={cvc}
										expiry={expiry}
										focused={focus}
										name={cardName}
										number={cardNumber}
									/>
									{CheckoutForm}
								</Segment>
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
