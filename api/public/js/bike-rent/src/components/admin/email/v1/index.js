import "./style.css"
import { editEmail, sendEmail } from "redux/actions/app"
import { connect } from "react-redux"
import {
	Button,
	Divider,
	Form,
	Header,
	Icon,
	Input,
	List,
	Message,
	Segment
} from "semantic-ui-react"
import React, { Component } from "react"
import AceEditor from "react-ace"
import PropTypes from "prop-types"
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/theme-monokai"

class AdminEmail extends Component {
	constructor(props) {
		super(props)

		const { emails } = this.props
		let { applicationConfirmation, confirmYourEmail, orderConfirmation, refund } = emails
		applicationConfirmation = !applicationConfirmation ? "" : applicationConfirmation
		confirmYourEmail = !confirmYourEmail ? "" : confirmYourEmail
		orderConfirmation = !orderConfirmation ? "" : orderConfirmation
		refund = !refund ? "" : refund

		this.state = {
			applicationConfirmation,
			confirmYourEmail,
			email: "",
			orderConfirmation,
			refund
		}
	}

	onChangeEmail = (e, { value }) => this.setState({ email: value })

	render() {
		const { bearer, sendEmailError, type } = this.props
		const {
			applicationConfirmation,
			confirmYourEmail,
			email,
			orderConfirmation,
			refund
		} = this.state

		const EmailEditor = type => {
			let reference = ""
			let value = ""

			if (type === "application-confirmation") {
				reference = (
					<List bulleted size="big">
						<List.Item>
							<b>{"{NAME}"}</b> The name of the person applying
						</List.Item>
					</List>
				)
				value = applicationConfirmation
			}

			if (type === "confirm-your-email") {
				reference = (
					<List bulleted size="big">
						<List.Item>
							<b>{"{NAME}"}</b> The name of the person signing up
						</List.Item>
						<List.Item>
							<b>{"{VERIFICATION_CODE}"}</b> A unique alphanumeric code that is sent
							to every user's email upon signging up
						</List.Item>
					</List>
				)
				value = confirmYourEmail
			}

			if (type === "order-confirmation") {
				reference = (
					<List bulleted size="big">
						<List.Item>
							<b>{"{CARD_NUMBER}"}</b> The number of the card used to complete the
							purchase
						</List.Item>
						<List.Item>
							<b>{"{CARD_TYPE}"}</b> The type (AMEX,VISA,MC,etc..) of card used to
							complete the purchase
						</List.Item>
						<List.Item>
							<b>{"{CONFIRMATION_NUMBER}"}</b> An order number that is auto-generated
							for each and every purchase
						</List.Item>
						<List.Item>
							<b>{"{EXP_MONTH}"}</b> The month portion of the card's expiration date
						</List.Item>
						<List.Item>
							<b>{"{EXP_YEAR}"}</b> The year portion of the card's expiration date
						</List.Item>
						<List.Item>
							<b>{"{SUBTOTAL}"}</b> The total of all items before taxes
						</List.Item>
						<List.Item>
							<b>{"{TAX_PRICE}"}</b> The amount in sales tax paid
						</List.Item>
						<List.Item>
							<b>{"{TOTAL}"}</b> The total amount in USD of the order
						</List.Item>
					</List>
				)
				value = orderConfirmation
			}

			if (type === "refund") {
				reference = (
					<List bulleted size="big">
						<List.Item>
							<b>{"{CONFIRMATION_NUMBER}"}</b> An order number that is auto-generated
							for each and every purchase
						</List.Item>
						<List.Item>
							<b>{"{TOTAL}"}</b> The total amount in USD of the order
						</List.Item>
						<List.Item>
							<b>{"{CARD_NUMBER}"}</b> The number of the card used to complete the
							purchase
						</List.Item>
						<List.Item>
							<b>{"{CARD_TYPE}"}</b> The type (AMEX,VISA,MC,etc..) of card used to
							complete the purchase
						</List.Item>
						<List.Item>
							<b>{"{EXP_MONTH}"}</b> The month portion of the card's expiration date
						</List.Item>
						<List.Item>
							<b>{"{EXP_YEAR}"}</b> The year portion of the card's expiration date
						</List.Item>
					</List>
				)
				value = refund
			}

			return (
				<div>
					<AceEditor
						highlightActiveLine
						fontSize={16}
						mode="html"
						name="emailEditor"
						onChange={code => {
							if (type === "application-confirmation") {
								this.setState({ applicationConfirmation: code })
							}
							if (type === "confirm-your-email") {
								this.setState({ confirmYourEmail: code })
							}
							if (type === "order-confirmation") {
								this.setState({ orderConfirmation: code })
							}
							if (type === "refund") {
								this.setState({ refund: code })
							}
						}}
						theme="monokai"
						value={value}
					/>
					<Divider hidden />

					{reference}

					<Divider />
					<Segment>
						<div
							className="emailRendering"
							dangerouslySetInnerHTML={{ __html: value }}
						/>
					</Segment>
					<Divider />
					<Form error={sendEmailError}>
						<Input
							action={
								<Button
									color="green"
									content="Send a test email"
									onClick={() => this.props.sendEmail({ bearer, email, type })}
								/>
							}
							actionPosition="right"
							fluid
							icon="mail"
							iconPosition="left"
							onChange={this.onChangeEmail}
							placeholder="Enter an email"
							size="big"
							value={email}
						/>
						{sendEmailError && <Message content={sendEmailError} error />}
					</Form>
					<Divider />
					<Button
						color="blue"
						content="Update email"
						fluid
						onClick={() => {
							this.props.editEmail({ bearer, email: value, type })
						}}
						size="big"
					/>
				</div>
			)
		}

		return (
			<div className="adminEmail">
				{type === "application-confirmation" && (
					<div>
						<Header size="huge">Application Confirmation Email</Header>
						<p>
							<Icon name="info" /> This email is sent out immediately after someone
							applies to list their store on here.
						</p>
					</div>
				)}

				{type === "confirm-your-email" && (
					<div>
						<Header size="huge">Email Confirmation Email</Header>
						<p>
							<Icon name="info" /> This email is sent out to each person who registers
							for the site directly after they're done signing up.
						</p>
					</div>
				)}

				{type === "order-confirmation" && (
					<div>
						<Header size="huge">Order Confirmation Email</Header>
						<p>
							<Icon name="info" /> This email is sent out to each person after they
							successfully make a purchase.
						</p>
					</div>
				)}

				{type === "refund" && (
					<div>
						<Header size="huge">Refund Email</Header>
						<p>
							<Icon name="info" /> This email is sent out to each person after they
							request a refund.
						</p>
					</div>
				)}

				<Divider hidden />

				{EmailEditor(type)}
			</div>
		)
	}
}

AdminEmail.propTypes = {
	bearer: PropTypes.string,
	editEmail: PropTypes.func,
	emails: PropTypes.shape({
		applicationConfirmation: PropTypes.string,
		confirmYourEmail: PropTypes.string,
		orderConfirmation: PropTypes.string,
		refund: PropTypes.string
	}),
	sendEmail: PropTypes.func,
	sendEmailError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	type: PropTypes.string
}

AdminEmail.defaultProps = {
	editEmail,
	sendEmail,
	sendEmailError: false
}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	editEmail,
	sendEmail
})(AdminEmail)
