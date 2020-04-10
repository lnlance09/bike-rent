import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import { createOrder, toggleConfirmationModal } from "redux/actions/order"
import { editItemHour, removeFromCart } from "components/authentication/v1/actions"
import {
	Button,
	Container,
	Divider,
	Grid,
	Header,
	Message,
	Modal,
	Segment,
	Transition
} from "semantic-ui-react"
import { Link } from "react-router-dom"
import React, { Component, Fragment } from "react"
import Cart from "components/cart/v1/"
import Confetti from "react-confetti"
import MapBox from "components/mapBox/v1/"
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
		const userData = user.data

		this.state = {
			auth,
			bearer,
			email: "",
			paymentId: null,
			showForm: true,
			userData: userData.user
		}
	}

	componentDidMount() {}

	setEmail = email => this.setState({ email })

	setPaymentId = id => this.setState({ paymentId: id })

	toggleForm = () => this.setState({ showForm: !this.state.showForm })

	render() {
		const { auth, bearer, email, paymentId, showForm, userData } = this.state
		const { data, order, settings } = this.props
		const { checkoutPage } = settings
		const { cart } = data
		const cartEmpty = cart.items.length === 0
		const storeInfo = !cartEmpty ? cart.items[0].store : {}

		const ConfirmationModal = (
			<Transition animation="zoom" duration={500} visible={order.confirmationModalOpen}>
				<Modal
					centered={false}
					className="confirmationModal"
					closeIcon
					dimmer="inverted"
					onClose={() => window.location.reload()}
					open={order.confirmationModalOpen}
					size="small"
				>
					<Modal.Content>
						<Header size="huge" textAlign="center">
							Congratulations
						</Header>
						<Modal.Description>
							<Header size="big">
								Check your email for a confirmation at{" "}
								{auth ? userData.email : email}
							</Header>
						</Modal.Description>
					</Modal.Content>
				</Modal>
			</Transition>
		)

		const StoreInfo = store => (
			<div>
				<Header style={{ marginBottom: 0 }}>
					<Link to={`/stores/${store.id}`}>{store.name}</Link>
				</Header>
				<Header size="small" style={{ marginTop: 0 }}>
					{store.address}
					<Header.Subheader>
						{store.city}, {store.state}
					</Header.Subheader>
				</Header>
				{storeInfo.lat > 0 && (
					<MapBox
						height="300px"
						lat={storeInfo.lat}
						lng={storeInfo.lon}
						markerId={storeInfo.id}
						markers={[
							{
								id: storeInfo.id,
								lat: storeInfo.lat,
								lon: storeInfo.lon
							}
						]}
						width="100%"
						zoom={12}
					/>
				)}
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
						logo={settings.header.logo}
						logoText={settings.header.logoText}
						showMainContent={false}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>
					<Container className="mainContainer">
						<StepProcess activeItem="checkout" index={2} />
						<Divider hidden />

						<Header size="huge">Checkout</Header>

						<Grid className="checkoutGrid" stackable>
							<Grid.Column className="leftSide" width={10}>
								{!cartEmpty ? (
									<Fragment>
										{StoreInfo(storeInfo)}

										{auth && (
											<Fragment>
												<Header>Choose a payment method</Header>
												<PaymentsList
													bearer={bearer}
													onClick={id => this.setPaymentId(id)}
												/>
											</Fragment>
										)}

										<Header size="large">
											Add a card
										</Header>

										<PaymentMethod
											bearer={bearer}
											buttonText="Use this card"
											callback={(id, email) => {
												this.setPaymentId(id)
												this.setEmail(email)
												this.toggleForm()
											}}
											displayForm={showForm}
											showEmailInput={!auth}
										/>
									</Fragment>
								) : (
									<Segment placeholder>
										<Header icon size="large">
											Your cart is empty
										</Header>
									</Segment>
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
									disabled={cartEmpty}
									fluid
									onClick={() => {
										this.props.createOrder({
											bearer,
											cart,
											email,
											paymentId,
											storeId: storeInfo.id
										})
									}}
									size="big"
								/>
								{order.error && <Message content={order.errorMsg} error />}
							</Grid.Column>
						</Grid>
					</Container>

					{ConfirmationModal}

					{order.confirmationModalOpen && (
						<Confetti
							// colors={["#B5CC18"]}
						/>
					)}

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Checkout.propTypes = {
	createOrder: PropTypes.func,
	editItemHour: PropTypes.func,
	order: PropTypes.shape({
		confirmationModalOpen: PropTypes.bool,
		error: PropTypes.bool,
		errorMsg: PropTypes.string
	}),
	removeFromCart: PropTypes.func,
	settings: PropTypes.object,
	toggleConfirmationModal: PropTypes.func
}

Checkout.defaultProps = {
	createOrder,
	editItemHour,
	order: {
		confirmationModalOpen: false,
		error: false,
		errorMsg: ""
	},
	removeFromCart,
	toggleConfirmationModal
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.order,
		...state.user,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	createOrder,
	editItemHour,
	removeFromCart,
	toggleConfirmationModal
})(Checkout)
