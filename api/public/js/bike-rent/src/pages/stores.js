import { connect, Provider } from "react-redux"
import { getStore, getStores } from "redux/actions/store"
import { fetchLocations } from "utils/selectOptions"
import { Container, Divider, Dropdown, Grid, Header, Icon, List, Menu, Responsive, Segment } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
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
		this.setState({ activeItem: name }, () => {
			
		})
	}

	render() {
		const { activeItem, auth, cityId, cityOptions, id } = this.state
		const { settings } = this.props
		console.log("eee")
		console.log(this.props)

		const SingleStore = props => {
			const { address, city, description, name, state } = props.store

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
								<Header size="huge">{name}</Header>
								
								<div>
									<Header>About this business</Header>
									<p>
										{description}
									</p>

									<Divider hidden section />

									<Menu tabular>
										<Menu.Item
											active={activeItem === "bicycles"}
											name="bicycles"
											onClick={this.handleItemClick}
										/>
										<Menu.Item
											active={activeItem === "accessories"}
											name="accessories"
											onClick={this.handleItemClick}
										/>
										<Menu.Item
											active={activeItem === "reviews"}
											name="reviews"
											onClick={this.handleItemClick}
										/>
									</Menu>
								</div>
							</Grid.Column>
							<Grid.Column className="rightSide" width={5}>
								{name ? (
									<div>
										<MapBox
											defaultCenter={{
												lat: 59.95,
												lng: 30.33
											}}
											key="AIzaSyD0Hd-I0mmRVa3WxTy-lpNJ-xAyDqWWTxM"
											lat={59.955413}
											lng={30.337844}
										/>
										<Divider hidden />
										<div>
											<List divided relaxed="very" size="large">
												<List.Item>
													<List.Icon color="red" name="marker" />
													<List.Content>
														<List.Header>
															{address}
														</List.Header>
														<List.Description>
															{city}, {state}
														</List.Description>
													</List.Content>
												</List.Item>
												<List.Item>
													<List.Icon color="yellow" name="clock" />
													<List.Content>
														<List.Header>
															Hours
														</List.Header>
														<List.Description>
															8:00 AM - 10:00 PM
														</List.Description>
													</List.Content>
												</List.Item>
												<List.Item>
													<List.Icon color="green" name="phone" />
													<List.Content>
														<List.Header>
															Phone
														</List.Header>
														<List.Description>
															(646) 923-2715
														</List.Description>
													</List.Content>
												</List.Item>
											</List>
										</div>
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
										onChange={(e, { value }) => this.setState({ newCityId: value })}
										options={cityOptions}
										placeholder="Select a city"
										search
										selection
									/>
								</div>

								<Divider />

								<StoresList
									key="city"
									retrieveItems={() => this.props.getStores({})}
									useCards={true}
									{...this.props}
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
	getStores: PropTypes.func,
	settings: PropTypes.object,
	store: PropTypes.shape({
		address: PropTypes.string,
		city: PropTypes.string,
		description: PropTypes.string,
		error: PropTypes.bool,
		id: PropTypes.number,
		image: PropTypes.string,
		lat: PropTypes.string,
		lon: PropTypes.string,
		name: PropTypes.string,
		state: PropTypes.string,
		zipCode: PropTypes.number
	})
}

Stores.defaultProps = {
	getStore,
	getStores,
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
	getStore,
	getStores
})(Stores)
