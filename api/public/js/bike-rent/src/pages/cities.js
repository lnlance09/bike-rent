import { connect, Provider } from "react-redux"
import { getCity } from "redux/actions/city"
import { formatPlural } from "utils/textFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Container, Divider, Grid, Header, Image } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import CitiesList from "components/citiesList/v1/"
import ImagePic from "images/images/image-square.png"
import Logo from "components/header/v1/images/logo.svg"
import MapBox from "components/mapBox/v1/"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import store from "store"
import StoresList from "components/storesList/v1/"

class Cities extends Component {
	constructor(props) {
		super(props)

		const params = this.props.match.params
		let { slug } = params

		let id = false
		if (slug) {
			id = this.getId(slug)
		}

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			id,
			slug
		}
	}

	async componentDidMount() {
		const { id } = this.state
		if (id) {
			this.props.getCity({ id })
		}
	}

	getId = slug => {
		const split = slug.split("-")
		return split[split.length - 1]
	}

	render() {
		const { auth, id, lat, lon, name, slug, storeId, zoom } = this.state
		const { city, error, settings } = this.props
		const { citiesPage } = settings
		const { ctaButton } = citiesPage

		const SingleCity = ({ props }) => {
			const { city, description, image, state, storeCount, stores } = props.city

			return (
				<Grid>
					<Grid.Column width={11}>
						<Header as="p" size="big">
							{description}
						</Header>

						<Divider hidden />

						<Header size="huge">
							{storeCount !== undefined &&
								`Available in ${storeCount} ${formatPlural(storeCount, "store")}`}
							{storeId !== "0" && (
								<Header.Subheader>
									<a
										href={`${window.location.origin}`}
										onClick={e => {
											e.preventDefault()
											this.setState({
												storeId: "0",
												lat: "",
												lon: "",
												zoom: 10
											})
										}}
									>
										Clear filter
									</a>
								</Header.Subheader>
							)}
						</Header>

						<Divider hidden />

						<Container textAlign="left">
							<StoresList
								cityId={id}
								history={this.props.history}
								key="store"
								storesByBike
								useCards={true}
							/>
						</Container>
					</Grid.Column>
					<Grid.Column width={5}></Grid.Column>
				</Grid>
			)
		}

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="cities"
					props={this.props}
					seo={citiesPage.seo}
					state={this.state}
				/>

				<div className={`mainWrapper citiesPage ${slug}`}>
					<PageHeader
						activeItem="cities"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						backgroundImage={city.image}
						headerOne={city.city}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent={slug ? true : false}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						{id ? (
							<Fragment>
								{!error ? (
									<SingleCity props={this.props} />
								) : (
									<Container textAlign="center">
										<Image centered size="small" src={Logo} />
										<Header as="h1">This bike does not exist</Header>
									</Container>
								)}
							</Fragment>
						) : (
							<div>
								<Header size="huge">Pick a city</Header>

								<CitiesList
									key="city"
									retrieveItems={() => this.props.getCities({})}
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

Cities.propTypes = {
	city: PropTypes.shape({
		description: PropTypes.string,
		image: PropTypes.string,
		name: PropTypes.string,
		storeCount: PropTypes.number,
		stores: PropTypes.arrayOf(
			PropTypes.shape({
				lat: PropTypes.number,
				lon: PropTypes.number
			})
		)
	}),
	error: PropTypes.bool,
	getCity: PropTypes.func,
	settings: PropTypes.object
}

Cities.defaultProps = {
	city: {
		stores: []
	},
	error: false,
	getCity
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.city,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	getCity
})(Cities)
