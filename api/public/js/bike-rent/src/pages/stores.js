import { connect, Provider } from "react-redux"
import { addToCart } from "components/secondary/authentication/v1/actions"
import { createReview, getStore, resetToDefault } from "redux/actions/store"
import { DisplayMetaTags } from "utils/metaFunctions"
import { formatPlural } from "utils/textFunctions"
import {
	Button,
	Container,
	Divider,
	Grid,
	Header,
	Image,
	List,
	Menu,
	Modal,
	Placeholder,
	Rating,
	Responsive
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import BikesList from "components/secondary/lists/bikesList/v1/"
import CreateReview from "components/secondary/lists/reviewsList/v1/createReview"
import MapBox from "components/primary/mapBox/v1/"
import PageFooter from "components/primary/footer/v1/"
import PageHeader from "components/primary/header/v1/"
import ReviewsList from "components/secondary/lists/reviewsList/v1/"
import StepProcess from "components/primary/step/v1/"
import StoresList from "components/secondary/lists/storesList/v1/"
import PropTypes from "prop-types"
import store from "store"

class Stores extends Component {
	constructor(props) {
		super(props)

		const params = this.props.match.params
		let { id } = params

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer
		const userId = auth ? user.data.user.id : null

		this.state = {
			activeItem: "bicycles",
			auth,
			bearer,
			cityId: "",
			id,
			modalOpen: false,
			updated: false,
			user,
			userId
		}
	}

	async componentDidMount() {
		const { id } = this.state
		if (id) {
			this.props.getStore({ id })
		}
	}

	componentWillUnmount() {
		this.setState({ id: null }, () => {
			this.props.resetToDefault()
		})
	}

	addToCart = item => {
		this.setState({ updated: !this.state.updated }, () => {
			this.props.addToCart({ item })
		})
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name }, () => {})
	}

	toggleModal = () => this.setState({ modalOpen: !this.state.modalOpen })

	render() {
		const { activeItem, auth, bearer, id, modalOpen, userId } = this.state
		const { settings } = this.props
		const { storesPage } = settings
		const { ctaButton } = storesPage
		const _store = this.props.store

		const CtaButton = (
			<Button
				basic={ctaButton.basic === "1"}
				color={ctaButton.color}
				content={ctaButton.text}
				inverted={ctaButton.inverted === "1"}
				fluid
			/>
		)

		const ReviewModal = (
			<Modal centered={false} closeIcon onClose={() => this.toggleModal()} open={modalOpen}>
				<Modal.Header>Leave a review</Modal.Header>
				<Modal.Content>
					{auth ? (
						<Modal.Description>
							<CreateReview
								callback={(comment, rating) => {
									this.props.createReview({
										bearer,
										callback: () => this.toggleModal(),
										comment,
										rating,
										storeId: _store.id
									})
								}}
								store={{
									image: _store.image,
									name: _store.name
								}}
							/>
						</Modal.Description>
					) : (
						<Modal.Description>
							<Container textAlign="center">
								<Header size="huge">Sign in to leave reviews</Header>
								<Button
									color="blue"
									content="Sign In"
									onClick={() => this.props.history.push("/signin")}
									size="big"
								/>
								<Button
									color="green"
									content="Sign Up"
									onClick={() => this.props.history.push("/signin?type=join")}
									size="big"
								/>
							</Container>
						</Modal.Description>
					)}
				</Modal.Content>
			</Modal>
		)

		const StoreList = props => {
			const { address, city, closingTime, openingTime, phoneNumber, state } = props.store
			return (
				<List divided relaxed="very" size="large">
					<List.Item>
						<List.Icon color="red" name="marker" />
						<List.Content>
							<List.Header>{address}</List.Header>
							<List.Description>
								{city}, {state}
							</List.Description>
						</List.Content>
					</List.Item>
					<List.Item>
						<List.Icon color="yellow" name="clock" />
						<List.Content>
							<List.Header>Hours</List.Header>
							<List.Description>
								{openingTime} - {closingTime}
							</List.Description>
						</List.Content>
					</List.Item>
					<List.Item>
						<List.Icon color="green" name="phone" />
						<List.Content>
							<List.Header>Phone</List.Header>
							<List.Description>{phoneNumber}</List.Description>
						</List.Content>
					</List.Item>
				</List>
			)
		}

		const StoreMenu = props => {
			return (
				<Menu fluid pointing secondary size="large" stackable>
					<Menu.Item
						active={activeItem === "bicycles"}
						name="bicycles"
						onClick={this.handleItemClick}
					/>
					<Menu.Item
						active={activeItem === "reviews"}
						name="reviews"
						onClick={this.handleItemClick}
					/>
				</Menu>
			)
		}

		const StoreMenuContent = props => {
			if (activeItem === "bicycles") {
				return (
					<BikesList
						addToCart
						cartFunction={this.addToCart}
						bikesByStore
						emptyMsgContent="There are no bikes available"
						history={props.history}
						itemsPerRow={2}
						store={{
							address: _store.address,
							city: _store.city,
							id: _store.id,
							lat: _store.lat,
							lon: _store.lon,
							name: _store.name,
							state: _store.state
						}}
						storeId={id}
						useCards={false}
					/>
				)
			}

			if (activeItem === "reviews") {
				return (
					<ReviewsList
						bearer={bearer}
						history={this.props.history}
						myId={userId}
						storeId={props.store.id}
					/>
				)
			}

			return null
		}

		const SingleStore = props => {
			const { avgRating, description, id, image, lat, lon, name, reviewCount } = props.store

			const LeftColumn = (
				<Fragment>
					<Header size="huge">
						{name}
						{id && (
							<Header.Subheader>
								<Rating
									disabled
									icon="star"
									maxRating={5}
									rating={avgRating === null ? 0 : avgRating}
								/>{" "}
								{reviewCount} {formatPlural(reviewCount, "review")}
							</Header.Subheader>
						)}
					</Header>

					{id ? (
						<Fragment>
							<Responsive maxWidth={1024}>
								<Image rounded size="large" src={image} />
							</Responsive>
							<Responsive minWidth={1025}>
								<Image fluid rounded src={image} />
							</Responsive>
						</Fragment>
					) : (
						<Placeholder fluid>
							<Placeholder.Image square />
						</Placeholder>
					)}

					<Divider hidden />

					<Header size="large" style={{ width: "100%" }}>About this business</Header>
					<p>{description}</p>
				</Fragment>
			)

			const RightColumn = name ? (
				<div style={{ width: "100%" }}>
					<MapBox
						markerId="0"
						markers={[
							{
								id,
								lat,
								lon
							}
						]}
						height="280px"
						lat={lat}
						lng={lon}
						width="100%"
					/>
					<Divider hidden />

					<div>{StoreList(props)}</div>
					<Divider hidden />

					<Button
						color="blue"
						content="Leave a review"
						fluid
						icon="star"
						onClick={this.toggleModal}
					/>
					<Divider />
					<Button
						color="olive"
						content="Proceed to checkout"
						fluid
						icon="cart"
						onClick={() => this.props.history.push("/checkout")}
					/>
				</div>
			) : (
				<Placeholder fluid>
					<Placeholder.Image square />
				</Placeholder>
			)

			return (
				<Fragment>
					<Responsive maxWidth={1024}>
						<Grid className="storeGrid" stackable>
							<Grid.Row>
								{LeftColumn}
								<Divider hidden />
							</Grid.Row>
							<Grid.Row>{RightColumn}</Grid.Row>
							<Grid.Row>
								<Divider hidden section />
								{StoreMenu(props)}
								{StoreMenuContent(props)}
							</Grid.Row>
						</Grid>
					</Responsive>

					<Responsive minWidth={1025}>
						<StepProcess activeItem="bike" index={1} />
						<Divider hidden />

						<Grid className="storeGrid">
							<Grid.Column className="leftSide" width={11}>
								{LeftColumn}
								<Divider hidden section />
								{StoreMenu(props)}
								{StoreMenuContent(props)}
							</Grid.Column>
							<Grid.Column className="rightSide" width={5}>
								{RightColumn}
							</Grid.Column>
						</Grid>
					</Responsive>
				</Fragment>
			)
		}

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="stores"
					props={this.props}
					seo={storesPage.seo}
					state={this.state}
				/>

				<div className="mainWrapper storesPage">
					<PageHeader
						activeItem="stores"
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
						{id ? (
							SingleStore(this.props)
						) : (
							<div>
								<StepProcess />

								<Header size="huge">Pick a store</Header>

								<StoresList
									extra={ctaButton.visible === "1" ? CtaButton : null}
									history={this.props.history}
									key="store"
									showCityFilter
									useCards={true}
								/>
							</div>
						)}
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>

				{ReviewModal}
			</Provider>
		)
	}
}

