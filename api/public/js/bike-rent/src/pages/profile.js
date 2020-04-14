import { connect, Provider } from "react-redux"
import { changeProfilePic } from "components/secondary/authentication/v1/actions"
import { adjustTimezone } from "utils/dateFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import {
	Button,
	Container,
	Divider,
	Grid,
	Header,
	Icon,
	Menu,
	Modal,
	Responsive
} from "semantic-ui-react"
import React, { Component } from "react"
import ImagePic from "images/avatar/large/christian.jpg"
import ImageUpload from "components/primary/imageUpload/v1/"
import Moment from "react-moment"
import OrdersList from "components/secondary/lists/ordersList/v1/"
import PageFooter from "components/primary/footer/v1/"
import PageHeader from "components/primary/header/v1/"
import PaymentsList from "components/secondary/paymentMethod/v1/list/"
import PaymentsMethod from "components/secondary/paymentMethod/v1/"
import ReviewsList from "components/secondary/lists/reviewsList/v1/"
import PropTypes from "prop-types"
import store from "store"

class Profile extends Component {
	constructor(props) {
		super(props)

		const tabs = ["purchases", "reviews", "payment-methods"]
		const params = this.props.match.params
		let { tab } = params
		if (!tabs.includes(tab)) {
			tab = "purchases"
		}

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer
		const userId = auth ? user.data.user.id : null

		this.state = {
			activeItem: tab,
			auth,
			bearer,
			paymentModalOpen: false,
			user,
			userId
		}
	}

	componentDidMount() {
		if (!this.state.auth) {
			this.props.history.push("/")
		}
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name }, () => {
			// this.props.history.push(`/profile/${name}`)
		})
	}

	togglePaymentModal = () => this.setState({ paymentModalOpen: !this.state.paymentModalOpen })

	render() {
		const { activeItem, auth, bearer, paymentModalOpen, userId } = this.state
		const { data, settings } = this.props
		const { user } = data

		const AddPaymentModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.togglePaymentModal()}
				open={paymentModalOpen}
			>
				<Modal.Header>Add a new payment method</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<PaymentsMethod
							bearer={bearer}
							buttonText="Submit"
							callback={() => this.togglePaymentModal()}
						/>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		)

		const AddCardButton = (
			<Button
				color="blue"
				content="Add a payment method"
				fluid
				icon="credit card"
				onClick={() => this.togglePaymentModal()}
			/>
		)

		return (
			<Provider store={store}>
				<DisplayMetaTags page="profile" props={this.props} state={this.state} />

				<div className="mainWrapper profilePage">
					<PageHeader
						activeItem="profile"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						// content={BookingForm}
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
						<Grid>
							<Grid.Column width={4}>
								<ImageUpload
									bearer={bearer}
									callback={(bearer, file) => {
										this.props.changeProfilePic({
											bearer,
											file
										})
									}}
									img={user.img ? user.img : ImagePic}
									msg="Change your pic"
								/>
							</Grid.Column>
							<Grid.Column width={12}>
								<Header as="h1">
									{user.name}
									<Header.Subheader>
										<Icon name="clock outline" /> Joined{" "}
										<Moment
											date={adjustTimezone(user.dateCreated)}
											fromNow
											interval={60000}
										/>
									</Header.Subheader>
								</Header>
							</Grid.Column>
						</Grid>

						<Divider hidden />

						<Menu pointing secondary size="large" stackable>
							<Menu.Item
								active={activeItem === "purchases"}
								name="purchases"
								onClick={this.handleItemClick}
							/>
							<Menu.Item
								active={activeItem === "reviews"}
								name="reviews"
								onClick={this.handleItemClick}
							/>
							<Menu.Item
								active={activeItem === "payment-methods"}
								name="payment-methods"
								onClick={this.handleItemClick}
							>
								Payment Methods
							</Menu.Item>
							<Menu.Item position="right" style={{ paddingRight: 0 }}>
								<Responsive minWidth={1025}>{AddCardButton}</Responsive>
							</Menu.Item>
						</Menu>

						<Responsive maxWidth={1024}>
							{AddCardButton}
							<Divider />
						</Responsive>

						{activeItem === "purchases" && (
							<OrdersList
								bearer={bearer}
								history={this.props.history}
								useCards={false}
								userId={userId}
							/>
						)}

						{activeItem === "reviews" && (
							<ReviewsList
								bearer={bearer}
								history={this.props.history}
								myId={userId}
								userId={userId}
							/>
						)}

						{activeItem === "payment-methods" && (
							<PaymentsList bearer={bearer} canMakeDefault />
						)}
					</Container>

					{AddPaymentModal}

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Profile.propTypes = {
	changeProfilePic: PropTypes.func,
	data: PropTypes.shape({
		cart: PropTypes.array,
		user: PropTypes.shape({
			dateCreated: PropTypes.string,
			email: PropTypes.string,
			emailVerified: PropTypes.bool,
			name: PropTypes.string,
			id: PropTypes.string,
			img: PropTypes.string,
			privilege: PropTypes.string,
			username: PropTypes.string
		})
	}),
	settings: PropTypes.object
}

Profile.defaultProps = {
	changeProfilePic,
	user: {}
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.user,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	changeProfilePic
})(Profile)
