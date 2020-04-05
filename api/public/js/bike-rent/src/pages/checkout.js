import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import { editItemHour, removeFromCart } from "components/authentication/v1/actions"
import { Button, Container, Divider, Grid, Header } from "semantic-ui-react"
import { Link } from "react-router-dom"
import React, { Component, Fragment } from "react"
import Cart from "components/cart/v1/"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PaymentsList from "components/paymentMethod/v1/list/"
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

		this.state = {
			auth,
			bearer
		}
	}

	componentDidMount() {
		
	}

	render() {
		const { auth, bearer } = this.state
		const { data, settings } = this.props
		const { checkoutPage } = settings
		const { cart } = data
		const storeInfo = cart.items[0].store
		console.log("props")
		console.log(this.props)
		console.log(storeInfo)

		const StoreInfo = store => (
			<div>
				<Header>
					<Link to={`/stores/${store.id}`}>{store.name}</Link>
				</Header>
				<Header style={{ marginTop: 0 }}>
					{store.address}
					<Header.Subheader>
						{store.city}, {store.state}
					</Header.Subheader>
				</Header>
			</div>
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

						<Header dividing size="huge">Checkout</Header>

						<Grid className="checkoutGrid">
							<Grid.Column className="leftSide" width={10}>
								{auth ? (
									<Fragment>
										{StoreInfo(storeInfo)}
										<Header>Choose a payment method</Header>
										<PaymentsList bearer={bearer} />
									</Fragment>
								) : (
									<Fragment>
										<PaymentMethod
											showForm
										/>
									</Fragment>
								)}
							</Grid.Column>
							<Grid.Column className="rightSide" width={6}>
								<Cart
									addItemHour={(index, item) => {
										this.props.editItemHour({ add: true, index, item })
									}}
									items={cart.items}
									removeFromCart={index => {
										this.props.removeFromCart({ index })
									}}
									removeItemHour={(index, item) => {
										this.props.editItemHour({ add: false, index, item })
									}}
								/>
								<Divider />
								<Button
									color="blue"
									content="Complete Purchase"
									fluid
									size="big"
								/>
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
	editItemHour: PropTypes.func,
	removeFromCart: PropTypes.func,
	settings: PropTypes.object
}

Checkout.defaultProps = {
	editItemHour,
	removeFromCart
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.order,
		...state.user,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	editItemHour,
	removeFromCart
})(Checkout)