Stores.propTypes = {
	addToCart: PropTypes.func,
	createReview: PropTypes.func,
	getStore: PropTypes.func,
	resetToDefault: PropTypes.func,
	settings: PropTypes.object,
	store: PropTypes.shape({
		address: PropTypes.string,
		avgRating: PropTypes.string,
		bikes: PropTypes.arrayOf(
			PropTypes.shape({
				description: PropTypes.string,
				name: PropTypes.string,
				image: PropTypes.string,
				quantity: PropTypes.number
			})
		),
		city: PropTypes.string,
		closingTime: PropTypes.string,
		description: PropTypes.string,
		error: PropTypes.bool,
		id: PropTypes.number,
		image: PropTypes.string,
		images: PropTypes.arrayOf(
			PropTypes.shape({
				image: PropTypes.string
			})
		),
		lat: PropTypes.string,
		lon: PropTypes.string,
		name: PropTypes.string,
		openingTime: PropTypes.string,
		phoneNumber: PropTypes.string,
		reviewCount: PropTypes.string,
		reviews: PropTypes.arrayOf(
			PropTypes.shape({
				date_created: PropTypes.string,
				review: PropTypes.string,
				stars: PropTypes.number
			})
		),
		state: PropTypes.string,
		zipCode: PropTypes.number
	})
}

Stores.defaultProps = {
	addToCart,
	createReview,
	getStore,
	resetToDefault,
	store: {
		error: false
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.store,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	addToCart,
	createReview,
	getStore,
	resetToDefault
})(Stores)
