import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import { getPaymentMethods } from "redux/actions/order"
import { Button, Container, Divider, Grid, Header, List } from "semantic-ui-react"
import React, { Component } from "react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PaymentMethod from "components/paymentMethod/v1/"
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
		const cart = user.data.cart

		this.state = {
			auth,
			bearer,
			cart
		}
	}

	componentDidMount() {
		const { auth, bearer } = this.state
		if (auth) {
			this.props.getPaymentMethods({ bearer })
		}
	}

	render() {
		const { auth, bearer, cart } = this.state
		const { methods, settings } = this.props
		const { checkoutPage } = settings

		console.log("cart")
		console.log(cart)

		const RenderCart = (
			<List relaxed="very" size="big" verticalAlign="middle">
				{cart.items.map((item, i) => (
					<List.Item key={`cartItem${i}`}>
						<List.Content floated="right">
							<Button.Group floated="right">
								<Button
									basic
									color="green"
									icon="plus"
								/>
								<Button
									basic
									color="blue"
									icon="minus"
								/>
								<Button
									basic
									color="red"
									icon="trash"
								/>
							</Button.Group>
						</List.Content>
						<List.Content>
							<List.Header>{item.bike.name}</List.Header>
							<List.Description>{item.bike.description}</List.Description>
							1 hour
						</List.Content>
					</List.Item>
				))}
			</List>
		)

		const RenderMethods = () => {
			if (auth) {
				return methods.map((method, i) => (
					<PaymentMethod
						card={{
							cvc: method.cvc,
							expiry: {
								month: method.exp_month,
								year: method.exp_year
							},
							name: method.name,
							number: method.number
						}}
						displayForm={false}
					/>
				))
			}
		}

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
								{!auth && (
									<PaymentMethod
										
									/>
								)}
								{RenderMethods()}
							</Grid.Column>
							<Grid.Column className="rightSide" width={5}>
								{RenderCart}
							</Grid.Column>
						</Grid>
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Checkout.propTypes = {
	getPaymentMethods: PropTypes.func,
	methods: PropTypes.arrayOf(PropTypes.shape({
		created_at: PropTypes.string,
		exp_month: PropTypes.string,
		exp_year: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		number: PropTypes.string,
		preferred: PropTypes.string,
		user_id: PropTypes.string
	})),
	settings: PropTypes.object
}

Checkout.defaultProps = {
	getPaymentMethods,
	methods: []
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.order,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	getPaymentMethods
})(Checkout)
