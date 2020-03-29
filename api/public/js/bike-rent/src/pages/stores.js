import { connect, Provider } from "react-redux"
import { getStore } from "redux/actions/store"
import { fetchLocations } from "utils/selectOptions"
import {
	Button,
	Container,
	Divider,
	Dropdown,
	Grid,
	Header,
	Image,
	List,
	Menu,
	Responsive
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import BikesList from "components/bikesList/v1/"
import LazyLoad from "components/lazyLoad/v1/"
import MapBox from "components/mapBox/v1/"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import StepProcess from "components/step/v1/"
import StoresList from "components/storesList/v1/"
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

		this.state = {
			activeItem: "bicycles",
			auth,
			bearer,
			cityId: "",
			cityOptions: [],
			id
		}
	}

	async componentDidMount() {
		const { id } = this.state
		if (id) {
			this.props.getStore({ id })
		}

		if (id === undefined) {
			const cityOptions = await fetchLocations("")
			this.setState({ cityOptions })
		}
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name }, () => {})
	}

	render() {
		const { activeItem, auth, cityOptions, id } = this.state
		const { settings } = this.props

		const StoreList = props => {
			const { closingTime, openingTime, phoneNumber } = props.store
			return (
				<List divided relaxed="very" size="large">
					<List.Item>
						<List.Icon color="red" name="marker" />
						<List.Content>
							<List.Header>{props.address}</List.Header>
							<List.Description>
								{props.city}, {props.state}
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
				<Menu pointing secondary>
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
			if (activeItem === "accessories") {
			}

			if (activeItem === "bicycles") {
				return (
					<BikesList
						bikesByStore
						emptyMsgContent="There are no bikes available"
						history={props.history}
						itemsPerRow={2}
						storeId={id}
						useCards={false}
					/>
				)
			}

			if (activeItem === "reviews") {
			}

			return null
		}

		const SingleStore = props => {
			const { description, image, lat, lon, name } = props.store
			return (
				<Fragment>
					<Responsive maxWidth={1024}>
						<Grid className="storeGrid">
							<Grid.Row></Grid.Row>
							<Grid.Row></Grid.Row>
						</Grid>
					</Responsive>

					<Responsive minWidth={1025}>
						<StepProcess activeItem="bike" index={1} />
						<Divider hidden />

						<Grid className="storeGrid">
							<Grid.Column className="leftSide" width={11}>
								<Header dividing size="huge">
									{name}
								</Header>

								<Image fluid rounded src={image} />

								<Divider hidden />

								<div>
									<Header>About this business</Header>
									<p>{description}</p>

									<Divider hidden section />

									{StoreMenu(props)}

									{StoreMenuContent(props)}
								</div>
							</Grid.Column>
							<Grid.Column className="rightSide" width={5}>
								{name ? (
									<div>
										<MapBox height="280px" lat={lat} lng={lon} width="100%" />
										<Divider hidden />
										<div>{StoreList(props)}</div>
										<Divider hidden />
										<Button
											color="blue"
											content="Leave a review"
											fluid
											icon="star"
										/>
										<Divider />
										<Button
											color="olive"
											content="Proceed to checkout"
											fluid
											icon="cart"
										/>
									</div>
								) : (
									<LazyLoad header={false} />
								)}
							</Grid.Column>
						</Grid>
					</Responsive>
				</Fragment>
			)
		}

		return (
			<Provider store={store}>
				<div className="mainWrapper storesPage">
					<PageHeader
						activeItem="stores"
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
						{id ? (
							SingleStore(this.props)
						) : (
							<div>
								<StepProcess />

								<Header size="huge">Pick a store</Header>

								<div className="ui form big">
									<Dropdown
										fluid
										onChange={(e, { value }) =>
											this.setState({ newCityId: value })
										}
										options={cityOptions}
										placeholder="Select a city"
										search
										selection
									/>
								</div>

								<Divider />

								<StoresList
									history={this.props.history}
									key="store"
									useCards={true}
								/>
							</div>
						)}
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Stores.propTypes = {
	getStore: PropTypes.func,
	settings: PropTypes.object,
	store: PropTypes.shape({
		address: PropTypes.string,
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
	getStore,
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
	getStore
})(Stores)
