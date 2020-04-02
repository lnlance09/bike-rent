import { connect, Provider } from "react-redux"
import { getCity } from "redux/actions/city"
import { formatPlural } from "utils/textFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Button, Container, Divider, Grid, Header, Image } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import CitiesList from "components/citiesList/v1/"
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
		} else {
			slug = ""
		}

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			id,
			imgVisible: false,
			slug
		}
	}

	async componentDidMount() {
		const { id } = this.state
		if (id) {
			this.props.getCity({
				callback: () => this.setState({ imgVisible: true }),
				id
			})
		}
	}

	getId = slug => {
		const split = slug.split("-")
		return split[split.length - 1]
	}

	render() {
		const { auth, id, imgVisible, lat, lon, name, slug, storeId, zoom } = this.state
		const { city, error, settings } = this.props
		const { citiesPage } = settings
		const { ctaButton } = citiesPage

		const CtaButton = (
			<Button
				basic={ctaButton.basic === "1"}
				color={ctaButton.color}
				content={ctaButton.text}
				inverted={ctaButton.inverted === "1"}
				fluid
			/>
		)

		const SingleCity = ({ props }) => {
			const { city, description, image, state, storeCount, stores } = props.city

			return (
				<Grid>
					<Grid.Column width={11}>
						<Header as="h1" size="massive">
							About this city
						</Header>
						<Header as="p" size="big">
							{description}
						</Header>

						<Divider hidden />

						<Container textAlign="left">
							<StoresList
								cityId={id}
								history={this.props.history}
								itemsPerRow={2}
								key="store"
								storesByBike
								useCards={true}
							/>
						</Container>
					</Grid.Column>
					<Grid.Column width={5}>
						<Header size="huge">
							{storeCount !== undefined &&
								`${storeCount} ${formatPlural(storeCount, "store")} in ${
									city.name
								}`}
						</Header>

						<Divider hidden />
					</Grid.Column>
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
						imgVisible={imgVisible}
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
							<Fragment>
								<Header size="huge">
									{citiesPage.title}
									<Header.Subheader>{citiesPage.description}</Header.Subheader>
								</Header>

								<CitiesList
									emptyMsgContent="There are no featured cities"
									extra={ctaButton.visible === "1" ? CtaButton : null}
									history={this.props.history}
									key="city"
									useCards={citiesPage.useCards === "1"}
								/>
							</Fragment>
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
