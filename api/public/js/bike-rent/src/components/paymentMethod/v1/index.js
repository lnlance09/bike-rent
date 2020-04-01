import "./style.css"
import "react-credit-cards/es/styles-compiled.css"
import { connect } from "react-redux"
import { Button, Form, Input, Segment } from "semantic-ui-react"
import React, { Component } from "react"
import Cleave from "cleave.js/react"
import Cards from "react-credit-cards"
import PropTypes from "prop-types"

class PaymentMethod extends Component {
	constructor(props) {
		super(props)

		const { card } = this.props

		this.state = {
			cardName: card.name,
			cardNumber: card.number,
			cvc: card.cvc,
			expiry: `${card.expiry.month}${card.expiry.year}`,
			focus: ""
		}
	}

	handleInputFocus = e => this.setState({ focus: e.target.name })

	onChangeCardName = (e, { value }) => this.setState({ cardName: value })

	onChangeCardNumber = e => this.setState({ cardNumber: e.target.rawValue })

	onChangeCvc = (e, { value }) => this.setState({ cvc: value })

	onChangeExpiry = e => this.setState({ expiry: e.target.rawValue })

	render() {
		const { cardName, cardNumber, cvc, expiry, focus } = this.state
		const { displayCard, displayForm } = this.props

		return (
			<Segment>
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
					<Form as={Segment}>
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
						<Button color="blue" content="Checkout" fluid onClick={() => console.log("done")} />
					</Form>
				)}
			</Segment>
		)
	}
}

PaymentMethod.propTypes = {
	card: PropTypes.shape({
		cvc: PropTypes.string,
		expiry: PropTypes.shape({
			month: PropTypes.string,
			year: PropTypes.string
		}),
		name: PropTypes.string,
		number: PropTypes.string
	}),
	displayCard: PropTypes.bool,
	displayForm: PropTypes.bool
}

PaymentMethod.defaultProps = {
	card: {
		cvc: "",
		expiry: {
			month: "",
			year: ""
		},
		name: "",
		number: ""
	},
	displayCard: true,
	displayForm: true
}

export default PaymentMethod
