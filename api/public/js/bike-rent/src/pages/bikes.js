import { connect, Provider } from "react-redux"
import { getBike } from "redux/actions/bike"
import { formatPlural } from "utils/textFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Button, Container, Divider, Header, Image } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import BikesList from "components/bikesList/v1/"
import ImagePic from "images/images/image-square.png"
import Logo from "components/header/v1/images/logo.svg"
import MapBox from "components/mapBox/v1/"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import store from "store"
import StoresList from "components/storesList/v1/"

class Bikes extends Component {
	constructor(props) {
		super(props)

		const params = this.props.match.params
		let { id } = params

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			id,
			lat: "",
			lon: "",
			storeId: "0",
			zoom: 10
		}
	}

	async componentDidMount() {
		const { id } = this.state
		if (id) {
			this.props.getBike({ id })
		}
	}

	render() {
		const { auth, id, lat, lon, storeId, zoom } = this.state
		const { error, settings } = this.props
		const { bikesPage } = settings
		const { ctaButton } = bikesPage

		const CtaButton = (
			<Button
				basic={ctaButton.basic === "1"}
				color={ctaButton.color}
				content={ctaButton.text}
				inverted={ctaButton.inverted === "1"}
				fluid
			/>
		)

		const RenderStoresList = ({ props }) => {
			return (
				<div style={{ textAlign: "left" }}>
					<StoresList
						bikeId={id}
						emptyMsgContent="No stores carry this bike"
						history={props.history}
						key="store"
						storesByBike
						storeId={storeId}
						useCards={true}
					/>
				</div>
			)
		}

		const SingleBike = props => {
			const { description, image, name, storeCount, stores } = props.bike

			return (
				<Container textAlign="center">
					<Image
						centered
						onError={i => (i.target.src = ImagePic)}
						rounded
						size="large"
						src={image}
					/>

					<Divider hidden />

					<Header size="huge">{name}</Header>
					<p>{description}</p>

					<Divider hidden />

					{stores.length > 0 && (
						<MapBox
							height="300px"
							lat={storeId !== "0" ? lat : stores[0].lat}
							lng={storeId !== "0" ? lon : stores[0].lon}
							markerId={storeId}
							markers={stores}
							onClickMarker={(id, lat, lon) => {
								this.setState({ storeId: id, lat, lon, zoom: 12 })
							}}
							width="100%"
							zoom={zoom}
						/>
					)}

					<Header size="huge">
						{storeCount !== undefined &&
							`Available in ${storeCount} ${formatPlural(storeCount, "store")}`}
						{storeId !== "0" && (
							<Header.Subheader>
								<a
									href={`${window.location.origin}`}
									onClick={e => {
										e.preventDefault()
										this.setState({ storeId: "0", lat: "", lon: "", zoom: 10 })
									}}
								>
									Clear filter
								</a>
							</Header.Subheader>
						)}
					</Header>

					<Divider hidden />

					<RenderStoresList props={props} />
				</Container>
			)
		}

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="bikes"
					props={this.props}
					seo={bikesPage.seo}
					state={this.state}
				/>

				<div className="mainWrapper bikesPage">
					<PageHeader
						activeItem="bikes"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						backgroundImage={bikesPage.hero.img}
						headerOne={bikesPage.hero.headerOne}
						headerTwo={bikesPage.hero.headerTwo}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent={bikesPage.useHeroImage === "1"}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						{id ? (
							<Fragment>
								{!error ? (
									SingleBike(this.props)
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
									{bikesPage.title}
									<Header.Subheader>{bikesPage.description}</Header.Subheader>
								</Header>

								<Divider hidden />

								<BikesList
									emptyMsgContent="There are no bikes available"
									extra={ctaButton.visible === "1" ? CtaButton : null}
									history={this.props.history}
									key="bike"
									useCards={bikesPage.useCards === "1"}
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

Bikes.propTypes = {
	bike: PropTypes.shape({
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
	getBike: PropTypes.func,
	settings: PropTypes.object
}

Bikes.defaultProps = {
	bike: {
		stores: []
	},
	error: false,
	getBike
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.bike,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	getBike
})(Bikes)
