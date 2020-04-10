import "./style.css"
import "react-credit-cards/es/styles-compiled.css"
import { addPayment } from "./actions"
import { connect, Provider } from "react-redux"
import { Button, Form, Input, Message, Segment } from "semantic-ui-react"
import React, { Component } from "react"
import Cleave from "cleave.js/react"
import Cards from "react-credit-cards"
import PropTypes from "prop-types"
import store from "store"

class PaymentMethod extends Component {
	constructor(props) {
		super(props)

		const { card } = this.props

		this.state = {
			cardName: card.name,
			cardNumber: card.number,
			cvc: card.cvc,
			email: "",
			expiry: `${card.expiry.month}${card.expiry.year}`,
			focus: ""
		}
	}

	handleInputFocus = e => this.setState({ focus: e.target.name })

	onChangeCardName = (e, { value }) => this.setState({ cardName: value })

	onChangeCardNumber = e => this.setState({ cardNumber: e.target.rawValue })

	onChangeCvc = (e, { value }) => this.setState({ cvc: value })

	onChangeEmail = (e, { value }) => this.setState({ email: value })

	onChangeExpiry = e => this.setState({ expiry: e.target.rawValue })

	render() {
		const { cardName, cardNumber, cvc, email, expiry, focus } = this.state
		const {
			bearer,
			buttonText,
			displayButton,
			displayCard,
			displayForm,
			error,
			errorMsg,
			formSize,
			showEmailInput
		} = this.props
		const emailRequired = showEmailInput ? 1 : 0

		return (
			<Provider store={store}>
				<div className="paymentMethod">
					{displayCard && (
						<Cards
							cvc={cvc}
							expiry={expiry}
							focused={focus}
							name={cardName}
							number={cardNumber}
						/>
					)}
					{displayForm && (
						<Form as={Segment} size={formSize}>
							<Form.Field>
								<Cleave
									name="number"
									placeholder="Enter your credit card number"
									options={{ creditCard: true }}
									onChange={this.onChangeCardNumber}
									onFocus={this.handleInputFocus}
									value={cardNumber}
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
										value={expiry}
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
							{showEmailInput && (
								<Form.Field>
									<Input
										icon="mail"
										iconPosition="left"
										name="email"
										onChange={this.onChangeEmail}
										placeholder="Email"
										value={email}
									/>
								</Form.Field>
							)}
							{displayButton && (
								<Button
									color="blue"
									content={buttonText}
									fluid
									onClick={() => {
										this.setState({ focus: "name" }, () => {
											this.props.addPayment({
												bearer,
												callback: this.props.callback,
												cvc,
												email,
												emailRequired,
												expiry,
												name: cardName,
												number: cardNumber
											})
										})
									}}
									size={formSize}
								/>
							)}
						</Form>
					)}
					{error && <Message content={errorMsg} error />}
				</div>
			</Provider>
		)
	}
}

PaymentMethod.propTypes = {
	addPayment: PropTypes.func,
	bearer: PropTypes.string,
	buttonText: PropTypes.string,
	callback: PropTypes.func,
	card: PropTypes.shape({
		cvc: PropTypes.string,
		expiry: PropTypes.shape({
			month: PropTypes.string,
			year: PropTypes.string
		}),
		name: PropTypes.string,
		number: PropTypes.string
	}),
	displayButton: PropTypes.bool,
	displayCard: PropTypes.bool,
	displayForm: PropTypes.bool,
	error: PropTypes.bool,
	errorMsg: PropTypes.string,
	formSize: PropTypes.string,
	showEmailInput: PropTypes.bool
}

PaymentMethod.defaultProps = {
	addPayment,
	buttonText: "Checkout",
	callback: () => null,
	card: {
		cvc: "",
		expiry: {
			month: "",
			year: ""
		},
		name: "",
		number: ""
	},
	displayButton: true,
	displayCard: true,
	displayForm: true,
	error: false,
	formSize: "medium",
	showEmailInput: false
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.payments,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	addPayment
})(PaymentMethod)
